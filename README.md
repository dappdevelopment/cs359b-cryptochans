# CS359B Project (ADD NAME HERE)

(short description here)

## Technologies used

(Add only the specific technologies you need to use until Midterm)

* (e.g. solidity, react, node, mysql)

## Installation intructions

1. Ensure that npm, node, truffle and Ganache are installed.

2. Clone this repo, cd into the root dir and run
```
npm install
```

3. Ensure that Ganache is up and running and ensure that its RPC server (default: HTTP://127.0.0.1:7545) matches what's in truffle.js.

4. On a terminal, run the following commands to compile and migrate the smart contracts
```
truffle compile --all
truffle migrate --reset
```
Note the address of the ChanCore deployed contract for testing in step 6.

5. To open the truffle console, run the following command on the terminal:
```
truffle console
```

6. Once the truffle console is active, run the following commands to test ChanCore:
```
truffle(development)> var accounts;
undefined
truffle(development)> web3.eth.getAccounts(function(err,res){accounts=res;})
undefined
truffle(development)> accounts[0]
'0x627306090abab3a6e1400e9345bc60c78a8bef57'
truffle(development)> myC = ChanCore.deployed()
.
.
.
truffle(development)> myC.then(function(instance){return instance.totalSupply()})
BigNumber { s: 1, e: 0, c: [ 1 ] }
truffle(development)> myC.then(function(instance){return instance.ownerOf(0)})
'0x30753e4a8aad7f8597332e813735def5dd395028'
truffle(development)> myC.then(function(instance){return instance.ownerOf(1)})
'0x627306090abab3a6e1400e9345bc60c78a8bef57'
truffle(development)> myC.then(function(instance){return instance.getChan(0)})
[ 'AnimeGod',
  BigNumber { s: 1, e: 9, c: [ 1525245829 ] },
  BigNumber { s: 1, e: 0, c: [ 0 ] },
  true ]
truffle(development)> .exit
```
If you get output similar to above, then the ChanCore contract deployed successfully and the first CryptoChan called AnimeGod has been created. Note that the owner of AnimeGod is the ChanCore contract itself, which address should match the address printed in step 2 after running `truffle migrate --reset`.

6. Once the truffle console is active, run the following commands to test SaleClockAuction:
```
truffle(development)> sca = SaleClockAuction.deployed()
.
.
.
truffle(development)> sca.then(function(instance){return instance.isSaleClockAuction()})
true
truffle(development)> sca.then(function(instance){return instance.ownerCut()})
BigNumber { s: 1, e: 3, c: [ 2000 ] }

truffle(development)> myC.then(function(instance){return instance.totalSupply()})
BigNumber { s: 1, e: 0, c: [ 1 ] }
truffle(development)> myC.then(function(instance){return instance.ownerOf(0)})
'0x30753e4a8aad7f8597332e813735def5dd395028'
truffle(development)> myC.then(function(instance){return instance.ownerOf(1)})
'0x627306090abab3a6e1400e9345bc60c78a8bef57'
truffle(development)> myC.then(function(instance){return instance.getChan(0)})
[ 'AnimeGod',
  BigNumber { s: 1, e: 9, c: [ 1525245829 ] },
  BigNumber { s: 1, e: 0, c: [ 0 ] },
  true ]
truffle(development)> .exit
```

7. Create symlink from node_module to root
Due to React.js' limitations, contracts outside of src directory must be symbolically linked from within node_module
```
cd build/contracts
npm link
cd ../..
npm link cryptochans
```

8. Run
```
npm run start
```


Contract info on Rinkeby Test Network

Migrations
```
https://rinkeby.etherscan.io/tx/0x16f542a05425e0e29f4a6ed6cd27f1d22a04120a25d595652cb8a9e852ac2e8d

"networks": {
    "4": {
		"events": {},
		"links": {},
		"address": "0x0c082ceb22d1b3aa426f567e3d9e07f2baf26207",
		"transactionHash": "0x16f542a05425e0e29f4a6ed6cd27f1d22a04120a25d595652cb8a9e852ac2e8d0x16f54"
    }
},
```

ChanCore
```
https://rinkeby.etherscan.io/tx/0xf5b475ba434e951ec85c7ffc9607f730d55101f5b8f83d594faf3dbcb7d49934

"networks": {
	"4": {
		"events": {},
		"links": {},
		"address": "0xc7e511f61e9d46c326c60877baa00fd00a26f876",
		"transactionHash": "0xf5b475ba434e951ec85c7ffc9607f730d55101f5b8f83d594faf3dbcb7d499340xf5b47"
	}
},
```

SaleClockAuction
```
https://rinkeby.etherscan.io/tx/0xb0b2508e2452ea0d8d0984fd9c9d9e9898a3684a3b3f1ea0966d0b6d4cd05ab8

"networks": {
	"4": {
		"events": {},
		"links": {},
		"address": "0xa2f325e88bcbbfda2de5f003b7db210a17483c38",
		"transactionHash": "0xb0b2508e2452ea0d8d0984fd9c9d9e9898a3684a3b3f1ea0966d0b6d4cd05ab80xb0b25"
	}
},
```
