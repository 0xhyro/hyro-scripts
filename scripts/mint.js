const { BigNumber } = require("ethers");
const hre = require("hardhat");

async function main() {

    async function attach(factory, address) {
        var ContractFactory = await ethers.getContractFactory(factory);
        var contract = await ContractFactory.attach(address);
        console.log(factory, "has been load");
        return contract;
      }
      
    const [admin, user] = await ethers.getSigners();
    const Hyro = await attach("Hyro", "0xD3B021179EdfA6429b1Fb73836d1Db7F7Bd044a0");
    const dai = await attach("HyroERC20", "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063");
    
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});