console.log('running mycontract.test.js');
 
var MyContract = artifacts.require("MyContract");


it('should call the test function which should return true', async () => {
  let instance = await MyContract.deployed();
  let ret = await instance.test.call();
  assert(ret)
});


it('testing filing a borrow request', async () => {
    let instance = await MyContract.deployed();
    let ret = await instance.submitLoanRequest.call(1, 1, 1);
    assert(ret.toNumber() == 1);
});

