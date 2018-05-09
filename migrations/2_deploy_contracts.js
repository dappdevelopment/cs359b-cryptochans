var SaleClockAuction = artifacts.require("SaleClockAuction");
var ChanCore = artifacts.require("ChanCore");
var ownerCut = 2000 //20% of auction revenue goes to contract owner

module.exports = function(deployer) {

	deployer.deploy(ChanCore).then(function() {
		return deployer.deploy(SaleClockAuction, ChanCore.address, ownerCut);

	}).then(function(){
		ChanCore.deployed().then(function(instance){
			instance.setSaleAuctionAddress(SaleClockAuction.address);
		});
	});
};