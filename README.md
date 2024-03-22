# Revolutination-DAO-Token
Token-related contracts and functionality for the native governance and utility token of the Revolutination decentralized autonomous organization.

# Structure 

revolutination-dao-token/
├── contracts/
│   ├── ERC20/
│   │   ├── IERC20.sol
│   │   └── ERC20.sol
│   ├── ERC20Burnable/
│   │   └── ERC20Burnable.sol
│   ├── ERC20Mintable/
│   │   └── ERC20Mintable.sol
│   ├── ERC20Pausable/
│   │   └── ERC20Pausable.sol
│   ├── ERC20Snapshot/
│   │   └── ERC20Snapshot.sol
│   ├── ERC20Votes/
│   │   ├── ERC20Votes.sol
│   │   └── IERC20Votes.sol
│   └── GovernanceToken.sol
├── scripts/
│   ├── deploy.js
│   └── verify.js
├── test/
│   └── governanceToken.test.js
└── README.md
