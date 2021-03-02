// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;


contract MyContract {

  function test() public pure returns(bool) {
    return true;
  }

  struct LoanRequest{
    address borrower;
    uint    amount;
    uint    expiryDate;
    uint    interestPaid;

    address guarantor;
    uint    guarantorInterest;

    address loaner;
  }
  
  LoanRequest[] loanRequests;


  function submitLoanRequest(uint amount, uint expiryDate, uint interestPaid) public payable returns(uint) {

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
}


