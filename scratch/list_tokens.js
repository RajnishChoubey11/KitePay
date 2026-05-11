const { Connection, PublicKey, clusterApiUrl } = require('@solana/web3.js');

async function main() {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const treasury = new PublicKey('3XTXnX8XyyiKAjC1dgtLXPExihjqPVVmfcfPQPYQ4AZE');
    
    console.log("Checking all token accounts for:", treasury.toBase58());
    
    try {
        const accounts = await connection.getParsedTokenAccountsByOwner(treasury, {
            programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
        });
        
        if (accounts.value.length === 0) {
            console.log("No token accounts found.");
        } else {
            accounts.value.forEach((acc, i) => {
                const info = acc.account.data.parsed.info;
                console.log(`${i+1}. Mint: ${info.mint}, Balance: ${info.tokenAmount.uiAmount}`);
            });
        }
    } catch (e) {
        console.error("Error fetching accounts:", e);
    }
}

main();
