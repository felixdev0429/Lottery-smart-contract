const Lottery = artifacts.require('Lottery');
const NLIFE = artifacts.require('NLIFE');
const RandomNumberGenerator = artifacts.require("RandomNumberGenerator");
const { BN } = require("web3-utils");

module.exports = async function (deployer) {

    NLIFE_instance = await NLIFE.deployed();
    RNG_instance = await RandomNumberGenerator.deployed();

    await deployer.deploy(
        Lottery,
        NLIFE_instance.address,
        "0xEE2DDda9A2ad3a9397fAaAC30Bc6B18596B4AfA6",
        new BN('1000000000000000000'),
        RNG_instance.address,
    );

    return;
};
