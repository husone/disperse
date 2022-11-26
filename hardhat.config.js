require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    networks: {
        onus: {
            url: process.env.ONUS_URL,
            accounts: [process.env.ONUS_ACCOUNT],
        },
        onusTestnet: {
            url: process.env.ONUS_TESTNET_URL,
            accounts: [process.env.ONUS_ACCOUNT],
        }
    },
    solidity: {
        version: "0.4.25",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },
};
