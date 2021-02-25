// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;


contract MyContract {

  struct borrow_request{
    int amount;
    int expiry_date;
    int interest;
  }
  
  //borrow_request[2] borrow_requests;
  borrow_request[] borrow_requests;
  uint[] nums;
  uint borrow_request_count = 0;

  function file_borrow_request(int amount, int expiry_date, int interest) public payable returns(bool) {
    

    borrow_requests.push(borrow_request(amount, expiry_date, interest));

    //borrow_requests[borrow_request_count + 500000] = new_borrow_request;

    borrow_request_count++;
    return true;
  }
}
