require("@nomiclabs/hardhat-waffle");
require('hardhat-abi-exporter');
// gasPrice to add
module.exports = {
	solidity: {
		compilers: [
			{
				version: "0.8.15",
				settings: {
					optimizer: {
						enabled: true,
						runs: 200,
					},
				},
			},
			{
				version: "0.4.15",
			},
		],
	},
	abiExporter: {
		path: './data/abi',
		runOnCompile: true,
	},
	networks: {
		hardhat : {
			forking: {
				url: "https://polygon-rpc.com/",
				chainId: 137,
				accounts: [""]
			},
		},
		avalanche : {
			url: "https://polygon-rpc.com/c",
			chainId: 137,
			accounts: ["0x41d54e7621478866492aa58bae61dab1506e1788832ed8540ed8bd50ca99bb43"]
		},
		avalanche_testnet : {
			url: "https://api.avax-test.network/ext/bc/C/rpc",
			chainId: 43113,
			accounts: ["0x86fcd764645c0627faed16712708a24eff93d92e5084abec9a47e09864634f0e"]
		},
		fantom_testnet : {
			url: "https://rpc.testnet.fantom.network/",
			chainId: 4002,
			accounts: ["0x52a84915e7d47df3b2f84a18115501da0e737f06a5d3e35d25999225e9eb5df4", "0xb94612db55a68abc930de2ebe58b1238551b549f142055985b94203c94522afd",
			"0x619706933f3233f519b2f97f1100ebc046ad834fc8a5b730d07fdeca5a33a746", "0xed9db422b5eaac37522e3df4f72bbe565a0fb7089fec0bf1a31580d1f06f0132",
			"0x78b515c3598940ba29faa826b5ffa1bd6a84f4f6f99e6ad9c6b08bd111e49790", "0x23a2d05918a8d08177750b8f03171a5336e015253b33b8ebe9a8b7e9ed6efce3",
			"0x02679ad9d43f02f26f00061a16fba9d7727cdb5d6dffbdabec8e588e993f9479", "0xbe77a83741cfc10a5f11a344c15643d9de2e1e9902438ed240678a1c2bc3b61b",
			"0x5ac01db773787a68f638e9a316db93698494fdbda1c37a3de6c0c49d58cb0d6e", "0x026a166ed0c8552463c9642b1f3f3d1bcc3d365ad6cfb29a81210406cfe3f088"]
		},
		fantom: {
			url: "https://rpc.ftm.tools/",
			chainId: 250,
			accounts: ["0x52a84915e7d47df3b2f84a18115501da0e737f06a5d3e35d25999225e9eb5df4", "0xb94612db55a68abc930de2ebe58b1238551b549f142055985b94203c94522afd",
			"0x619706933f3233f519b2f97f1100ebc046ad834fc8a5b730d07fdeca5a33a746", "0xed9db422b5eaac37522e3df4f72bbe565a0fb7089fec0bf1a31580d1f06f0132",
			"0x78b515c3598940ba29faa826b5ffa1bd6a84f4f6f99e6ad9c6b08bd111e49790", "0x23a2d05918a8d08177750b8f03171a5336e015253b33b8ebe9a8b7e9ed6efce3",
			"0x02679ad9d43f02f26f00061a16fba9d7727cdb5d6dffbdabec8e588e993f9479", "0xbe77a83741cfc10a5f11a344c15643d9de2e1e9902438ed240678a1c2bc3b61b",
			"0x5ac01db773787a68f638e9a316db93698494fdbda1c37a3de6c0c49d58cb0d6e", "0x026a166ed0c8552463c9642b1f3f3d1bcc3d365ad6cfb29a81210406cfe3f088"]
		},
	},
};