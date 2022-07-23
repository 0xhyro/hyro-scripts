const hre = require("hardhat");

async function main() {

    async function attach(factory, address) {
        var ContractFactory = await ethers.getContractFactory(factory);
        var contract = await ContractFactory.attach(address);
        console.log(factory, "has been load");
        return contract;
      }
 
    const [admin] = await ethers.getSigners();
    const HyroFactory = await attach("HyroFactory", "0xD119ab5e7da0C0eE944122188C7b36CA4a71e3db");
    await HyroFactory.estimateGas.createHyro(admin.address)


  console.log("deployed", hyrofactory.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
