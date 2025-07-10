#!/usr/bin/env node

const fs = require('fs');
const colors = require('colors');
const readline = require('readline');
const bip39 = require('bip39');
const { ethers } = require('ethers');
const cliProgress = require('cli-progress');

// CLI Setup
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const ask = (q) => new Promise(res => rl.question(q, res));

// ASCII Header
const splash = `
 /$$$$$$$                       /$$$$$$                                          /$$      
| $$__  $$                     /$$__  $$                                        | $$      
| $$  \ $$  /$$$$$$  /$$$$$$$ | $$  \__/  /$$$$$$   /$$$$$$   /$$$$$$   /$$$$$$$| $$$$$$$ 
| $$$$$$$/ |____  $$| $$__  $$|  $$$$$$  /$$__  $$ |____  $$ /$$__  $$ /$$_____/| $$__  $$
| $$__  $$  /$$$$$$$| $$  \ $$ \____  $$| $$$$$$$$  /$$$$$$$| $$  \__/| $$      | $$  \ $$
| $$  \ $$ /$$__  $$| $$  | $$ /$$  \ $$| $$_____/ /$$__  $$| $$      | $$      | $$  | $$
| $$  | $$|  $$$$$$$| $$  | $$|  $$$$$$/|  $$$$$$$|  $$$$$$$| $$      |  $$$$$$$| $$  | $$
|__/  |__/ \_______/|__/  |__/ \______/  \_______/ \_______/|__/       \_______/|__/  |__/
                                                                                          
                                                                                          
                                                                                          
`.cyan;

// Save Functions
const saveResult = (line) => fs.writeFileSync('result.txt', line + '\n', { flag: 'a' });
const saveSyncAddy = (line) => fs.writeFileSync('syncaddy.txt', line + '\n', { flag: 'a' });

(async () => {
  console.clear();
  console.log(splash);
  console.log("Made by @adhyayanmaini | Adhyayan Maini\n".magenta);

  const apiKey = await ask("Enter your Alchemy Mainnet API KEY only (no full URL): ");
  const alchemyRpc = `https://eth-mainnet.g.alchemy.com/v2/${apiKey}`;
  const provider = new ethers.providers.JsonRpcProvider(alchemyRpc);

  console.log("\nChoose Search Mode:");
  console.log("1. Random Search");
  console.log("2. Specific Search");

  const mode = await ask("Enter (1 or 2): ");

  if (mode === "2") {
    const target = (await ask("Enter the target Ethereum address (0x...): ")).toLowerCase();
    console.log("\n[+] Starting Specific Mnemonic Search...\n".yellow);
    let attempts = 0;

    while (true) {
      const mnemonic = bip39.generateMnemonic();
      const wallet = ethers.Wallet.fromMnemonic(mnemonic);
      const address = wallet.address.toLowerCase();
      attempts++;

      if (address === target) {
        let balance = "unknown";
        try {
          const wei = await provider.getBalance(address);
          balance = ethers.utils.formatEther(wei);
        } catch (err) {
          balance = "error_fetching_balance";
        }

        const result = `TrgtAddy: ${address} | Mnemonic: ${mnemonic} | Balance: ${balance} ETH`;
        console.log(`\n[✓] MATCH FOUND`.green.bold);
        console.log(result.yellow);
        saveResult(result);
        break;
      }

      if (attempts % 100 === 0) {
        process.stdout.write(`Attempts: ${attempts} | Last: ${address}      \r`);
      }
    }

    rl.close();
  }

  else if (mode === "1") {
    const count = parseInt(await ask("How many wallets to generate and check for balance: "));
    console.log("\n[+] Starting Random Wallet Scan (Only Saving With Balance)...\n".yellow);

    const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    bar.start(count, 0);

    for (let i = 0; i < count; i++) {
      const mnemonic = bip39.generateMnemonic();
      const wallet = ethers.Wallet.fromMnemonic(mnemonic);
      const address = wallet.address.toLowerCase();

      try {
        const wei = await provider.getBalance(address);
        const eth = parseFloat(ethers.utils.formatEther(wei));

        if (eth > 0) {
          const result = `TrgtAddy: ${address} | Mnemonic: ${mnemonic} | Balance: ${eth} ETH`;
          console.log(`\n[✓] BALANCE FOUND`.green.bold);
          console.log(result.yellow);
          saveResult(result);
          bar.stop();
          rl.close();
          return;
        }
      } catch (err) {
        // continue silently on error
      }

      saveSyncAddy(address);
      bar.update(i + 1);
    }

    bar.stop();
    console.log("\n[!] Finished. No wallet with balance found.".gray);
    rl.close();
  }

  else {
    console.log("\nInvalid input. Exiting...".red);
    rl.close();
  }
})();
