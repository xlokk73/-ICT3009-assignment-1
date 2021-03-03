
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;


contract MyContract {
    

    function test() public pure returns(bool) {
        return true;
    }

    
    enum State {
        REQUESTED,
        PENDING,
        GUARANTEED,
        LOANED,
        PAID,
        TERMINATED
    }
    
  
    struct LoanRequest{
        uint    creationDate;       
        
        address payable borrower;
        uint    amount;             // Amount to be borrowed
        uint    expiryTime;         // Max time (in seconds) the loan will be paid back
        uint    interestPaid;       // Amount (in wei) paid on loan payback
  
        address payable guarantor; 
        uint    guarantorInterest;  // Amount (in wei) taken from interest by the guarantor
  
        address payable loaner;     
        State   state;            
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
    

    function getLoanRequestTimestamp(uint index) public view returns(uint) {
        return loanRequests[index].creationDate;
    }
  

    function isPending(uint index) public view returns(bool) {
      return loanRequests[index].state == State.PENDING;
    }


    function isGuaranteed(uint index) public view returns(bool) {
      return loanRequests[index].state == State.GUARANTEED;
    }
  

    function isLoaned(uint index) public view returns(bool) {
      return loanRequests[index].state == State.LOANED;
    }


    // Borrower Functions
      

    function submitLoanRequest(uint amount, uint expiryTime, uint interestPaid) public returns(uint) {
  
        loanRequests.push(LoanRequest(
            now,
            msg.sender,
            amount, 
            expiryTime, 
            interestPaid,
            address(0),
            0,
            address(0),
            State.REQUESTED
        ));
  
        return loanRequests.length;
    }
    

    function acceptGuarantee(uint index) public {
        
        require(loanRequests[index].state == State.PENDING, "Loan in invalid state");   
        require(msg.sender == loanRequests[index].borrower, "Caller is not Borrower");
        
        // Transfer money from contract to Borrower
        loanRequests[index].borrower.transfer(loanRequests[index].amount);
        
        // Mark the guarantee as guarantee as accapted
        loanRequests[index].state = State.GUARANTEED;
    }
    

    function declineGuarantee(uint index) public {
        
        require(loanRequests[index].state == State.PENDING, "Loan in invalid state");   
        require(msg.sender == loanRequests[index].borrower, "Caller is not Borrower");
        
        // Transfer money from contract to Guarantor
        loanRequests[index].guarantor.transfer(loanRequests[index].amount);
        
        // Remove guarantee from request
        loanRequests[index].guarantor           = address(0);
        loanRequests[index].guarantorInterest   = 0;
        loanRequests[index].state               = State.PENDING;
    }
  

    function payLoan(uint index) public payable {
        
        require(loanRequests[index].state == State.GUARANTEED,                                      "Loan in invalid state");   
        require(msg.value >= loanRequests[index].amount + loanRequests[index].interestPaid,     "Amount less than loan + interest");

        
        // Transfer guarantee back to Guarantor
        loanRequests[index].guarantor.transfer(loanRequests[index].amount);
        
        // Transfer interest entitled to Guarantor
        loanRequests[index].guarantor.transfer(loanRequests[index].guarantorInterest);
        
        // Transfer interest entitled to Loaner
        loanRequests[index].loaner.transfer(loanRequests[index].interestPaid - loanRequests[index].guarantorInterest);
        
        // Transfer original amount to Loaner
        loanRequests[index].loaner.transfer(loanRequests[index].amount);
        
        // Mark loan as paid
        loanRequests[index].state = State.PAID;
    }
  

    // Guarantor Functions
      

    function guaranteeLoan(uint index, uint interest) public payable returns(uint){

        require(loanRequests[index].state == State.REQUESTED,   "Loan already completed");   
        require(msg.value >= loanRequests[index].amount,        "Insufficient balance given");
        require(loanRequests[index].interestPaid > interest,    "Guarantor interest must be less than Borrower interest");
        
        // Store guarantee in contract done by default
  
        // Update the loan request information
        loanRequests[index].guarantor           = msg.sender;
        loanRequests[index].guarantorInterest   = interest;
        loanRequests[index].state               = State.PENDING;
    }
    
    
    // Loaner Functions
    

    function provideLoan(uint index) public payable{
        
        require(loanRequests[index].state == State.GUARANTEED,  "Loan in invalid state");   
        require(msg.value >= loanRequests[index].amount,        "Insufficient balance given");
        
        
        // Transfer Money
        loanRequests[index].borrower.transfer(loanRequests[index].amount);
        
        // Update loan request
        loanRequests[index].loaner  = msg.sender;
        loanRequests[index].state   = State.LOANED;
    }
    
    
    function getGuarantee(uint index) public {
        
        require(loanRequests[index].state == State.LOANED,                                  "Loan in invalid state");   
        require(loanRequests[index].creationDate + loanRequests[index].expiryTime < now,    "Loan has not expired yet");
        require(msg.sender == loanRequests[index].loaner,                                   "Caller is not the loaner");
        
        // Check if there is enough balance in the contract (should always be true)
        assert(address(this).balance > loanRequests[index].amount);
        
        // Pay guarantee to Lender 
        loanRequests[index].loaner.transfer(loanRequests[index].amount);
        
        // Mark loan request as successfully paid
        loanRequests[index].state = State.PAID;
    }
}
