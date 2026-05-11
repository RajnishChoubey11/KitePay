const { Connection, PublicKey, clusterApiUrl } = require('@solana/web3.js');
const { getAssociatedTokenAddress } = require('@solana/spl-token');

async function main() {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const treasury = new PublicKey('3XTXnX8XyyiKAjC1dgtLXPExihjqPVVmfcfPQPYQ4AZE');
    const usdcMint = new PublicKey('4zMMC9srtvS2wSRy37Ho2QHUiEz6f77dR8Z3N8QzK4xP');
    
    const ata = await getAssociatedTokenAddress(usdcMint, treasury);
    console.log("Treasury ATA:", ata.toBase58());
    
    try {
        const balance = await connection.getTokenAccountBalance(ata);
        console.log("USDC Balance:", balance.value.uiAmount);
    } catch (e) {
        console.log("ATA does not exist or has no balance.");
    }
}

main();
