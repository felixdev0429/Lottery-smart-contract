const NLIFE = artifacts.require("NLIFE");

module.exports = async function (deployer) {
    await deployer.deploy(
        NLIFE,
    );

    return;
};
