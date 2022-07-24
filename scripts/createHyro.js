const hre = require("hardhat");

async function main() {

    async function attach(factory, address) {
        var ContractFactory = await ethers.getContractFactory(factory);
        var contract = await ContractFactory.attach(address);
        console.log(factory, "has been load");
        return contract;
      }
 
    const [admin] = await ethers.getSigners();
    const HyroFactory = await attach("HyroFactory", "0x0677591DD9d1A85e6596Bf2ee9c36B4A3fF8AaF4");
    await HyroFactory.createHyro(admin.address, {gasLimit: 4000000});
    console.log(await HyroFactory.getHyro(admin.address));

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
