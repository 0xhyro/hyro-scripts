// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const { BigNumber } = require("ethers");
async function main() {
 
  const [admin, user, user1, user2, user3] = await ethers.getSigners();

  async function attach(factory, address) {
    var ContractFactory = await ethers.getContractFactory(factory);
    var contract = await ContractFactory.attach(address);
    console.log(factory, "has been load");
    return contract;
  }
  let path = [];
  path.push(["0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"]);
  console.log(path)

  const HyroFactory = await hre.ethers.getContractFactory("HyroFactory");
  hyrofactory = await HyroFactory.deploy(admin.address, admin.address);
  console.log("deployed", hyrofactory.address);
  await hyrofactory.addWhitelistedTokens(["0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"]);
  console.log("whitelist dai")
  console.log(await hyrofactory.whitelistedTokens(0))

  await hyrofactory.createHyro(admin.address, {gasLimit: 4000000});
  console.log(await hyrofactory.getHyro(admin.address));

  const Hyro = await attach("Hyro", await hyrofactory.getHyro(admin.address));
  const dai = await attach("HyroERC20", "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063");
  await dai.connect(user).approve(Hyro.address, "1000000000000000000000000000000");
  console.log("user:", user.address, "Approve", Hyro.address);
  await Hyro.connect(user).mint(user.address, BigNumber.from("1000000000000000000"), path, {gasLimit: 4000000});
  console.log("user:", user.address, "mint", await Hyro.balanceOf(user.address));

  await dai.connect(user1).approve(Hyro.address, "1000000000000000000000000000000");
  console.log("user:", user1.address, "Approve", Hyro.address);
  await Hyro.connect(user1).mint(user1.address, BigNumber.from("10000000000000000000"), path, {gasLimit: 4000000});
  console.log("user:", user1.address, "mint", await Hyro.balanceOf(user1.address));

  await dai.connect(user2).approve(Hyro.address, "1000000000000000000000000000000");
  console.log("user:", user2.address, "Approve", Hyro.address);
  await Hyro.connect(user2).mint(user2.address, BigNumber.from("1000000000000000000"), path, {gasLimit: 4000000});
  console.log("user:", user2.address, "mint", await Hyro.balanceOf(user2.address));

  await dai.connect(user3).approve(Hyro.address, "1000000000000000000000000000000");
  console.log("user:", user3.address, "Approve", Hyro.address);
  await Hyro.connect(user3).mint(user3.address, BigNumber.from("1000000000000000000"), path, {gasLimit: 4000000});
  console.log("user:", user3.address, "mint", await Hyro.balanceOf(user3.address));

  console.log(await dai.balanceOf(Hyro.address));

  let startBalance = await dai.balanceOf(user.address);
  console.log("Liquidity", await Hyro.balanceOf(user1.address));
  await Hyro.connect(user1).approve(Hyro.address, "1000000000000000000000000000000");
  await Hyro.connect(user1).burn(user1.address, await Hyro.balanceOf(user1.address), path, {gasLimit: 4000000});
  console.log("user:", user1.address, "withdraw", await dai.balanceOf(user1.address) - startBalance);
  console.log("Liquidity", await Hyro.balanceOf(user1.address));

  await dai.connect(user1).approve(Hyro.address, "1000000000000000000000000000000");
  console.log("user:", user1.address, "Approve", Hyro.address);
  await Hyro.connect(user1).mint(user1.address, BigNumber.from("1000000000000000000"), path, {gasLimit: 4000000});
  console.log("user:", user1.address, "mint", await Hyro.balanceOf(user1.address));

  console.log(await dai.balanceOf(Hyro.address));

  startBalance = await dai.balanceOf(user.address);
  console.log("Liquidity", await Hyro.balanceOf(user1.address));
  await Hyro.connect(user1).approve(Hyro.address, "1000000000000000000000000000000");
  await Hyro.connect(user1).burn(user1.address, await Hyro.balanceOf(user1.address), path, {gasLimit: 4000000});
  console.log("user:", user1.address, "withdraw", await dai.balanceOf(user1.address) - startBalance);
  console.log("Liquidity", await Hyro.balanceOf(user1.address));

  console.log(await dai.balanceOf(Hyro.address));

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
