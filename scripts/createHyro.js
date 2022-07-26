const hre = require("hardhat");

async function main() {

    async function attach(factory, address) {
        var ContractFactory = await ethers.getContractFactory(factory);
        var contract = await ContractFactory.attach(address);
        console.log(factory, "has been load");
        return contract;
      }
 
    const [admin] = await ethers.getSigners();
    const HyroFactory = await attach("HyroFactory", "0x18400800bDB8B148A5e7421573c97b5eeD9950a5");
    await HyroFactory.createHyro(admin.address, {gasLimit: 4000000});
    console.log(await HyroFactory.getHyro(admin.address));

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
