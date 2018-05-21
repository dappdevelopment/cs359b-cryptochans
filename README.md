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
https://rinkeby.etherscan.io/tx/0x5b187e0f3897ebd8a9ed47c4871c79be374abc101f58fc96fc22ed63a05008b3

"networks": {
    "4": {
		"events": {},
		"links": {},
		"address": "0xfea05c082cc67cc9cc509dc10576d449470516e4",
		"transactionHash": "0x5b187e0f3897ebd8a9ed47c4871c79be374abc101f58fc96fc22ed63a05008b30x5b187"
    }
},
```

ChanCore
```
https://rinkeby.etherscan.io/tx/0x031f4d2fd4cdea5779c94355f4ec4763d3443060c42c3f9f8ca51c194b71a331

"networks": {
	"4": {
		"events": {},
		"links": {},
		"address": "0x9c92cae72d67d5ce6dfb8aa8011d00e2e3505eed",
		"transactionHash": "0x031f4d2fd4cdea5779c94355f4ec4763d3443060c42c3f9f8ca51c194b71a3310x031f4"
	}
},
```

SaleClockAuction
```
https://rinkeby.etherscan.io/tx/0x5b88e1c376c545f0fb8c9315193275bd3aec1efa977326261b497d9cdd4ece4a

"networks": {
	"4": {
		"events": {},
		"links": {},
		"address": "0xecd7424d807b7c709837379d2852fb471d532a94",
		"transactionHash": "0x5b88e1c376c545f0fb8c9315193275bd3aec1efa977326261b497d9cdd4ece4a0x5b88e"
	}
},
```


9.Adding the following to ./config/webpack.config.*.js also makes everything work:
  node: {
+   dns: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }