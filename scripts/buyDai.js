const hre = require("hardhat");
const abi = require("../contracts/abi");

async function main() {

    async function attach(factory, address) {
        var ContractFactory = await ethers.getContractFactory(factory);
        var contract = await ContractFactory.attach(address);
        console.log(factory, "has been load");
        return contract;
      }
 
    const [admin, user, user1,user2, user3, user4, user5, user6] = await ethers.getSigners();
    const uni = new ethers.Contract("0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff", abi.dex, admin);
    await uni.connect(user).swapExactETHForTokens(10, ["0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"], user.address, 3317222774, {value: "1000000000000000000000"})
    await uni.connect(user1).swapExactETHForTokens(10, ["0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"], user1.address, 3317222774, {value: "1000000000000000000000"})
    await uni.connect(user2).swapExactETHForTokens(10, ["0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"], user2.address, 3317222774, {value: "1000000000000000000000"})
    await uni.connect(user3).swapExactETHForTokens(10, ["0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"], user3.address, 3317222774, {value: "1000000000000000000000"})
    await uni.connect(user4).swapExactETHForTokens(10, ["0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"], user4.address, 3317222774, {value: "1000000000000000000000"})
    await uni.connect(user5).swapExactETHForTokens(10, ["0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"], user5.address, 3317222774, {value: "1000000000000000000000"})
    await uni.connect(user6).swapExactETHForTokens(10, ["0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"], user6.address, 3317222774, {value: "1000000000000000000000"})

    const dai = await attach("HyroERC20", "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063");
   console.log(await dai.balanceOf(user.address));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
	.then( _ => process.exit())
	.catch(e => {
		console.error(e);
		process.exit(1);
})
