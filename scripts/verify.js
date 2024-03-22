const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

const contractAddress = "0x123456789012345678901234567890123456789";
const contractABI = require("./contractABI.json");

const provider = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/YOUR_INFURA_API_KEY");
const contract = new ethers.Contract(contractAddress, contractABI, provider);

const verify = async (address, tokenId) => {
  try {
    const balance = await contract.balanceOf(address);
    const tokenURI = await contract.tokenURI(tokenId);
    const tokenMetadata = await fetch(tokenURI);
    const metadata = await tokenMetadata.json();

    if (balance.gt(0)) {
      console.log(`Address ${address} owns token ID ${tokenId}`);
      console.log(`Token URI: ${tokenURI}`);
      console.log(`Token Metadata: ${JSON.stringify(metadata)}`);
    } else {
      console.log(`Address ${address} does not own token ID ${tokenId}`);
    }
  } catch (error) {
    console.error(`Error verifying token: ${error.message}`);
  }
};

const main = async () => {
  const args = process.argv.slice(2);
  const address = args[0];
  const tokenId = args[1];

  if (!address || !tokenId) {
    console.error("Usage: node verify.js <address> <tokenId>");
    process.exit(1);
  }

  await verify(address, tokenId);
};

main();
