const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('GovernanceToken', () => {
  let GovernanceToken, governanceToken, owner, addr1, addr2;

  beforeEach(async () => {
    GovernanceToken = await ethers.getContractFactory('GovernanceToken');
    [owner, addr1, addr2, _] = await ethers.getSigners();

    governanceToken = await GovernanceToken.deploy();
    await governanceToken.deployed();
  });

  describe('Deployment', () => {
    it('Should set the correct owner', async () => {
      expect(await governanceToken.owner()).to.equal(owner.address);
    });

    it('Should assign the total supply of tokens to the owner', async () => {
      const ownerBalance = await governanceToken.balanceOf(owner.address);
      expect(ownerBalance).to.equal('100000000000000000000000');
    });
  });

  describe('Transactions', () => {
    it('Should transfer tokens between accounts', async () => {
      await governanceToken.transfer(addr1.address, 100);
      const addr1Balance = await governanceToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);
    });

    it('Should fail if sender doesn’t have enough tokens', async () => {
      const initialOwnerBalance = await governanceToken.balanceOf(owner.address);

      await expect(governanceToken.connect(addr1).transfer(addr2.address, 1000)).to.be.revertedWith('ERC20: transfer amount exceeds balance');

      expect(await governanceToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });
it('Should update balances after transfers', async () => {
      const initialOwnerBalance = await governanceToken.balanceOf(owner.address);

      await governanceToken.transfer(addr1.address, 100);
      await governanceToken.transfer(addr2.address, 100);

      const finalOwnerBalance = await governanceToken.balanceOf(owner.address);
      expect(initialOwnerBalance.sub(100)).to.equal(finalOwnerBalance);

      const addr1Balance = await governanceToken.balanceOf(addr1.address);
      expect(addr1Balance.toString()).to.equal('100');

      const addr2Balance = await governanceToken.balanceOf(addr2.address);
      expect(addr2Balance.toString()).to.equal('100');
    });

    it('Should not allow owner to transfer more than 10% of the total supply in a single transaction', async () => {
      const initialOwnerBalance = await governanceToken.balanceOf(owner.address);
      const initialTotalSupply = await governanceToken.totalSupply();

      await expect(governanceToken.transfer(addr1.address, 10000000000000000000)).to.be.revertedWith('Transfer exceeding 10% is not allowed');

      expect(await governanceToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
      expect(await governanceToken.totalSupply()).to.equal(initialTotalSupply);
    });
  });

  describe('Approval', () => {
    it('Should approve tokens for a given spender', async () => {
      await governanceToken.approve(addr1.address, 100);

      const spenderAllowance = await governanceToken.allowance(owner.address, addr1.address);
      expect(spenderAllowance.toString()).to.equal('100');
    });
  });

  describe('Transfer from', () => {
    it('Should transfer tokens on behalf of the sender', async () => {
      await governanceToken.approve(addr1.address, 100);
      await governanceToken.connect(addr1).transferFrom(owner.address, addr2.address, 100);

      const addr1Balance = await governanceToken.balanceOf(addr1.address);
      expect(addr1Balance.toString()).to.equal('0');

      const addr2Balance = await governanceToken.balanceOf(addr2.address);
      expect(addr2Balance.toString()).to.equal('100');

      const spenderAllowance = await governanceToken.allowance(owner.address, addr1.address);
      expect(spenderAllowance.toString()).to.equal('0');
    });
  });

  describe('Burning', () => {
    it('Should decrease the total supply upon burning tokens', async () => {
      const initialTotalSupply = await governanceToken.totalSupply();
      const initialOwnerBalance = await governanceToken.balanceOf(owner.address);

      await governanceToken.burn(100);

      const finalOwnerBalance = await governanceToken.balanceOf(owner.address);
      expect(finalOwnerBalance.toString()).to.equal('99999999999999999900');

      const finalTotalSupply = await governanceToken.totalSupply();
      expect(finalTotalSupply.toString()).to.equal('99999999999999999900');
    });

    it('Should fail if the caller is not the owner and the token amount is greater than 10% of the total supply', async () => {
      await expect(governanceToken.connect(addr1).burn(10000000000000000000)).to.be.revertedWith('Caller is not the owner and token amount is greater than 10% of the total supply');
    });
  });
});
