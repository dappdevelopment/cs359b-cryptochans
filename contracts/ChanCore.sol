pragma solidity ^0.4.21;

import "./ChanMinting.sol";
//import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract ChanCore is ChanMinting {

    // Set in case the core contract is broken and an upgrade is required
    address public newContractAddress;

    /// @notice Creates the main CryptoKitties smart contract instance.
    function ChanCore() public Ownable() {
        // Starts paused.
        paused = true;

        // start with the mythical chan 0 - so we don't have generation-0 parent issues
        _createChan("AnimeGod", this, uint32(0), true, 0xFFFFFFFFFFFFFFFFFFFFFFFF);

        _createChan("MiaoChan", msg.sender, uint32(0), true, 0x888888888888888888888);


    }

    // Used to mark the smart contract as upgraded, in case there is a serious
    // breaking bug. This method does nothing but keep track of the new contract and
    // emit a message indicating that the new address is set. It's up to clients of this
    // contract to update to the new contract address in that case. (This contract will
    // be paused indefinitely if such an upgrade takes place.)
    // @param _v2Address new address
    function setNewAddress(address _v2Address) public onlyOwner whenPaused {
        // See README.md for updgrade plan
        newContractAddress = _v2Address;
        emit ContractUpgrade(_v2Address);
    }

    // Reject all Ether from being sent here, unless it's from one of the
    // two auction contracts. (Hopefully, we can prevent user accidents.)
    function() external payable {
        require(msg.sender == address(saleAuction));
    }

    // Returns all the relevant information about a specific Chan.
    // @param _id The ID of the chan of interest.
    function getChan(uint256 _id)
        public
        view
        returns (
        string name,
        uint256 birthTime,
        uint256 level,
        uint32 generation,
        bool    gender,
        uint64 checkInDeadline,
        uint8  checkInStreak,
        uint64 cooldownEndTime,
        uint32 shokanWithId
    ) {
        Chan storage chan = chans[_id];

        name = chan.name;
        birthTime = uint256(chan.birthTime);
        level = chan.level;
        generation = chan.generation;
        gender = chan.gender;
        checkInDeadline = chan.checkInDeadline;
        checkInStreak = chan.checkInStreak;
        cooldownEndTime = chan.cooldownEndTime;
        shokanWithId = chan.shokanWithId;
    }

    // @override
    function unpause() public onlyOwner whenPaused {
        require(saleAuction != address(0));
        //require(newContractAddress == address(0));

        // Actually unpause the contract.
        super.unpause();
    }
}