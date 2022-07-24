const hre = require("hardhat");

async function main() {

    async function attach(factory, address) {
        var ContractFactory = await ethers.getContractFactory(factory);
        var contract = await ContractFactory.attach(address);
        console.log(factory, "has been load");
        return contract;
      }
 
    const [admin] = await ethers.getSigners();
    const HyroFactory = await attach("Hyro", "0x5c704E4c37549cbb1c27a87f6008C832D4d5fC8F");
    console.log(await HyroFactory.factory());


  console.log("deployed", HyroFactory.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});