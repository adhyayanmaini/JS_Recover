# 🔐 ETH Wallet Recovery Tool — by @richmfspectrix

This is a high-speed, Node.js-powered wallet scanner built for **mnemonic recovery, address syncing, and educational blockchain development**.

It can be used to:
- Scan for Ethereum wallet balances
- Attempt recovery of **lost mnemonics** (if you own the target address)
- Explore Ethereum address generation patterns
- Learn how HD wallets and mnemonic phrases work

---

## ⚙️ Features

- 🧠 **Mnemonic Recovery Mode** — Recover your own lost 12-word phrase by brute-forcing against a known address
- 🎲 **Random Wallet Scanner** — Generate and sync random Ethereum wallets, check their balances via **Alchemy**
- 🧾 Outputs:
  - `syncaddy.txt`: Generated addresses and mnemonics
  - `result.txt`: Matching or funded wallets (real ETH)
- 🌈 Colorful CLI with banners, progress bars, and clean logs
- 🔒 Real-time ETH mainnet interaction (Alchemy RPC)
- 💻 Works as `.js` or `.exe` app

---

## ⚠️ Legal Disclaimer

> **This tool is for educational, ethical, and personal recovery purposes only.**
> You may use it to:
> - Recover access to your own Ethereum wallets
> - Understand how HD wallet derivation works
> - Audit the strength of your mnemonic phrases
>
> **You must not use this tool to target addresses you do not own.**  
> Doing so would be unethical and possibly illegal under local and international cybersecurity laws.

---

## 🧠 Getting Started

### 1. Clone the Repo
```bash
git clone https://github.com/yourusername/eth-wallet-recovery-tool
cd eth-wallet-recovery-tool
