
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;


contract MyContract {
    

    function test() public pure returns(bool) {
        return true;
    }
  
    struct LoanRequest{
        uint    creationDate;       
        
        address payable borrower;
        uint    amount;             // Amount to be borrowed
        uint    expiryTime;         // Max time (in seconds) the loan will be paid back
        uint    interestPaid;       // Amount (in wei) paid on loan payback
  
        address payable guarantor; 
        uint    guarantorInterest;  // Amount (in wei) taken from interest by the guarantor
        bool    guaranteeAccapted;
  
        address payable loaner;     
        uint    success;            // 0 for no, 1 for successful, 2 for expired
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
            loanRequests[index].expiryTime,
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
            address(0),
            0
        ));
  
        return loanRequests.length;
    }
    
    function acceptGuarantee(uint index) public {
        
        require(loanRequests[index].success == 0,           "Loan already completed");   
        require(msg.sender == loanRequests[index].borrower, "Caller is not Borrower");
        
        // Transfer money from contract to Borrower
        loanRequests[index].borrower.transfer(loanRequests[index].amount);
        
        // Mark the guarantee as guarantee as accapted
        loanRequests[index].guaranteeAccapted = true;
    }
    
    function declineGuarantee(uint index) public {
        
        require(loanRequests[index].success == 0,           "Loan already completed");   
        require(msg.sender == loanRequests[index].borrower, "Caller is not Borrower");
        
        // Transfer money from contract to Guarantor
        loanRequests[index].guarantor.transfer(loanRequests[index].amount);
        
        // Remove guarantee from request
        loanRequests[index].guarantor = address(0);
        loanRequests[index].guarantorInterest = 0;
    }
  
    function payLoan(uint index) public payable {
        
        require(loanRequests[index].success == 0,                                               "Loan already completed");
        require(msg.value >= loanRequests[index].amount + loanRequests[index].interestPaid,     "Amount not equal to loan + interest");
        
    }
  
    // Guarantor Functions
      
    function guaranteeLoan(uint index, uint interest) public payable returns(uint){

        require(loanRequests[index].success == 0,               "Loan already completed");   
        require(loanRequests[index].guarantor == address(0),    "Loan already guaranteed");
        require(msg.value >= loanRequests[index].amount,        "Insufficient balance given");
        require(loanRequests[index].interestPaid > interest,    "Guarantor interest must be less than Borrower interest");
        
        // Store guarantee in contract done by default
  
        // Update the loan request information
        loanRequests[index].guarantor = msg.sender;
        loanRequests[index].guarantorInterest = interest;
    }
    
    
    // Loaner Functions
    
    function provideLoan(uint index) public payable{
        
        require(loanRequests[index].success == 0,               "Loan already completed");   
        require(loanRequests[index].guarantor != address(0),    "Loan not guaranteed yet");
        require(msg.value >= loanRequests[index].amount,        "Insufficient balance given");
        
        
        // Transfer Money
        loanRequests[index].borrower.transfer(loanRequests[index].amount);
        
        // Update loan request
        loanRequests[index].loaner = msg.sender;
    }
    
    function getGuarantee(uint index) public {
        
        require(loanRequests[index].success == 0,                                           "Loan already completed");   
        require(loanRequests[index].creationDate + loanRequests[index].expiryTime < now,    "Loan has not expired yet");
        require(msg.sender == loanRequests[index].loaner,                                   "Caller is not the loaner");
        
        // Check if there is enough balance in the contract (should always be true)
        assert(address(this).balance > loanRequests[index].amount);
        
        // Pay guarantee to Lender 
        loanRequests[index].loaner.transfer(loanRequests[index].amount);
        
        // Mark loan request as successful
        loanRequests[index].success = 1;
    }
}



