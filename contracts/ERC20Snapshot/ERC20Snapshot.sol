// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Snapshot.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ERC20Snapshot is Context, IERC20, IERC20Snapshot {
    using Counters for Counters.Counter;

    struct Snapshot {
        uint256 id;
        uint256 totalSupply;
        mapping(address => uint256) balances;
    }

    Counters.Counter private _currentSnapshotId;
    mapping(uint256 => Snapshot) private _snapshots;

    constructor() {
        _currentSnapshotId.increment();
    }

    function snapshot() public returns (uint256) {
        uint256 currentId = _getCurrentSnapshotId();
        uint256 totalSupply = IERC20(this).totalSupply();
        _snapshots[currentId] = Snapshot(currentId, totalSupply);
        for (address account; account != address(0); account = _nextAccount(account)) {
            _snapshots[currentId].balances[account] = IERC20(this).balanceOf(account);
        }
        _currentSnapshotId.increment();
        return currentId;
    }

    function _getCurrentSnapshotId() private view returns (uint256) {
        return _currentSnapshotId.current();
    }

    function _nextAccount(address account) private view returns (address) {
        address nextAccount;
        while (true) {
            nextAccount = IERC20(this).tokenOfOwnerByIndex(account, IERC20(this).balanceOf(account).quotient(type(uint256).max));
            if (nextAccount == account) {
                return address(0);
            }
            if (IERC20(this).balanceOf(nextAccount) > 0) {
                break;
            }
            account = nextAccount;
        }
        return nextAccount;
    }

    function getSnapshot(uint256 snapshotId) public view override returns (uint256, mapping(address => uint256)) {
        return (_snapshots[snapshotId].id, _snapshots[snapshotId].balances);
    }

    function getTotalSupply(uint256 snapshotId) public view override returns (uint256) {
        return _snapshots[snapshotId].totalSupply;
    }

    function balanceOf(uint256 snapshotId, address account) public view override returns (uint256) {
        return _snapshots[snapshotId].balances[account];
    }
}
