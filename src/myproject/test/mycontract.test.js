console.log('running hi.test.js');
 
var MyContract = artifacts.require("MyContract");

// contract('MyContract', function(accounts) {
//   it('should return true', function() {
//     assert(true);
//   });
// });

it('testing should return true', function() {
  MyContract.deployed().then(function(instance) {
    instance.file_borrow_request.call(1, 1, 1).then(function(ret) {
      assert(ret == 1);
    });
  });
});

