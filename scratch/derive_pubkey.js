const bs58 = require('bs58');
const { Keypair } = require('@solana/web3.js');
const fs = require('fs');
const path = require('path');

async function main() {
    const envPath = path.join(process.cwd(), '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/KITEPAY_TREASURY_SECRET_KEY=(.*)/);
    
    if (!match) {
        console.log("Secret key not found in .env.local");
        return;
    }
    
    const secretKeyString = match[1].trim();
    let secretKey;
    
    // Handle bs58 version differences
    const decode = typeof bs58.decode === 'function' ? bs58.decode : bs58.default.decode;
    
    if (secretKeyString.startsWith('[')) {
        secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    } else {
        secretKey = decode(secretKeyString);
    }
    
    const keypair = Keypair.fromSecretKey(secretKey);
    console.log("Derived Public Key:", keypair.publicKey.toBase58());
}

main();
