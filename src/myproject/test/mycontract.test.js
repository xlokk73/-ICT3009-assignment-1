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

it('testing getting loan request count', async () => {
  let instance = await MyContract.deployed();
  let ret1 = await instance.submitLoanRequest(1, 1, 1);

  let ret2 = await instance.submitLoanRequest(1, 1, 1);

  let ret3 = await instance.submitLoanRequest(1, 1, 1);

  let ret = await instance.getLoanRequestCount.call();

  assert(ret.toNumber() == 3);
});



