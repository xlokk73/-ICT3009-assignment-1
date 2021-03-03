console.log('running mycontract.test.js');
 
var MyContract = artifacts.require("MyContract");


it('should call the test function which should return true', async () => {
  let instance = await MyContract.deployed();
  let ret = await instance.test.call();
  assert(ret)
});

contract('MyContract', accounts => {
  const borrower = accounts[0];
  const guarantor = accounts[1];
  const loaner = accounts[2];
  
  it('testing submitting a loan request', async () => {
    const contract = await MyContract.deployed();
    await contract.submitLoanRequest(200, 1614786990, 20, { from: borrower });
    await contract.submitLoanRequest(300, 1614786990, 18, { from: borrower });
    let ret = await contract.getLoanRequestCount.call();
    assert(ret.toNumber() == 2);
  });

  it('testing submitting a guarantee request', async() => {
    const contract = await MyContract.deployed();
    await contract.guaranteeLoan(0, 12, {value: 500, account: guarantor});
    let ret = await contract.isPending.call(0);
    assert(ret);
  });

  it('testing accepting a guarantee request', async() => {
    const contract = await MyContract.deployed();
    await contract.acceptGuarantee(0, {from: borrower});
    let ret = await contract.isGuaranteed.call(0);
    assert(ret);
  });

  it('testing declining a guarantee request', async() => {
    const contract = await MyContract.deployed();
    await contract.guaranteeLoan(1, 12, {value: 500, account: guarantor});
    await contract.declineGuarantee(1, {from: borrower});
    let ret = await contract.isPending.call(1);
    assert(ret);
  });

  it('testing loaning some balance', async() => {
    const contract = await MyContract.deployed();
    await contract.provideLoan(0, {value: 500, account: loaner});
    let ret = await contract.isLoaned.call(0);
    assert(ret);
  });

});

