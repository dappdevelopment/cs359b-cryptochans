pragma solidity ^0.4.21;

import './ChanOwnership.sol';
import './Auction/SaleClockAuction.sol';

contract ChanAuction is ChanOwnership {

    // The address of the ClockAuction contract that handles auctions of Chans. This
    // same contract handles both peer-to-peer auctions as well as the minted Chan auctions.
    SaleClockAuction public saleAuction;

    // Sets the reference to the sale auction.
    // @param _address - Address of sale contract.
    function setSaleAuctionAddress(address _address) external onlyOwner {
    //function setSaleAuctionAddress(address _address) public {
        SaleClockAuction candidateContract = SaleClockAuction(_address);

        // Verify that a contract is what we expect
        require(candidateContract.isSaleClockAuction());

        // Set the new contract address
        saleAuction = candidateContract;
    }

    function getOwnerCut() public view returns (uint256) {
        saleAuction.ownerCut();
    }

    // Put a Chan up for auction.
    // Does some ownership trickery to create auctions in one tx.
    function createSaleAuction(
        uint256 _chanId,
        uint256 _startingPrice,
        uint256 _endingPrice,
        uint256 _duration
    )
        external
        whenNotPaused
        onlyOwnerOf(_chanId)    //Also verifies whether Chan is already on any auction, since this will throw because it will be owned by the auction contract
    {

        approve(saleAuction, _chanId);
        // Sale auction throws if inputs are invalid and clears
        // transfer and sire approval after escrowing the kitty.
        saleAuction.createAuction(
            _chanId,
            _startingPrice,
            _endingPrice,
            _duration,
            msg.sender
        );
    }

    function checkAuctionBalances() external view onlyOwner returns (uint256) {
        return address(saleAuction).balance;
    }

    // Transfers the balance of the sale auction contract
    // to the ChanCore contract. We use two-step withdrawal to
    // prevent two transfer calls in the auction bid function.
    function withdrawAuctionBalances() external onlyOwner {
        saleAuction.withdrawBalance();
    }
}