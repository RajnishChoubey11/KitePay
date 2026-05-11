import { Connection, PublicKey, Transaction, clusterApiUrl } from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferCheckedInstruction,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";

export const SOLANA_DEVNET_URL = clusterApiUrl("devnet");
export const KITEPAY_TREASURY_PUBLIC_KEY = new PublicKey(
  "DTqCbfDUjY7H5V3qyF7DcnvmrzymyKombTNwNjvYV17a"
);
export const USDC_DEVNET_MINTS = [
  "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU", // Circle Official (Confirmed from wallet)
  "4zMMC9srtvS2wSRy37Ho2QHUiEz6f77dR8Z3N8QzK4xP", // Alternative Circle
  "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr", // Common Legacy
  "2tWC4JAdL4AxEFJySziYJfsAnW2MHKRo98vbAPiRDSk8", // Common Mock
];

export const USDC_DEVNET_MINT = new PublicKey(
  process.env.NEXT_PUBLIC_USDC_MINT || USDC_DEVNET_MINTS[0]
);

export const USDC_DECIMALS = 6;

export function createSolanaConnection() {
  return new Connection(SOLANA_DEVNET_URL, "confirmed");
}

export async function getOrCreateAssociatedTokenAccount(
  connection: Connection,
  payer: PublicKey,
  owner: PublicKey,
  mint: PublicKey
) {
  const tokenAccount = await getAssociatedTokenAddress(
    mint,
    owner,
    false,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  const accountInfo = await connection.getAccountInfo(tokenAccount);
  const instructions = [];

  if (!accountInfo) {
    instructions.push(
      createAssociatedTokenAccountInstruction(
        payer,
        tokenAccount,
        owner,
        mint,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      )
    );
  }

  return { tokenAccount, instructions };
}

async function findUsdcSourceTokenAccount(
  connection: Connection,
  owner: PublicKey
): Promise<PublicKey | null> {
  const associatedTokenAccount = await getAssociatedTokenAddress(
    USDC_DEVNET_MINT,
    owner,
    false,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  const [tokenAccounts, token2022Accounts] = await Promise.all([
    connection.getParsedTokenAccountsByOwner(owner, { programId: TOKEN_PROGRAM_ID }),
    connection.getParsedTokenAccountsByOwner(owner, { programId: TOKEN_2022_PROGRAM_ID }),
  ]);

  const allAccounts = [...tokenAccounts.value, ...token2022Accounts.value];

  const fundedAccount = allAccounts.find((account) => {
    const parsed = account.account.data.parsed;
    const mint = parsed.info.mint;
    const isUsdc = USDC_DEVNET_MINTS.includes(mint) || mint === USDC_DEVNET_MINT.toBase58();
    const amount = Number(parsed.info.tokenAmount.amount || 0);
    return isUsdc && amount > 0;
  });

  if (fundedAccount) {
    return fundedAccount.pubkey;
  }

  const ataInfo = await connection.getAccountInfo(associatedTokenAccount);
  if (ataInfo) {
    return associatedTokenAccount;
  }

  // Debug logging: what tokens DO they have?
  if (allAccounts.length === 0) {
    console.warn(`No SPL token accounts found for wallet ${owner.toBase58()} on Devnet.`);
  } else {
    console.log(`Token accounts found for ${owner.toBase58()}:`);
    allAccounts.forEach((acc) => {
      console.log(`- Mint: ${acc.account.data.parsed.info.mint}, Balance: ${acc.account.data.parsed.info.tokenAmount.uiAmount}`);
    });
  }

  return null;
}

export async function transferUsdcPayrollBatch(
  connection: Connection,
  walletPublicKey: PublicKey,
  sendTransaction: (transaction: Transaction, connection: Connection) => Promise<string>,
  employeePayments: Array<{ walletAddress: string; amountUsd: number }>,
  treasuryAmountUsd: number
) {
  if (!employeePayments.length) {
    throw new Error("No employee payments provided.");
  }

  const instructions: Array<import("@solana/web3.js").TransactionInstruction> = [];
  const sourceTokenAccount = await findUsdcSourceTokenAccount(connection, walletPublicKey);
  if (!sourceTokenAccount) {
    throw new Error(
      "Source USDC wallet missing. Please fund your wallet with Devnet USDC (Mint: 4zMMC9srtvS2wSRy37Ho2QHUiEz6f77dR8Z3N8QzK4xP) from a faucet like https://faucet.circle.com/ or https://spl-token-faucet.com/ and retry."
    );
  }

  const sourceBalance = await connection.getTokenAccountBalance(sourceTokenAccount);
  const totalEmployeeAmount = employeePayments.reduce((sum, payment) => sum + payment.amountUsd, 0);
  const totalAmountUsd = totalEmployeeAmount + treasuryAmountUsd;
  const totalAmountBaseUnits = Math.round(totalAmountUsd * 10 ** USDC_DECIMALS);

  if (Number(sourceBalance.value.amount) < totalAmountBaseUnits) {
    throw new Error(
      `Insufficient USDC balance. Required ${totalAmountUsd.toFixed(6)} USDC, but source has ${Number(sourceBalance.value.amount) / 10 ** USDC_DECIMALS
      } USDC.`
    );
  }

  const solBalance = await connection.getBalance(walletPublicKey);
  const mustCoverAtaCreation = 1 + employeePayments.length; // treasury + each employee if needed
  const minimumSol = 1000000 * Math.min(2, mustCoverAtaCreation);
  if (solBalance < minimumSol) {
    throw new Error(
      "Not enough SOL to pay transaction fees and create token accounts on Devnet. Fund your wallet with Devnet SOL and retry."
    );
  }

  const treasuryDestination = await getOrCreateAssociatedTokenAccount(
    connection,
    walletPublicKey,
    KITEPAY_TREASURY_PUBLIC_KEY,
    USDC_DEVNET_MINT
  );
  instructions.push(...treasuryDestination.instructions);

  const treasuryAmount = Math.round(treasuryAmountUsd * 10 ** USDC_DECIMALS);
  if (treasuryAmount > 0) {
    instructions.push(
      createTransferCheckedInstruction(
        sourceTokenAccount,
        USDC_DEVNET_MINT,
        treasuryDestination.tokenAccount,
        walletPublicKey,
        treasuryAmount,
        USDC_DECIMALS
      )
    );
  }

  for (const payment of employeePayments) {
    if (!payment.walletAddress) {
      throw new Error("Employee wallet address missing.");
    }

    const employeeWalletKey = new PublicKey(payment.walletAddress);
    const destination = await getOrCreateAssociatedTokenAccount(
      connection,
      walletPublicKey,
      employeeWalletKey,
      USDC_DEVNET_MINT
    );
    instructions.push(...destination.instructions);

    const amount = Math.round(payment.amountUsd * 10 ** USDC_DECIMALS);
    if (amount <= 0) {
      throw new Error("Each employee payment must be greater than zero.");
    }

    instructions.push(
      createTransferCheckedInstruction(
        sourceTokenAccount,
        USDC_DEVNET_MINT,
        destination.tokenAccount,
        walletPublicKey,
        amount,
        USDC_DECIMALS
      )
    );
  }

  const transaction = new Transaction().add(...instructions);
  transaction.feePayer = walletPublicKey;
  transaction.recentBlockhash = (await connection.getLatestBlockhash("confirmed")).blockhash;

  try {
    const signature = await sendTransaction(transaction, connection);
    await connection.confirmTransaction(signature, "confirmed");
    return signature;
  } catch (error) {
    throw new Error(
      `Wallet transaction failed: ${error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
