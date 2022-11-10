require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.4.25",
    networks: {
        OnusTestnet: {
            url: process.env.ONUS_TESTNET_URL,
            account: process.env.ONUS_TESTNET_ACCOUNT,
        }
    }
};
