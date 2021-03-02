// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;


contract MyContract {

  function test() public pure returns(bool) {
    return true;
  }

  struct LoanRequest{
    address payable borrower;
    uint    amount;
    uint    expiryDate;
    uint    interestPaid;

    address payable guarantor;
    uint    guarantorInterest;

    address payable loaner;
  }
  
  LoanRequest[] loanRequests;


  function submitLoanRequest(uint amount, uint expiryDate, uint interestPaid) public returns(uint) {

    loanRequests.push(LoanRequest(
      msg.sender,
      amount, 
      expiryDate, 
      interestPaid,
      address(0),
      0,
      address(0)
    ));

    return loanRequests.length;
  }

  function getLoanRequestCount() public payable returns(uint) {
    return loanRequests.length;  
  }

  function getLoanRequest(uint index) public payable returns(
    address, 
    uint, 
    uint,
    uint, 
    address,
    uint,
    address) {

    return (
      loanRequests[index].borrower,
      loanRequests[index].amount,
      loanRequests[index].expiryDate,
      loanRequests[index].interestPaid,
      loanRequests[index].guarantor,
      loanRequests[index].guarantorInterest,
      loanRequests[index].loaner
    );
  }

  function guaranteeLoan(uint index, uint interest) public payable {
    // Pay the guarantee provided ypu have enough balannce
    require(msg.value >= loanRequests[index].amount, "Insufficient balance in account");

    // Update the loan request information
    loanRequests[index].guarantor = msg.sender;
    loanRequests[index].guarantorInterest = interest;
  }
  
  function provideLoan(uint index) public {
        msg.sender.transfer(loanRequests[index].amount);
  }
}



