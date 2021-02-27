console.log('running mycontract.test.js');
 
var MyContract = artifacts.require("MyContract");

// it('testing filing a borrow request', function() {
//   MyContract.deployed().then(function(instance) {
//     instance.file_borrow_request.call(1, 1, 1).then(function(ret) {
//       assert(ret == 1);
//     });
//   });
// });

contract('MyContract', function(accounts) {
    it('should return true', function() {
      assert(false);
    });
});


it('should check that the test function returns true (test should fail)', function() {
    MyContract.deployed().then(function(instance) {
        instance.test.call().then(function(ret) {
            assert(ret);
        });
    });
});
