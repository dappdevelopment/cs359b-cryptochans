pragma solidity ^0.4.21;

import "./ChanOwnership.sol";
//import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract ChanProperties is ChanOwnership {

    /*** EVENTS ***/

    event CheckedIn(uint256 chanId);
    event LevelUp(uint256 chanId);

    /*** CONSTANTS ***/

    uint public checkInTimer = 5 minutes;
    //uint constant checkInTimer = 1 days;
    uint public streakToLevelUp = 7;

    /*** PRIVATE FUNCTIONS ***/

    function _isMaxLevel(Chan _chan) internal pure returns (bool) {
        return (_chan.level == 10 * (_chan.generation + 1));
    }



    /*
     * Performs check-in for Chan. If checking in within 1 day of last check-in, streak
     * is incremented by one. Otherwise, the streak is reset. If on 7th day streak, streak
     * is reset and Chan levels up!
     */
    function checkIn(uint256 _id)
        public
        whenNotPaused
        onlyOwnerOf(_id)
    {
        Chan storage chan = chans[_id];
        require(!_isMaxLevel(chan));
        require(now >= chan.checkInDeadline - checkInTimer);
        if(now >= chan.checkInDeadline) {
            chan.checkInStreak = 1;
        } else if(chan.checkInStreak == (streakToLevelUp - 1)) {
            chan.checkInStreak = 0;
            chan.level += 1;
            emit LevelUp(_id);
        } else {
            chan.checkInStreak += 1;
        }
        chan.checkInDeadline = uint64(now + 2 * checkInTimer);
        emit CheckedIn(_id);
    }

    

    //TO BE REMOVED
    function ChanLevelup(uint256 _id) public returns (uint256 newlevel) {
        Chan storage chan = chans[_id];
        require(!_isMaxLevel(chan));
        chan.level += 1;
        newlevel = chan.level;
        emit LevelUp(_id);
    }

    //TO BE REMOVED
    //DEBUG ONLY
    function LevelUpToMax(uint256 _id) public onlyOwner returns (uint256 newlevel) {
        Chan storage chan = chans[_id];
        require(!_isMaxLevel(chan));
        chan.level = 10 * (chan.generation + 1);
        newlevel = chan.level;
        emit LevelUp(_id);
    }

}