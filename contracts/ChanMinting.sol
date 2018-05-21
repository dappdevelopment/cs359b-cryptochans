pragma solidity ^0.4.21;

// Auction wrapper functions
import "./ChanAuction.sol";

/// @title all functions related to creating kittens
contract ChanMinting is ChanAuction {

    // Limits the number of Chans the contract owner can ever create.
    uint256 public promoCreationLimit = 5000;
    uint256 public gen0CreationLimit = 50000;

    // Constants for gen0 auctions.
    uint256 public gen0StartingPrice = 10 finney; //milliETH
    uint256 public gen0AuctionDuration = 1 days;

    // Counts the number of cats the contract owner has created.
    uint256 public promoCreatedCount;
    uint256 public gen0CreatedCount;

    /// @dev we can create promo kittens, up to a limit. Only callable by owner
    /// @param _owner the future owner of the created Chans. Default to contract COO
    function createPromoChan(string _name, address _owner, bool _gender, uint256 _personality) public onlyOwner {
        if (_owner == address(0)) {
             _owner = owner;
        }
        require(promoCreatedCount < promoCreationLimit);
        require(gen0CreatedCount < gen0CreationLimit);

        promoCreatedCount++;
        gen0CreatedCount++;
        _createChan(_name, _owner, _gender, _personality);
    }

    function _approvedByContract(uint256 _chanId) internal {
        approve(saleAuction, _chanId);
    }

    /// @dev Creates a new gen0 Chan with the given name and gender
    ///  creates an auction for it.
    function createGen0Auction(string _name, bool _gender, uint256 _personality) public onlyOwner {
        require(gen0CreatedCount < gen0CreationLimit);

        uint256 chanId = _createChan(_name, msg.sender, _gender, _personality);
        approve(saleAuction, chanId);

        //uint256 chanId = _createChan(_name, this, _gender, _personality);
        //_approvedByContract(chanId);
        
        saleAuction.createAuction(
            chanId,
            _computeNextGen0Price(),
            0,
            gen0AuctionDuration,
            msg.sender
        );
        
        gen0CreatedCount++;
    }

    /// @dev Computes the next gen0 auction starting price, given
    ///  the average of the past 5 prices + 50%.
    function _computeNextGen0Price() internal view returns (uint256) {
        uint256 avePrice = saleAuction.averageGen0SalePrice();

        // sanity check to ensure we don't overflow arithmetic (this big number is 2^128-1).
        require(avePrice < 340282366920938463463374607431768211455);

        uint256 nextPrice = avePrice + (avePrice / 2);

        // We never auction for less than starting price
        if (nextPrice < gen0StartingPrice) {
            nextPrice = gen0StartingPrice;
        }

        return nextPrice;
    }
}