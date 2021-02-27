// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;


contract MyContract {

  function test() public pure returns(bool) {
    return true;
  }

  struct LoanRequest{
    address borrower;
    int amount;
    int expiry_date;
    int interest;
  }
  
  LoanRequest[] loan_requests;
  uint loanRequestCount = 0;



  function submitLoanRequest(int amount, int expiry_date, int interest) public payable returns(uint) {

    loan_requests.push(LoanRequest(msg.sender, amount, expiry_date, interest));

    loanRequestCount++;
    return loanRequestCount;
  }

}
