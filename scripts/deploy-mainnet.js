const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function main() {
  console.log("=========================================");
  console.log("   WishVault BotChain Mainnet Deployer   ");
  console.log("=========================================\n");

  const rpcUrl = process.env.BOTCHAIN_RPC_URL || "https://rpc.botchain.ai";
  const rawKey = process.env.PRIVATE_KEY?.trim();

  if (!rawKey) {
    throw new Error("PRIVATE_KEY not found in .env file.");
  }

  const privateKey = rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`;
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  const network = await provider.getNetwork();
  console.log(`Network Name:  ${network.name}`);
  console.log(`Chain ID:      ${network.chainId.toString()}`);
  console.log(`RPC URL:       ${rpcUrl}`);

  if (network.chainId !== 677n) {
    console.warn(`[WARNING] Expected Chain ID 677, but received ${network.chainId.toString()}`);
  }

  const wallet = new ethers.Wallet(privateKey, provider);
  console.log(`Deployer Address: ${wallet.address}`);

  const balance = await provider.getBalance(wallet.address);
  console.log(`Wallet Balance:   ${ethers.formatEther(balance)} BOT`);

  if (balance === 0n) {
    throw new Error("Wallet has 0 BOT balance. Please fund your wallet on BotChain Mainnet.");
  }

  // Load contract artifact
  const artifactPath = path.join(__dirname, "../artifacts/contracts/WishVault.sol/WishVault.json");
  if (!fs.existsSync(artifactPath)) {
    throw new Error(`Artifact not found at ${artifactPath}. Please run hardhat compile first.`);
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);

  // Check gas price - use exact network base gas price to minimize gas fees
  const feeData = await provider.getFeeData();
  const gasPrice = feeData.gasPrice || ethers.parseUnits("20", "gwei");
  console.log(`Gas Price:        ${ethers.formatUnits(gasPrice, "gwei")} gwei (${gasPrice.toString()} wei)`);

  const deployTx = await factory.getDeployTransaction();
  const estimatedGas = await provider.estimateGas(deployTx);
  console.log(`Estimated Gas:    ${estimatedGas.toString()} units`);
  
  const estimatedCost = estimatedGas * gasPrice;
  console.log(`Estimated Cost:   ${ethers.formatEther(estimatedCost)} BOT`);

  if (balance < estimatedCost) {
    throw new Error(`Insufficient funds: Need ~${ethers.formatEther(estimatedCost)} BOT but wallet has ${ethers.formatEther(balance)} BOT`);
  }

  console.log("\nBroadcasting deployment transaction (using minimal gas price)...");
  // Set gasLimit with a safe 10% buffer over estimate, and exact minimal gasPrice
  const gasLimit = (estimatedGas * 110n) / 100n;
  const contract = await factory.deploy({
    gasPrice: gasPrice,
    gasLimit: gasLimit,
  });

  const deploymentTx = contract.deploymentTransaction();
  console.log(`Transaction Hash: ${deploymentTx.hash}`);
  console.log(`Explorer Tx:      https://scan.botchain.ai/tx/${deploymentTx.hash}`);
  console.log("Waiting for block confirmation...");

  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();
  const receipt = await deploymentTx.wait(1);

  const actualGasUsed = receipt.gasUsed;
  const actualCost = actualGasUsed * receipt.gasPrice;

  console.log("\n=========================================");
  console.log("🎉 WishVault Mainnet Deployment Succeeded!");
  console.log("=========================================");
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Actual Gas Used:  ${actualGasUsed.toString()} units`);
  console.log(`Total Gas Fee:    ${ethers.formatEther(actualCost)} BOT (economical & minimal!)`);
  console.log(`Explorer Link:    https://scan.botchain.ai/address/${contractAddress}`);
  console.log("=========================================\n");

  // Output new env snippet
  console.log("Updating configuration with new mainnet address...");
  const envPath = path.join(__dirname, "../.env");
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, "utf8");
    envContent = envContent.replace(
      /NEXT_PUBLIC_WISH_VAULT_ADDRESS=.*/g,
      `NEXT_PUBLIC_WISH_VAULT_ADDRESS=${contractAddress}`
    );
    envContent = envContent.replace(
      /NEXT_PUBLIC_BOT_WISH_ADDRESS=.*/g,
      `NEXT_PUBLIC_BOT_WISH_ADDRESS=${contractAddress}`
    );
    if (!envContent.includes("NEXT_PUBLIC_WISH_VAULT_ADDRESS")) {
      envContent += `\nNEXT_PUBLIC_WISH_VAULT_ADDRESS=${contractAddress}`;
    }
    if (!envContent.includes("NEXT_PUBLIC_BOT_WISH_ADDRESS")) {
      envContent += `\nNEXT_PUBLIC_BOT_WISH_ADDRESS=${contractAddress}`;
    }
    fs.writeFileSync(envPath, envContent, "utf8");
    console.log(".env updated successfully!");
  }

  return {
    contractAddress,
    txHash: deploymentTx.hash,
    gasUsed: actualGasUsed.toString(),
    gasCostBOT: ethers.formatEther(actualCost),
  };
}

main().catch((err) => {
  console.error("\n[DEPLOYMENT FAILED]:", err.message || err);
  process.exit(1);
});
