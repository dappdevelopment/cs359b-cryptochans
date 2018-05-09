# CS359B Project (ADD NAME HERE)

(short description here)

## Technologies used

(Add only the specific technologies you need to use until Midterm)

* (e.g. solidity, react, node, mysql)

## Installation intructions

1. Ensure that Ganache is up and running and ensure that its RPC server (default: HTTP://127.0.0.1:7545) matches what's in truffle.js.

2. On a terminal, run the following commands to compile and migrate the smart contracts
```
truffle compile --all
truffle migrate --reset
```
Note the address of the ChanCore deployed contract for testing in step 4.

3. To open the truffle console, run the following command on the terminal:
```
truffle console
```

4. Once the truffle console is active, run the following commands:
```
truffle(development)> myC = ChanCore.deployed()
.
.
.
truffle(development)> myC.then(function(instance){return instance.totalSupply()})
BigNumber { s: 1, e: 0, c: [ 0 ] }
truffle(development)> myC.then(function(instance){return instance.ownerOf(0)})
'0xde660453b1aef5e8cc836bc4f2b48314da3e50e5'
truffle(development)> myC.then(function(instance){return instance.getChan(0)})
[ 'AnimeGod',
  BigNumber { s: 1, e: 9, c: [ 1525245829 ] },
  BigNumber { s: 1, e: 0, c: [ 0 ] },
  true ]
truffle(development)> .exit
```
If you get output similar to above, then the ChanCore contract deployed successfully and the first CryptoChan called AnimeGod has been created. Note that the owner of AnimeGod is the ChanCore contract itself, which address should match the address printed in step 2 after running `truffle migrate --reset`.


5.when you are inside project dir, run following commands
npm link
cd front/
npm link cryptochans

6.How to start:
inside /front, run npm start