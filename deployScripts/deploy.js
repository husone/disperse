const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {

  const DisperseOnus = await ethers.getContractFactory("DisperseOnus");
  const deployContract = await DisperseOnus.deploy();

  console.log("Token address:", deployContract.address);

  // deploy with cli : npx hardhat run .\deployScripts\deploy.js --network onus

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
