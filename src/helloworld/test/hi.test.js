console.log('running hi.test.js');
 
var Hi = artifacts.require("Hi");

contract('Hi', function(accounts) {
  it('should return true', function() {
    assert(false);
  });
});

it('should check that the test function returns true (test should fail)', function() {
  Hi.deployed().then(function(instance) {
    instance.test.call().then(function(ret) {
      assert(ret);
    });
  });
});