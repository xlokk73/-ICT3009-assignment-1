// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;


contract MyContract {

  struct borrow_request{
    int amount;
    int expiry_date;
    int interest;
  }
  
  borrow_request[] borrow_requests;
  uint borrow_request_count = 0;

  function test() public pure returns(bool) {
    return false;
  }

  function file_borrow_request(int amount, int expiry_date, int interest) public payable returns(uint) {

    borrow_requests.push(borrow_request(amount, expiry_date, interest));

    return borrow_request_count++;
  }


}
