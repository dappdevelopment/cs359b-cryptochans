var SaleClockAuction = artifacts.require("SaleClockAuction");
var ChanCore = artifacts.require("ChanCore");

module.exports = function(deployer) {
	deployer.deploy(SaleClockAuction);
	deployer.deploy(ChanCore);

  	//Alternative
	//deployer.deploy(SaleClockAuction).then(function() {
	//  return deployer.deploy(ChanCore);
	//});
};