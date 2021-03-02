// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Hi {

  function test() public pure returns(bool) {
    return true;
  }
  

  //uint[] myNumbers;
  uint[8] myNumbers;
  uint count = 0;

  function addNumber(uint num) public payable returns(uint) {

    //myNumbers.push(num);
    myNumbers[count] = num;
    count++;

    return count;
  }

  uint myNum = 10;
  function changeNum(uint num) public payable returns(uint) {
    myNum = num;
    return myNum;
  }

  function getNum() public payable returns(uint) {
    return myNum;
  }

}
