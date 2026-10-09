import { ethers, network } from "hardhat";

async function main() {
  console.log("=========================================");
  console.log("       BotWish Deployment Script         ");
  console.log("=========================================\n");

  const [deployer] = await ethers.getSigners();
  if (!deployer) {
    throw new Error("No deployer account configured. Please check your PRIVATE_KEY in .env");
  }

  const balance = await ethers.provider.getBalance(deployer.address);
  const networkName = network.name;
  const chainId = (await ethers.provider.getNetwork()).chainId;

  console.log(`Deploying with account: ${deployer.address}`);
  console.log(`Account balance:       ${ethers.formatEther(balance)} BOT`);
  console.log(`Network Name:          ${networkName}`);
  console.log(`Chain ID:              ${chainId.toString()}`);

  if (balance === 0n && networkName !== "hardhat") {
    console.warn("WARNING: Deployer account has 0 BOT balance. Deployment will likely fail if gas is required.");
  }

  console.log("\nDeploying BotWish contract...");
  const BotWishFactory = await ethers.getContractFactory("BotWish");
  const botWish = await BotWishFactory.deploy();

  await botWish.waitForDeployment();
  const contractAddress = await botWish.getAddress();

  console.log("\n=========================================");
  console.log("BotWish Deployed Successfully!");
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Network Name:     ${networkName}`);
  console.log(`Chain ID:         ${chainId.toString()}`);
  console.log(`Explorer Link:    https://scan.bohr.life/address/${contractAddress}`);
  console.log("=========================================\n");
  console.log("Update your .env file with:");
  console.log(`NEXT_PUBLIC_BOT_WISH_ADDRESS=${contractAddress}`);
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
