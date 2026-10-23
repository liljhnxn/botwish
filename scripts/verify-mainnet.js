const fs = require("fs");
const path = require("path");
const https = require("https");
const querystring = require("querystring");

async function verifyContract() {
  const contractAddress = "0xe1d531f3142080CF70e5aD776B13150176f727BA";
  const sourceCodePath = path.join(__dirname, "../contracts/WishVault.sol");
  const sourceCode = fs.readFileSync(sourceCodePath, "utf8");

  console.log("=========================================");
  console.log("  WishVault Contract Verification Script ");
  console.log("=========================================\n");
  console.log(`Target Contract Address: ${contractAddress}`);
  console.log(`Explorer API:            https://scan.botchain.ai/api`);
  console.log(`Compiler Version:        v0.8.24+commit.e11b9ed9`);
  console.log(`Optimization Runs:       200`);

  // Blockscout / Etherscan verification parameters
  const postData = querystring.stringify({
    module: "contract",
    action: "verifysourcecode",
    contractaddress: contractAddress,
    sourceCode: sourceCode,
    codeformat: "solidity-single-file",
    contractname: "WishVault",
    compilerversion: "v0.8.24+commit.e11b9ed9",
    optimizationUsed: 1,
    runs: 200,
    evmversion: "paris",
    licenseType: 3, // MIT
  });

  const options = {
    hostname: "scan.botchain.ai",
    path: "/api",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(postData),
    },
  };

  console.log("\nSubmitting source code verification request...");

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", async () => {
        console.log("Submission Response:", data);
        try {
          const json = JSON.parse(data);
          if (json.status === "1" || json.message === "OK") {
            const guid = json.result;
            console.log(`Verification GUID received: ${guid}`);
            console.log("Polling verification status...");
            await pollVerificationStatus(guid);
            resolve();
          } else {
            console.log("Direct status/message:", json.result || json.message);
            // Check if already verified or if status query needed
            await checkVerificationResult(contractAddress);
            resolve();
          }
        } catch (e) {
          console.error("Failed to parse verification response:", e.message);
          resolve();
        }
      });
    });

    req.on("error", (e) => {
      console.error("Verification request error:", e.message);
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

function pollVerificationStatus(guid) {
  return new Promise((resolve) => {
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      https.get(`https://scan.botchain.ai/api?module=contract&action=checkverifystatus&guid=${guid}`, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          console.log(`[Attempt ${attempts}] Status:`, data);
          try {
            const json = JSON.parse(data);
            if (json.result && (json.result.includes("Success") || json.result.includes("Pass") || json.status === "1")) {
              console.log("\n🎉 Contract verification successful!");
              clearInterval(interval);
              resolve();
            } else if (json.result && json.result.includes("Fail")) {
              console.log("\n❌ Verification failed:", json.result);
              clearInterval(interval);
              resolve();
            }
          } catch (_) {}

          if (attempts >= 10) {
            clearInterval(interval);
            resolve();
          }
        });
      });
    }, 3000);
  });
}

function checkVerificationResult(address) {
  return new Promise((resolve) => {
    https.get(`https://scan.botchain.ai/api?module=contract&action=getabi&address=${address}`, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        console.log("Current ABI Status:", data);
        resolve();
      });
    });
  });
}

verifyContract().catch(console.error);
