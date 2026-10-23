# 📜 WishVault: Whitepaper & Pitch Deck

> **Decentralized Life Goals & On-Chain Wishlist Protocol on BotChain Mainnet**  
> *Contract Address*: `0xe1d531f3142080CF70e5aD776B13150176f727BA` (BotChain Mainnet, Chain ID: 677)  
> *Explorer*: [https://scan.botchain.ai/address/0xe1d531f3142080CF70e5aD776B13150176f727BA](https://scan.botchain.ai/address/0xe1d531f3142080CF70e5aD776B13150176f727BA)  
> *Repository*: [GitHub / WishVault](https://github.com/liljhnxn/botwish)

---

# PART 1: 📊 PITCH DECK (Slide-by-Slide)

### Slide 1: Cover & Vision
* **Title**: **WishVault**
* **Tagline**: Lock In Your Dreams. Prove Your Journey. Forever On-Chain.
* **Mission**: Empowering individuals to anchor their aspirations and milestones to the blockchain with true cryptographic ownership and zero censorship.
* **Ecosystem**: Built for **BotChain** (EVM-compatible high-performance mainnet).

---

### Slide 2: The Problem
1. **Centralized Vulnerability**: Traditional goal-tracking apps (Notion, Apple Notes, Web2 habit apps) store sensitive life goals on centralized servers subject to data harvesting, server shutdowns, and account suspensions.
2. **Lack of Verifiable Proof**: Accomplishments in Web2 are self-proclaimed screenshots with zero cryptographic timestamping or verifiable permanence.
3. **No True Digital Ownership**: In Web2 apps, users rent access to their own memories and goals. If the platform shuts down, their history disappears.

---

### Slide 3: The Solution — WishVault
* **100% On-Chain Persistence**: Every wish, goal, and milestone is stored directly in the `WishVault` Solidity smart contract.
* **Cryptographic Self-Sovereignty**: Only the private key holder (wallet owner) can complete or manage their wishes.
* **Serverless & Trustless**: Zero backend databases, zero middlemen, and zero vendor lock-in. The blockchain is the sole source of truth.
* **Permanent Timestamps**: Every goal creation and completion is cryptographically timestamped by the block header.

---

### Slide 4: Product & Core Architecture
* **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Wagmi v3 & Viem for lightweight, reactive Web3 interactions.
* **Smart Contract Layer**: Gas-optimized Solidity `^0.8.24` with native UTF-8 length validation and an $O(1)$ indexing mapping for lightning-fast lookups.
* **Network Guard**: Built-in RPC auto-detection with 1-click network switching to BotChain Mainnet (Chain ID `677`).
* **Live Analytics**: Real-time contract reads for Total, Completed, and Pending wishes with direct block explorer transaction tracking.

---

### Slide 5: Market Opportunity & Use Cases
* **Target Audience**:
  * **Web3 Enthusiasts & DAOs**: Public commitment devices and personal accountability.
  * **Builders & Creators**: Roadmap milestone tracking verifiable by their community.
  * **Crypto Natives**: Immutable bucket lists, milestone registries, and personal time-capsules.
* **Market Fit**: Bridges the growing intersection of decentralized identity (DID), personal accountability tooling, and on-chain lifestyle dApps.

---

### Slide 6: Live Traction & Deployment
* **Main Smart Contract**: Fully deployed on BotChain Mainnet (`0xe1d531f3142080CF70e5aD776B13150176f727BA`).
* **Test Coverage**: Comprehensive unit test suite with 100% passing tests covering edge cases, UTF-8 boundaries, and unauthorized completion checks.
* **User Experience**: Mobile-responsive dark-mode dApp with character count limits, gas estimation, and toast feedback.

---

### Slide 7: Roadmap
* **Phase 1 (Current - Hackathon MVP)**:
  * Deploy core `WishVault` smart contract on Botchain.
  * Next.js 14 reactive dApp with Wagmi/Viem integration.
  * Live stats and Botchain explorer links.
* **Phase 2 (Social & Badging)**:
  * Soulbound Token (SBT) minting upon milestone completion.
  * Public sharable profile links (`/vault/[address]`).
* **Phase 3 (Accountability Pools & Staking)**:
  * Commitment staking: Lock BOT tokens and reclaim them only upon completing your goal.
  * Community peer-review verification for team goals.

---

### Slide 8: The Team & Summary
* **Commitment**: Built with love for the Botchain ecosystem to demonstrate clean EVM architecture, top-tier UX, and decentralized data sovereignty.
* **Try the App**: Connect MetaMask or any EVM wallet on BotChain Mainnet!

---
---

# PART 2: 📄 TECHNICAL WHITEPAPER

## 1. Abstract
WishVault is a decentralized, serverless protocol designed to bring human aspirations and life milestones onto the blockchain. By eliminating centralized intermediaries and database dependencies, WishVault provides an unalterable, cryptographically signed ledger of personal ambitions. Built on the BotChain Mainnet, WishVault pairs gas-efficient smart contract storage with an intuitive, modern Web3 interface.

---

## 2. System Architecture

```
+-------------------------------------------------------+
|                    Client Layer                       |
|   Next.js 14 (App Router) + TypeScript + Tailwind CSS |
|          Wagmi v3 / Viem / TanStack React Query       |
+---------------------------+---------------------------+
                            |
                     RPC (EIP-1193)
                            |
+---------------------------v---------------------------+
|               BotChain Mainnet (EVM)                  |
|                   Chain ID: 677                       |
|           RPC: https://rpc.botchain.ai                |
|                                                       |
|       +---------------------------------------+       |
|       |         WishVault.sol (v0.8.24)       |       |
|       |  - addWish(title, description)        |       |
|       |  - completeWish(wishId)               |       |
|       |  - getMyWishes() -> Wish[]            |       |
|       |  - getWishCount(user) -> uint256      |       |
|       +---------------------------------------+       |
+-------------------------------------------------------+
```

### 2.1 Smart Contract Layer
The core protocol is encapsulated in [WishVault.sol](file:///c:/Users/PROGRESSIVE/Documents/Isaac%20work/Wishvault/contracts/WishVault.sol).

* **Data Model**:
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
* **$O(1)$ Wish Resolution**:
  To avoid iterating over dynamic arrays when verifying wish ownership and state transitions, the contract maintains an internal lookup map:
  ```solidity
  struct WishLocation {
      address owner;
      uint256 index;
      bool exists;
  }
  mapping(uint256 => WishLocation) private _wishLocations;
  ```
  This guarantees constant-time resolution during `completeWish(uint256 wishId)` invocations.

* **Native UTF-8 Length Validation**:
  Rather than counting raw byte lengths (which could prematurely truncate multi-byte characters like emojis or international scripts), `WishVault` implements internal UTF-8 code point decoding `_utf8Length()`:
  * Maximum Title Length: **80 code points**
  * Maximum Description Length: **280 code points**

### 2.2 Security & Access Controls
* **Custom Errors**: Employs custom Solidity errors (`EmptyTitle`, `TitleTooLong`, `DescriptionTooLong`, `WishNotFound`, `NotWishOwner`, `WishAlreadyCompleted`) for minimal execution gas and precise debugging revert reasons.
* **Strict Ownership Guard**: State mutations on individual wishes are strictly limited to `msg.sender == location.owner`.
* **State Machine Consistency**: Once marked `completed = true`, a wish cannot be reverted or completed again, preserving the historical integrity of the milestone.

---

## 3. Network & Deployment Specifications

| Attribute | Specification |
| :--- | :--- |
| **Network** | BotChain Mainnet |
| **Chain ID** | `677` |
| **RPC Endpoint** | `https://rpc.botchain.ai` |
| **Block Explorer** | `https://scan.botchain.ai` |
| **Currency Symbol** | `BOT` (18 Decimals) |
| **Total Supply** | 150 Million BOT |
| **Contract Address** | `0xe1d531f3142080CF70e5aD776B13150176f727BA` |
| **Compiler Version** | Solidity `0.8.24` (200 optimizer runs) |
| **License** | MIT |

---

## 4. Economic Model & Sustainability
1. **Zero Protocol Fees**: Creating and completing wishes incurs only standard Botchain network gas fees, ensuring complete accessibility.
2. **Future Value Capture**:
   * **Optional SBT Minting**: Mint completed wishes as permanent Soulbound NFTs for a nominal network fee.
   * **Staked Accountability (Staking Pools)**: Users lock BOT tokens behind a commitment with automated slash/reward logic.

---

## 5. Conclusion
WishVault is more than a dApp—it is a digital testament to human intention. By harnessing Botchain's high-speed, cost-effective infrastructure, WishVault turns personal aspirations into immutable on-chain accomplishments.
