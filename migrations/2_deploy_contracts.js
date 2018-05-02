var SaleClockAuction = artifacts.require("SaleClockAuction");
var ChanCore = artifacts.require("ChanCore");
var ownerCut = 8000 //80% of auction revenue

module.exports = function(deployer) {

	deployer.deploy(ChanCore).then(function() {
	  return deployer.deploy(SaleClockAuction, ChanCore.address, ownerCut);
	});
};