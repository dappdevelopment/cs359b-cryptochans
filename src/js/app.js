function app() {
    if (typeof web3 == 'undefined') throw 'No web3 detected. Is Metamask/Mist being used?';
    web3 = new Web3(web3.currentProvider); // MetaMask injected Ethereum provider
    console.log("Using web3 version: " + Web3.version);
  
    var contract;
    var userAccount;
  
    var contractDataPromise = $.getJSON('ChanCore.json');
    var networkIdPromise = web3.eth.net.getId(); // resolves on the current network id
    var accountsPromise = web3.eth.getAccounts(); // resolves on an array of accounts
  
    Promise.all([contractDataPromise, networkIdPromise, accountsPromise])
      .then(function initApp(results) {
        var contractData = results[0];
        var networkId = results[1];
        var accounts = results[2];
        userAccount = accounts[0];
  
        // (todo) Make sure the contract is deployed on the network to which our provider is connected
  
        var contractAddress = contractData.networks[networkId].address;
        contract = new web3.eth.Contract(contractData.abi, contractAddress);
        
 function transfer(to, amount) {
    console.log(to, amount)
    if (!to || !amount) return console.log("Fill in both fields");

    $("#loader").show();

    contract.methods.transfer(to, amount).send({from: userAccount})
      .then(refreshBalance)
      .catch(function (e) {
        $("#loader").hide();
      });
  }



  function mint(amount) {
    console.log("mint");
    if (!amount) return console.log("Fill in amount field");

    $("#loader").show();
    console.log(contract.methods);

    contract.methods.mint(amount).send({from: userAccount})
      .then(refreshBalance)
      .catch(function (e) {
        $("#loader").hide();
      });
  }



  $("#mint").click(function() {
    console.log("hello mint");
    var amount = $("#amount").val();
    mint(amount);
  });

  $("#button").click(function() {
  	console.log("hello");
  	 var toAddress = $("#address").val();
    var amount = $("#amount").val();
    transfer(toAddress, amount);
   
  });

if (!(networkId in contractData.networks)) {
   throw new Error("Contract not found in selected Ethereum network on MetaMask.");
}

      })



      .then(refreshBalance)
     .catch(console.error);
    function refreshBalance() { // Returns web3's PromiEvent
     // Calling the contract (try with/without declaring view)
     contract.methods.balanceOf(userAccount).call().then(function (balance) {
     	console.log(balance);
     	console.log(userAccount);
       $('#display').text(balance + " CDT");
       $("#loader").hide();
     });}


}


$(document).ready(app);



