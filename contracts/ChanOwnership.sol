pragma solidity ^0.4.21;

import 'openzeppelin-solidity/contracts/lifecycle/Pausable.sol';
import 'openzeppelin-solidity/contracts/token/ERC721/ERC721BasicToken.sol';

contract ChanOwnership is Pausable, ERC721BasicToken {

    /*** EVENTS ***/

    event Birth(address owner, uint256 chanId);
    event ContractUpgrade(address newContract);

    /*** DATA TYPES ***/

    struct Chan {
        string name;
        uint256 birthTime;
        uint256 level;
        bool gender;

        // The Chan's personality code is packed into these 256-bits, the format is
        // super secret! A Chan's genes never change.
        uint256 personality;

        // The minimum timestamp after which this Chan can engage in summoning
        // activities again. This same timestamp is used for the pregnancy
        // timer (for matrons) as well as the siring cooldown.
        uint64 cooldownEndTime;

        // Set to the ID of the sire Chan for matrons that are pregnant,
        // zero otherwise. A non-zero value here is how we know a Chan
        // is pregnant. Used to retrieve the personality material for the new
        // Chan when the birth transpires.
        uint32 shokanWithId;

    }

    /*** CONSTANTS ***/

    // Name and symbol of the non fungible token, as defined in ERC721.
    string public constant name = "CryptoChans";
    string public constant symbol = "CC";

    /*** STORAGE ***/

    // An array containing the Chan struct for all Chans in existence. The ID
    // of each chan is actually an index into this array.
    Chan[] chans;



    // Returns the total number of Chans currently in existence.
    // Required for ERC-721 compliance.
    function totalSupply() public view returns (uint) {
        return chans.length - 1;
    }

    /// @notice Returns a list of all Chan IDs assigned to an address.
    /// @param _owner The owner whose Chans we are interested in.
    /// @dev This method MUST NEVER be called by smart contract code. First, it's fairly
    ///  expensive (it walks the entire Chan array looking for chans belonging to owner),
    ///  but it also returns a dynamic array, which is only supported for web3 calls, and
    ///  not contract-to-contract calls.
    function tokensOfOwner(address _owner) external view returns(uint256[] ownerTokens) {
        uint256 tokenCount = balanceOf(_owner);

        if (tokenCount == 0) {
            // Return an empty array
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](tokenCount);
            uint256 totalChans = totalSupply();
            uint256 resultIndex = 0;

            // We count on the fact that all chans have IDs starting at 1 and increasing
            // sequentially up to the totalChan count.
            uint256 chanId;

            for (chanId = 1; chanId <= totalChans; chanId++) {
                if (tokenOwner[chanId] == _owner) {
                    result[resultIndex] = chanId;
                    resultIndex++;
                }
            }

            return result;
        }
    }

    // An internal method that creates a new Chan and stores it. This
    // method doesn't do any checking and should only be called when the
    // input data is known to be valid. Will generate both a Birth event
    // and a Transfer event.
    // @param _name  Name of this chan
    // @param _owner The inital owner of this chan, must be non-zero (except for the unChan, ID 0)
    // @param _gender The gender of the Chan (true for female, false for male)
    // @param _personality The personality encoding of the Chan
    function _createChan(string _name, address _owner, bool _gender, uint256 _personality)
        internal
        returns (uint)
    {

        Chan memory _Chan = Chan({
            name     : _name,
            birthTime: now,
            level    : 0,
            gender   : _gender,
            personality : _personality,
            cooldownEndTime : 0,
            shokanWithId : 0
        });
        uint256 newchanId = chans.push(_Chan) - 1;

        // It's probably never going to happen, 4 billion cats is A LOT, but
        // let's just be 100% sure we never let this happen.
        require(newchanId == uint256(uint32(newchanId)));

        // emit the birth event
        emit Birth(_owner, newchanId);

        // This will assign ownership, and also emit the Transfer event as
        // per ERC721 draft
        _mint(_owner, newchanId);

        return newchanId;
    }

}