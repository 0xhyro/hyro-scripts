const hre = require("hardhat");
const { BigNumber } = require("ethers");
async function main() {

    async function attach(factory, address) {
        var ContractFactory = await ethers.getContractFactory(factory);
        var contract = await ContractFactory.attach(address);
        console.log(factory, "has been load");
        return contract;
      }
    let path = [];
    path.push(["0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"]);
    console.log(path)
    const [admin, user, user1, user22, user3, user4, user5, user6] = await ethers.getSigners();
    const Hyro = await attach("Hyro", "0xd34f1F29e2E7cd67f59f260AE8323a339562C7a0");
    const dai = await attach("HyroERC20", "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063");
    await dai.connect(user22).approve(Hyro.address, "1000000000000000000000000000000");
    console.log("user:", user.address, "Approve", Hyro.address);
    console.log(await Hyro.test());
    await Hyro.connect(user22).mint(user22.address, BigNumber.from("1000000000000000000"), path, {gasLimit: 4000000});
    console.log("user:", user22.address, "mint", await Hyro.balanceOf(user22.address).toString());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});