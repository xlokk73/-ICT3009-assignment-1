// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;


contract MyContract {

  struct borrow_request{
    address borrower;
    int amount;
    int expiry_date;
    int interest;
  }
  
  borrow_request[] borrow_requests;
  uint borrow_request_count = 0;

  function test() public pure returns(bool) {
    return true;
  }

  function file_borrow_request(int amount, int expiry_date, int interest) public payable returns(uint) {

    borrow_requests.push(borrow_request(msg.sender, amount, expiry_date, interest));

    borrow_request_count++;
    return borrow_request_count;
  }

}
