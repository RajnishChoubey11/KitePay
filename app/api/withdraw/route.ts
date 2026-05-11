import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Employee from "@/models/Employee";
import Company from "@/models/Company";
import { 
  Connection, 
  Keypair, 
  PublicKey, 
  Transaction, 
  sendAndConfirmTransaction 
} from "@solana/web3.js";
import { 
  createTransferCheckedInstruction, 
  getOrCreateAssociatedTokenAccount 
} from "@solana/spl-token";
import bs58 from "bs58";
import { 
  SOLANA_DEVNET_URL, 
  USDC_DEVNET_MINT, 
  USDC_DECIMALS, 
  KITEPAY_TREASURY_PUBLIC_KEY,
  findUsdcSourceTokenAccount
} from "@/lib/solana";


type JwtPayload = {
  id: string;
  type: string;
};

function formatTimestamp() {
  return new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    if (payload.type !== "EMPLOYEE") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const amount = Number(body.amount || 0);
    const method = String(body.method || "INR bank transfer");

    if (!amount || amount <= 0) {
      return NextResponse.json({ message: "Invalid withdraw amount." }, { status: 400 });
    }

    await connectDB();

    const employee = await Employee.findById(payload.id);
    if (!employee) {
      return NextResponse.json({ message: "Employee not found" }, { status: 404 });
    }

    if (!employee.walletAddress) {
      return NextResponse.json({ message: "Please register a wallet address before withdrawing." }, { status: 400 });
    }

    const company = await Company.findOne({ "employees.employeeId": employee._id });
    if (!company) {
      return NextResponse.json({ message: "No payroll company found for this employee." }, { status: 404 });
    }

    const balance = (employee.transactions as Array<{ status: string; amount: number }>).reduce(
      (sum, tx) => sum + (tx.status === "Available" || tx.status === "Available in KitePay wallet" || tx.status === "Completed" ? tx.amount : 0),
      0
    );

    if (amount > balance) {
      return NextResponse.json({ message: "Insufficient available balance." }, { status: 400 });
    }

    let solanaSignature = null;

    // Handle Crypto Wallet Transfer
    if (method === "crypto wallet transfer") {
      try {
        const secretKeyString = process.env.KITEPAY_TREASURY_SECRET_KEY;
        if (!secretKeyString) {
          console.warn("KITEPAY_TREASURY_SECRET_KEY not found. Skipping actual Solana transfer.");
        } else {
          let secretKey: Uint8Array;
          if (secretKeyString.trim().startsWith("[")) {
            secretKey = Uint8Array.from(JSON.parse(secretKeyString));
          } else {
            secretKey = bs58.decode(secretKeyString.trim());
          }
          
          const treasuryKeypair = Keypair.fromSecretKey(secretKey);

          const connection = new Connection(SOLANA_DEVNET_URL, "confirmed");

          const destinationWallet = new PublicKey(employee.walletAddress);
          
          // Find source token account (supports multiple USDC mints)
          const sourceATA = await findUsdcSourceTokenAccount(connection, treasuryKeypair.publicKey);
          
          if (!sourceATA) {
            throw new Error(`Treasury wallet does not have a USDC token account on Devnet. Please fund ${treasuryKeypair.publicKey.toBase58()} with Devnet USDC.`);
          }
          
          const destinationATA = await getOrCreateAssociatedTokenAccount(

            connection,
            treasuryKeypair,
            USDC_DEVNET_MINT,
            destinationWallet
          );

          const amountBaseUnits = Math.round(amount * 10 ** USDC_DECIMALS);

          const transaction = new Transaction().add(
            createTransferCheckedInstruction(
              sourceATA,
              USDC_DEVNET_MINT,
              destinationATA.address,
              treasuryKeypair.publicKey,
              amountBaseUnits,
              USDC_DECIMALS
            )
          );

          solanaSignature = await sendAndConfirmTransaction(connection, transaction, [treasuryKeypair]);
        }
      } catch (solError) {
        console.error("CRITICAL: Solana transfer failed in API:", solError);
        return NextResponse.json({ 
          message: `Crypto transfer failed: ${solError instanceof Error ? solError.message : String(solError)}. Please ensure treasury has enough USDC and SOL.` 
        }, { status: 500 });
      }

    }

    const timestamp = formatTimestamp();
    
    // Update existing payouts to "Withdrawn" status for employee
    employee.transactions.forEach((tx: any) => {
      if (tx.status === "Available" || tx.status === "Available in KitePay wallet" || tx.status === "Completed") {
        tx.status = "Withdrawn";
      }
    });

    // Update existing payouts to "Withdrawn" status for company
    company.transactions.forEach((tx: any) => {
      if (tx.employeeId.toString() === employee._id.toString() && 
         (tx.status === "Available" || tx.status === "Available in KitePay wallet" || tx.status === "Completed")) {
        tx.status = "Withdrawn";
      }
    });

    await Promise.all([employee.save(), company.save()]);

    return NextResponse.json({
      status: "Completed",
      message: `Withdraw successful! $${amount} transferred to ${employee.walletAddress} via ${method}.`,
      signature: solanaSignature,
      walletAddress: employee.walletAddress,
      amount,
      method,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "JsonWebTokenError") {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
