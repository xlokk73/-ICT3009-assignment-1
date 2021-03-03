// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;


contract MyContract {
    

  function test() public pure returns(bool) {
    return true;
  }

  struct LoanRequest{
    uint    creationDate;
    address payable borrower;
    uint    amount;
    uint    expiryDate;
    uint    interestPaid;

    address payable guarantor;
    uint    guarantorInterest;
    bool    guaranteeAccapted;

    address payable loaner;
  }
  
  LoanRequest[] loanRequests;
  
  function getLoanRequestCount() public view returns(uint) {
    return loanRequests.length;  
  }

  function getLoanRequest(uint index) public view returns(
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


  // Borrower Functions
    
  function submitLoanRequest(uint amount, uint expiryDate, uint interestPaid) public returns(uint) {

    loanRequests.push(LoanRequest(
      now,
      msg.sender,
      amount, 
      expiryDate, 
      interestPaid,
      address(0),
      0,
      false,
      address(0)
    ));

    return loanRequests.length;
  }
  
  function acceptGuarantee(uint index) public {
      
    // Check that the caller is the person who submitted the request
    require(msg.sender == loanRequests[index].borrower, "Dude, you are not the person who submitted the request!");
    
    // Transfer money from contract to Borrower
    loanRequests[index].borrower.transfer(loanRequests[index].amount);
    
    // Mark the guarantee as guarantee as accapted
    loanRequests[index].guaranteeAccapted = true;
  }
  
  function declineGuarantee(uint index) public {
    // Check that the caller is the person who submitted the request
    require(msg.sender == loanRequests[index].borrower, "Dude, you are not the person who submitted the request!");
    
    // Transfer money from contract to Guarantor
    loanRequests[index].guarantor.transfer(loanRequests[index].amount);
    
    // Remove guarantee from request
    loanRequests[index].guarantor = address(0);
    loanRequests[index].guarantorInterest = 0;
  }


  // Guarantor Functions
    
  function guaranteeLoan(uint index, uint interest) public payable returns(uint){
    // Check that the loan is not guaranteed
    require(loanRequests[index].guarantor == address(0), "Loan already guaranteed");
    // Check that the guarantor has enough balance
    require(msg.value >= loanRequests[index].amount, "Not enough money brotha");
    
    // Store guarantee in contract done by default

    // Update the loan request information
    loanRequests[index].guarantor = msg.sender;
    loanRequests[index].guarantorInterest = interest;
  }
  
  
  // Loaner Functions
  
  function provideLoan(uint index) public payable{
      
    // We need to check that the loan request is guaranteed
    require(loanRequests[index].guarantor != address(0), "Loan not guaranteed !");
    
    // We need to check that the loaner has enough balance
    require(msg.value >= loanRequests[index].amount, "Insufficient balance brotha");
    
    
    // Transfer Money
    loanRequests[index].borrower.transfer(loanRequests[index].amount);
    
    // Update loan request
    loanRequests[index].loaner = msg.sender;
  }
}



