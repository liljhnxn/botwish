# WishVault — On-Chain Wishlist & Goals dApp on BotChain Mainnet

**WishVault** is a modern, elegant, and secure decentralized application (dApp) deployed on **BotChain Mainnet**. It enables users to record, lock in, track, and verifiably complete their personal life goals and dreams directly on the blockchain.

Every wish is permanently stored in the `WishVault` smart contract and bound to the creator's wallet address. There is no external database, backend, or centralized server: the blockchain is the single source of truth.

---

## 🌟 Key Features

- **Wallet Authentication**: Seamless Web3 wallet connection using Wagmi and Viem.
- **On-Chain Persistence**: Add wishes with titles (up to 80 characters) and optional descriptions (up to 280 characters).
- **Personal Vault Ownership**: Each wallet address exclusively owns its wishlist. Only the owner can mark their wish completed.
- **Milestone Completion**: Mark any active wish as completed with verifiable on-chain state updates.
- **Real-Time On-Chain Statistics**: Live count of Total, Completed, and Remaining wishes directly fetched from the smart contract.
- **Network Awareness**: Automatic detection of wrong networks with one-click switching to BotChain Mainnet (Chain ID `677`).
- **Responsive Web3 Aesthetic**: Sleek dark UI with status indicators, character counters, live transaction states, and direct links to the official BotChain Explorer.

---

## 🛠️ Technology Stack

### Smart Contract
- **Solidity**: `^0.8.24`
- **Development & Testing Framework**: Hardhat
- **EVM Libraries**: `@nomicfoundation/hardhat-toolbox`, Ethers v6, Chai

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web3 Client**: Wagmi v3 & Viem
- **Async State**: `@tanstack/react-query`
- **Icons**: Lucide React

---

## ⛓️ BotChain Mainnet Network Configuration

| Parameter | Value |
| :--- | :--- |
| **Network Name** | BotChain Mainnet |
| **Chain ID** | `677` |
| **RPC URL** | [https://rpc.botchain.ai](https://rpc.botchain.ai) |
| **Block Explorer** | [https://scan.botchain.ai](https://scan.botchain.ai) |
| **Native Currency** | BOT (18 Decimals) |
| **Total Supply** | 150 Million BOT |

---

## 📋 Smart Contract Details

- **Contract Name**: `WishVault`
- **Contract Source**: `contracts/WishVault.sol`
- **Deployed Mainnet Address**: `0xe1d531f3142080CF70e5aD776B13150176f727BA`
- **Explorer Code Link**: [View on BotChain Explorer](https://scan.botchain.ai/address/0xe1d531f3142080CF70e5aD776B13150176f727BA)

### Data Structure
```solidity
struct Wish {
    uint256 id;
    address owner;
    string title;
    string description;
    uint256 createdAt;
    bool completed;
}
```

### Core Functions
- `addWish(string calldata title, string calldata description) external returns (uint256)`: Adds a new wish, validates character limits, emits `WishAdded`.
- `completeWish(uint256 wishId) external`: Marks an owned wish as completed, validates ownership, emits `WishCompleted`.
- `getMyWishes() external view returns (Wish[] memory)`: Returns all wishes created by the caller (`msg.sender`).
- `getWishCount(address user) external view returns (uint256)`: Returns the total count of wishes for a wallet address.
- `getWish(address user, uint256 index) external view returns (Wish memory)`: Returns a single wish by index.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.x or higher (Node v20+ supported)
- **npm**: v9+ or higher
- A Web3 wallet (e.g. MetaMask, Rabby, or any browser wallet) with BotChain Mainnet configured and funded with native BOT tokens.

### 2. Installation
Clone the repository and install all dependencies:
```bash
npm install
```

### 3. Environment Configuration
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```

Configure your environment variables:
```ini
# Deployed WishVault smart contract address on BotChain Mainnet
NEXT_PUBLIC_WISH_VAULT_ADDRESS=0xe1d531f3142080CF70e5aD776B13150176f727BA

# Deployer wallet private key (only required when running deploy script)
PRIVATE_KEY=your_private_key_here

# BotChain Mainnet RPC URL
BOTCHAIN_RPC_URL=https://rpc.botchain.ai
```

---

## 🧪 Smart Contract Testing

The smart contract includes a test suite covering title and description bounds, sender authorization, non-reentrancy/duplicate completion guards, and event assertions.

Run tests:
```bash
npm run test
```

Expected output:
```text
  WishVault
    addWish
      √ A user can add a wish
      √ The title and description are stored correctly
      √ The creator address is correct
      √ The creation timestamp is recorded
      √ A new wish starts as incomplete
      √ Empty titles revert
      √ Titles exceeding 80 characters revert
      √ Descriptions exceeding 280 characters revert
      √ WishAdded events contain the correct information
    Wishlists separation across wallets
      √ Different wallets have separate wishlists
    completeWish
      √ A user can complete their own wish
      √ Another wallet cannot complete someone else's wish
      √ A wish cannot be completed twice
      √ Nonexistent wishes revert
      √ WishCompleted events contain the correct information
    getWish and getWishCount
      √ Invalid wish indexes revert

  16 passing
```

---

## 🚢 Smart Contract Deployment

To redeploy or deploy a new instance of the contract to BotChain Mainnet:

1. Ensure `PRIVATE_KEY` in `.env` is set and holds native BOT tokens.
2. Run the deployment script:
```bash
npm run deploy:mainnet
```
3. Update `NEXT_PUBLIC_WISH_VAULT_ADDRESS` in `.env` with the newly printed contract address.
4. Verify the smart contract source code on BotChain Explorer:
```bash
npm run verify <CONTRACT_ADDRESS>
```

---

## 💻 Running the Frontend

### Development Server
Start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
Create and verify the production build:
```bash
npm run build
npm run start
```

---

## 🔒 Security & Public Blockchain Notice

> **Important**:
> All wishlist data (titles, descriptions, timestamps, and wallet addresses) is stored directly on the public blockchain.
> 
> **Never include sensitive personal data, passwords, private keys, financial information, or confidential credentials in your wishes.** Anything submitted to the blockchain is permanently visible to anyone via block explorers and RPC queries.
