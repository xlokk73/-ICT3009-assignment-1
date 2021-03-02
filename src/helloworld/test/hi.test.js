console.log('running hi.test.js');
 
var Hi = artifacts.require("Hi");

contract('Hi', function(accounts) {
  it('should return true', function(){
    assert(true);
  });

  it('should also return true', function(){
    assert(true);
  });

  it('should check that the test function returns true', function() {
    Hi.deployed().then(function(instance) {
      instance.test.call().then(function(ret) {
        assert(ret);
      });
    });
  });



});