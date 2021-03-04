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
    await contract.submitLoanRequest(200, 1614786990, 20, { value: 0, account: borrower });
    await contract.submitLoanRequest(300, 1614786990, 18, { value: 0, account: borrower });
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
    await contract.acceptGuarantee(0, {value: 0, account: borrower});
    let ret = await contract.isGuaranteed.call(0);
    assert(ret);
  });

  it('testing declining a guarantee request', async() => {
    const contract = await MyContract.deployed();
    await contract.guaranteeLoan(1, 12, {value: 500, account: guarantor});
    await contract.declineGuarantee(1, {value:0, account: borrower});
    let ret = await contract.isPending.call(1);
    assert(ret);
  });

  it('testing loaning some balance', async() => {
    const contract = await MyContract.deployed();
    await contract.provideLoan(0, {value: 500, account: loaner});
    let ret = await contract.isLoaned.call(0);
    assert(ret);
  });

  it('testing paying a loan back', async() => {
    const contract = await MyContract.deployed();
    await contract.payLoan(0, {value: 500, account: borrower});
    let ret = await contract.isPaid.call(0);
    assert(ret);
  });

  it('testing getting money from guarantee for expired loans', async() => {
    const contract = await MyContract.deployed();
    await contract.submitLoanRequest(200, 1, 50, {value: 0, account: borrower});
    await contract.guaranteeLoan(2, 40, {value: 500, account: guarantor});
    await contract.acceptGuarantee(2, {value:0, account: borrower});
    await contract.provideLoan(2, {value: 500, account: guarantor});

    function timeout(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    await timeout(2000);

    await contract.getGuarantee(2, {value: 0, account: loaner});
    ret = await contract.isTerminated.call(2);
    assert(ret);
  });

  // Testing misuse

  it('testing accepting an already accepted loan', async() => {
    const contract = await MyContract.deployed();
    
    try {
      await contract.acceptGuarantee(0, {from: borrower});
    } catch (error) {
      assert.equal(error.reason, "Loan in invalid state")
    }
  });

  it('testing a guarantor accepting his own guarantee', async() => {
    const contract = await MyContract.deployed();
    await contract.submitLoanRequest(200, 100000, 20, {from: borrower});
    await contract.guaranteeLoan(3, 10, {value: 500, from: guarantor});
    
    try {
      await contract.acceptGuarantee(3, {from: guarantor});
    } catch (error) {
      assert.equal(error.reason, "Caller is not Borrower")
    }
  });

  it('testing a entering payLoan() while in bad state', async() => {
    const contract = await MyContract.deployed();
    
    try {
      await contract.payLoan(0, {from: borrower});
    } catch (error) {
      assert.equal(error.reason, "Loan in invalid state")
    }
  });

  it('testing paying without enough balance', async() => {
    const contract = await MyContract.deployed();
    await contract.submitLoanRequest(200, 100000, 20, {from: borrower});
    await contract.guaranteeLoan(4, 10, {value: 500, from: guarantor});
    await contract.acceptGuarantee(4, {from: borrower});
    await contract.provideLoan(4, {value: 500, from: loaner});
    
    try {
      await contract.payLoan(4, {value: 200, from: borrower});
    } catch (error) {
      assert.equal(error.reason, 'Amount less than loan + interest')
    }
  });


  it('testing guarantee to an invalid state', async() => {
    const contract = await MyContract.deployed();
    
    try {
      await contract.guaranteeLoan(4, 10, {value: 200, from: guarantor});
    } catch (error) {
      assert.equal(error.reason, 'Loan in invalid state')
    }
  });

  it('testing submitting guarantee without enough balance', async() => {
    const contract = await MyContract.deployed();
    await contract.submitLoanRequest(200, 100000, 20, {from: borrower});
    
    try {
      await contract.guaranteeLoan(5, 10, {value: 100, from: guarantor});
    } catch (error) {
      assert.equal(error.reason, 'Insufficient balance given')
    }
  });

  it('testing submitting guarantee with more interest than borrower', async() => {
    const contract = await MyContract.deployed();
    await contract.submitLoanRequest(200, 100000, 20, {from: borrower});
    
    try {
      await contract.guaranteeLoan(5, 30, {value: 500, from: guarantor});
    } catch (error) {
      assert.equal(error.reason, 'Guarantor interest must be less than Borrower interest')
    }
  });

  it('testing providing a loan with insufficient balance', async() => {
    const contract = await MyContract.deployed();
    await contract.submitLoanRequest(200, 100000, 20, {from: borrower});
    await contract.guaranteeLoan(5, 10, {value: 500, from: guarantor});
    await contract.acceptGuarantee(5, {from: borrower});
    
    try {
      await contract.provideLoan(5, {value: 100, from: loaner});
    } catch (error) {
      assert.equal(error.reason, 'Insufficient balance given')
    }
  });

  it('testing providing a loan on invalid state', async() => {
    const contract = await MyContract.deployed();
    await contract.provideLoan(5, {value: 500, from: loaner});
    
    try {
      await contract.provideLoan(5, {value: 500, from: loaner});
    } catch (error) {
      assert.equal(error.reason, 'Loan in invalid state')
    }
  });

  it('testing getGuarantee() on invalid state', async() => {
    const contract = await MyContract.deployed();
    await contract.submitLoanRequest(200, 100000, 20, {from: borrower});
    
    try {
      await contract.provideLoan(6, {value: 500, from: loaner});
    } catch (error) {
      assert.equal(error.reason, 'Loan in invalid state')
    }
  });

  it('testing getGuarantee() on non-expired loan', async() => {
    const contract = await MyContract.deployed();
    
    try {
      await contract.getGuarantee(5, {from: loaner});
    } catch (error) {
      assert.equal(error.reason, 'Loan has not expired yet')
    }
  });

  it('testing getting money from guarantee for expired loans by non-loaner account', async() => {
    const contract = await MyContract.deployed();
    await contract.submitLoanRequest(200, 1, 50, {from: borrower});
    num = await contract.getLoanRequestCount();
    await contract.guaranteeLoan(9, 40, {value: 500, from: guarantor});
    await contract.acceptGuarantee(9, {from: borrower});
    await contract.provideLoan(9, {value: 500, from: guarantor});

    function timeout(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    await timeout(2000);

    try {
      await contract.getGuarantee(9, {value: 0, account: guarantor});
    } catch (error) {
      assert.equal(error.reason, 'Caller is not the loaner')
    }
  });

});


