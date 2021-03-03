console.log('running mycontract.test.js');
 
var MyContract = artifacts.require("MyContract");


it('should call the test function which should return true', async () => {
  let instance = await MyContract.deployed();
  let ret = await instance.test.call();
  assert(ret)
});

contract('MyContract', accounts => {
  const borrower = accounts[0];
  const loaner = accounts[1];
  const guarantor = accounts[2];

  it('testing submitting a loan request', async () => {
    const contract = await MyContract.deployed();
    await contract.submitLoanRequest(200, 1614786990, 20, { from: borrower });
    await contract.submitLoanRequest(300, 1614786990, 18, { from: borrower });
    let ret = await contract.getLoanRequestCount.call();
    assert(ret.toNumber() == 2);
  });

  // it('testing submitting a guarantee request', async() => {
  //   const contract = await MyContract.deployed();
  //   await contract.guaranteeLoan(0, 12);
  //   let ret = await contract
  // });

});

