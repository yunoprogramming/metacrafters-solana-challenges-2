// Import Solana web3 functinalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram,
    sendAndConfirmRawTransaction,
    sendAndConfirmTransaction
} = require("@solana/web3.js");

const DEMO_FROM_SECRET_KEY = new Uint8Array(
    [
        160,  20, 189, 212, 129, 188, 171, 124,  20, 179,  80,
         27, 166,  17, 179, 198, 234,  36, 113,  87,   0,  46,
        186, 250, 152, 137, 244,  15,  86, 127,  77,  97, 170,
         44,  57, 126, 115, 253,  11,  60,  90,  36, 135, 177,
        185, 231,  46, 155,  62, 164, 128, 225, 101,  79,  69,
        101, 154,  24,  58, 214, 219, 238, 149,  86
      ]            
);

const transferSol = async() => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    // Get Keypair from Secret Key
    var from = Keypair.fromSecretKey(DEMO_FROM_SECRET_KEY);

    // Other things to try: 
    // 1) Form array from userSecretKey
    // const from = Keypair.fromSecretKey(Uint8Array.from(userSecretKey));
    // 2) Make a new Keypair (starts with 0 SOL)
    // const from = Keypair.generate();

     // get wallet balance from sender wallet
     const walletBalance = await connection.getBalance(
        new PublicKey(from.publicKey)
    );

    // get half the wallet balance
    const halfBalance = Math.round(walletBalance / 2);

    // Generate another Keypair (account we'll be sending to)
    const to = Keypair.generate();

    // Send money from "from" wallet and into "to" wallet
    var transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: to.publicKey,
            lamports: halfBalance
        })
    );

    // Sign transaction
    var signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [from]
    );
    
    const walletBalanceAfterTransaction = await connection.getBalance(
        new PublicKey(from.publicKey)
    );

    console.log(`Wallet balance before transaction: ${parseInt(walletBalance / LAMPORTS_PER_SOL)} SOL`);
    console.log('Signature is ', signature);
    console.log(`Wallet balance after transaction: ${parseInt(walletBalanceAfterTransaction / LAMPORTS_PER_SOL)} SOL`);
    console.log(`Sent ${parseInt(halfBalance) / LAMPORTS_PER_SOL} SOL to ${to.publicKey}`);
}

transferSol();
