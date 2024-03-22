// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

/**
 * @dev Interface of the ERC20Votes contract.
 */
interface IERC20Votes is IERC20, IERC20Metadata {
    /**
     * @dev Emitted when an account changes its delegate.
     */
    event DelegateChanged(address indexed delegator, address indexed fromDelegate, address indexed toDelegate);

    /**
     * @dev Emitted when a token transfer or delegate change results in changes to a delegate's voting power.
     */
    event DelegateVotesChanged(address indexed delegate, uint256 previousBalance, uint256 newBalance);

    /**
     * @dev Returns the current amount of votes that `account` has.
     */
    function getVotes(address account) external view returns (uint256);

    /**
     * @dev Returns the amount of votes that `account` had at the end of a past block (`blockNumber`).
     * @dev Reverts if `blockNumber` is a future block or has not yet been mined.
     */
    function getPastVotes(address account, uint256 blockNumber) external view returns (uint256);

    /**
     * @dev Delegates the votes from the sender to `delegatee`.
     */
    function delegate(address delegatee) external;

    /**
     * @dev Delegates the votes from the sender to `delegatee` and transfers the `amount` of tokens from the sender to the delegatee.
     * @dev Requires the `amount` to be greater than 0.
     */
    function delegateWithVotes(address delegatee, uint256 amount) external;

    /**
     * @dev Returns the delegatee ofthe sender, if any.
     */
    function delegatedTo() external view returns (address);

    /**
     * @dev Returns the total number of votes that `delegatee` has received.
     */
    function delegatedFrom(address delegatee) external view returns (uint256);

    /**
     * @dev Returns the total number of votes that `account` had when they were delegated to `to`.
     */
    function delegatedVotesOf(address account, address to) external view returns (uint256);

    /**
     * @dev Returns the current number of votes delegated to `delegatee`.
     */
    function delegatedVotesOf(address delegatee) external view returns (uint256);

    /**
     * @dev Returns the amount of `amount` of tokens that `delegator` has delegated to `delegatee`.
     */
    function delegatedAmountOf(address delegator, address delegatee) external view returns (uint256);

    /**
     * @dev Returns the total number of tokens that `account` has in the token contract.
     */
    function balanceOf(address account) external view override returns (uint256);

    /**
     * @dev Returns the current number of tokens that `delegator` has delegated to `delegatee`.
     */
    function tokensOf(address delegator) external view returns (uint256);

    /**
     * @dev Returns the current number of tokens that `delegatee` has received.
     */
    function tokensOf(address delegatee) external view returns (uint256);

    /**
     * @dev Returns the amount of tokens that `delegator` has delegated to `delegatee`.
     */
    function delegatedTokensOf(address delegator, address delegatee) external view returns (uint256);
}
