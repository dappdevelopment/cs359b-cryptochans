pragma solidity ^0.4.21;

import './ChanProperties.sol';


/// @title A facet of ChanCore that manages Chan summoning, gestation, and birth.
/// @author Axiom Zen (https://www.axiomzen.co)
/// @dev See the ChanCore contract documentation to understand how the various contract facets are arranged.
contract ChanShokan is ChanProperties {

    /// @dev The Charging event is fired when two Chans successfully bonded and the charging
    ///  timer begins for the Chans.
    event Charging(address owner, uint256 matronId, uint256 sireId);



    /// @dev Checks that a given Chan is able to bond. Requires that the
    ///  current cooldown is finished (for sires) and also checks that there is
    ///  no pending pregnancy.
    function _isReadyToBond(Chan _chan) internal view returns (bool) {
        // In addition to checking the cooldownEndTime, we also need to check to see if
        // the cat has a pending birth; there can be some period of time between the end
        // of the pregnacy timer and the birth event.
        return (_chan.shokanWithId == 0) && _isMaxLevel(_chan) && (_chan.cooldownEndTime <= now);
    }

    /// @dev Check if a sire has authorized breeding with this matron. True if both sire
    ///  and matron have the same owner, or if the sire has given shokan permission to
    ///  the matron's owner (via approveShokan()).
    function _isBondingPermitted(uint256 _chanId1, uint256 _chanId2) internal view returns (bool) {
        address chan1Owner = ownerOf(_chanId1);
        address chan2Owner = ownerOf(_chanId2);

        // Bonding is okay if and only if they have same owner
        return (chan1Owner == chan2Owner);
    }

    /// @dev Set the cooldownEndTime for the given Chan, based on its current cooldownIndex.
    ///  Also increments the cooldownIndex (unless it has hit the cap).
    /// @param _chan1 A reference to the Chan in storage which needs its timer started.
    /// @param _chan2 A reference to the Chan in storage which needs its timer started.
    function _triggerCooldowns(Chan storage _chan1, Chan storage _chan2) internal {
        
        // Compute the end of the cooldown time
        //uint64 cooldownEndTime = uint64(now + (_chan1.generation+1) * (_chan1.generation+1) * 1 hours);
        uint64 cooldownEndTime = uint64(now + (_chan1.generation+1) * (_chan1.generation+1) * 5 minutes);
        
        // Apply to both Chans
        _chan1.cooldownEndTime = cooldownEndTime;
        _chan2.cooldownEndTime = cooldownEndTime;
    }


    /// @dev Checks to see if a given Chan is pregnant and (if so) if the gestation
    ///  period has passed.
    function _isReadyToShokan(Chan _chan) private view returns (bool) {
        return (_chan.shokanWithId != 0) && (_chan.cooldownEndTime <= now);
    }

    /// @notice Checks that a given Chan is able to bond (i.e. it is not charging or
    ///  in the middle of a shokan cooldown).
    /// @param _chanId reference the id of the Chan, any user can inquire about it
    function isReadyToBond(uint256 _chanId)
        public
        view
        returns (bool)
    {
        require(_chanId > 0);
        Chan storage chan = chans[_chanId];
        return _isReadyToBond(chan);
    }

    /// @dev Internal check to see if a given sire and matron are a valid mating pair. DOES NOT
    ///  check ownership permissions (that is up to the caller).
    /// @param _chan1 A reference to the Chan struct of the potential matron.
    /// @param _chanId1 The matron's ID.
    /// @param _chan2 A reference to the Chan struct of the potential sire.
    /// @param _chanId2 The sire's ID
    function _isValidBondingPair(
        Chan storage _chan1,
        uint256 _chanId1,
        Chan storage _chan2,
        uint256 _chanId2
    )
        private
        view
        returns(bool)
    {
        // A Chan can't bond with itself!
        if (_chanId1 == _chanId2) {
            return false;
        }

        // Both Chans' generations need to match
        if (_chan1.generation != _chan2.generation) {
            return false;
        }

        // Both Chans' levels need to match
        if (_chan1.level != _chan2.level) {
            return false;
        }

        // Everything seems cool! Let's get DTF.
        return true;
    }

    /// @notice Checks to see if two Chans can bond together, including checks for
    ///  ownership and shokan approvals. Does NOT check that both Chans are ready for
    ///  bonding (i.e. breedWith could still fail until the cooldowns are finished).
    ///  TODO: Shouldn't this check pregnancy and cooldowns?!?
    /// @param _chanId1 The ID of the proposed matron.
    /// @param _chanId2 The ID of the proposed sire.
    function canBondWith(uint256 _chanId1, uint256 _chanId2)
        public
        view
        returns(bool)
    {
        require(_chanId1 > 0);
        require(_chanId2 > 0);
        Chan storage chan1 = chans[_chanId1];
        Chan storage chan2 = chans[_chanId2];
        return _isValidBondingPair(chan1, _chanId1, chan2, _chanId2) &&
            _isBondingPermitted(_chanId1, _chanId2);
    }

    /// @notice Bond two Chans you own. Will either make your Chans charging, or will
    ///  fail entirely.
    /// @param _chanId1 The ID of the Chan acting as matron (will end up pregnant if successful)
    /// @param _chanId2 The ID of the Chan acting as sire (will begin its shokan cooldown if successful)
    function bondWith(uint256 _chanId1, uint256 _chanId2)
        public
        whenNotPaused
        onlyOwnerOf(_chanId1)
    {

        // Neither sire nor matron are allowed to be on auction during a normal
        // breeding operation, but we don't need to check that explicitly.
        // For matron: The caller of this function can't be the owner of the matron
        //   because the owner of a Chan on auction is the auction house, and the
        //   auction house will never call breedWith().
        // For sire: Similarly, a sire on auction will be owned by the auction house
        //   and the act of transferring ownership will have cleared any oustanding
        //   shokan approval.
        // Thus we don't need to spend gas explicitly checking to see if either cat
        // is on auction.

        // Check that matron and sire are both owned by caller, or that the sire
        // has given shokan permission to caller (i.e. matron's owner).
        // Will fail for _sireId = 0
        require(_isBondingPermitted(_chanId1, _chanId2));

        // Grab a reference to the potential matron
        Chan storage chan1 = chans[_chanId1];

        // Make sure matron isn't pregnant, or in the middle of a shokan cooldown
        require(_isReadyToBond(chan1));

        // Grab a reference to the potential sire
        Chan storage chan2 = chans[_chanId2];

        // Make sure sire isn't pregnant, or in the middle of a shokan cooldown
        require(_isReadyToBond(chan2));

        // Test that these cats are a valid mating pair.
        require(_isValidBondingPair(
            chan1,
            _chanId1,
            chan2,
            _chanId2
        ));

        // All checks passed, kitty gets pregnant!
        _breedWith(_chanId1, _chanId2);
    }

    /// @dev Internal utility function to initiate breeding, assumes that all breeding
    ///  requirements have been checked.
    function _breedWith(uint256 _chanId1, uint256 _chanId2) internal {
        // Grab a reference to the Kitties from storage.
        Chan storage chan1 = chans[_chanId1];
        Chan storage chan2 = chans[_chanId2];

        // Mark the Chans as charging, keeping track of who the other is.
        chan1.shokanWithId = uint32(_chanId2);
        chan2.shokanWithId = uint32(_chanId1);

        // Trigger the cooldowns for both parents.
        _triggerCooldowns(chan1, chan2);

        // Emit the charging event.
        emit Charging(ownerOf(_chanId1), _chanId1, _chanId2);
    }


    /// @notice Have a charging Chan perform the Shokan!
    /// @param _chanId A Chan ready to perform Shokan.
    /// @return The Chan ID of the new Chan.
    /// @dev Looks at a given Chan and, if pregnant and if the gestation period has passed,
    ///  combines the genes of the two parents to create a new kitten. The new Chan is assigned
    ///  to the current owner of the matron. Upon successful completion, both the matron and the
    ///  new kitten will be ready to breed again. Note that anyone can call this function (if they
    ///  are willing to pay the gas!), but the new kitten always goes to the mother's owner.
    function shokan(uint256 _chanId, string _newChanName)
        public
        whenNotPaused
        returns(uint256)
    {
        // Grab a reference to the chan in storage.
        Chan storage chan1 = chans[_chanId];

        // Check that the Chan is a valid Chan.
        require(chan1.birthTime != 0);

        // Check that the Chan is charging, and that its time has come!
        require(_isReadyToShokan(chan1));

        // Grab a reference to the the other Chan in storage.
        uint256 chanId2 = chan1.shokanWithId;
        Chan storage chan2 = chans[chanId2];

        // Temporary function for generating new gender
        bool newChanGender = chan1.gender || chan2.gender;

        // Temporary function for generating new personality
        uint256 newChanPersonality = chan1.personality + chan2.personality;

        // Make the new Chan!
        address owner = ownerOf(_chanId);
        uint256 newChanId = _createChan(
            _newChanName,
            owner,
            uint32(chan1.generation + 1),
            newChanGender,
            newChanPersonality
        );

        // Clear the reference to sire from the Chan (REQUIRED! Having shokanWithId
        // set is what marks a Chan as being in the charging state.)
        delete chan1.shokanWithId;
        delete chan2.shokanWithId;

        // return the new Chan's ID
        return newChanId;
    }
}