//import React, { useEffect } from 'react';
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Web3 from 'web3';
var web3;
var contractAddress = '0x6EfF55086C780e0e7657c8645FF3c57bFF5f963E' 

function setupWeb3() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      window.ethereum.enable().then(function() {
        //user has allowed access
      });
    }catch(e) {
    }
  } else if (window.web3) {
    web3 = new Web3(window.web3.currentProvider);
  } else {
    alert('You have to install MetaMask!');
  }
}

var abi = [
  {
    "inputs": [],
    "name": "test",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "pure",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "getLoanRequestCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "getLoanRequest",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "getLoanRequestTimestamp",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "isPending",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "isGuaranteed",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "isLoaned",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "isPaid",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "isTerminated",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "expiryTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "interestPaid",
        "type": "uint256"
      }
    ],
    "name": "submitLoanRequest",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "acceptGuarantee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "declineGuarantee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "payLoan",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
    "payable": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "interest",
        "type": "uint256"
      }
    ],
    "name": "guaranteeLoan",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function",
    "payable": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "provideLoan",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
    "payable": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "getGuarantee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

class App extends Component {
  state ={
    loanRequestCount: 'n/a',
    accountNum: 0,
    valueToSend: 0,
    loanRequestAmount: 0,
    loanRequestTime: 0,
    loanRequestInterest: 0,

    guaranteeIndex: 0,
    guranteeInterest: 0,
    guaranteeBalance: 0
  };

  async updateState() {
    var myContract = myContract = new web3.eth.Contract(abi, contractAddress);
    const loanRequestCount = await myContract.methods.getLoanRequestCount().call();
    this.setState({loanRequestCount});
  }

  async componentDidMount() {
    setupWeb3();
    var myContract = myContract = new web3.eth.Contract(abi, contractAddress);
    this.updateState();
  }

  sendEther = async (event) => {
    event.preventDefault();
    var accounts = await web3.eth.getAccounts();
    var myContract = myContract = new web3.eth.Contract(abi, contractAddress);
    await myContract.methods.guaranteeLoan(0, 1).send({
      from: accounts[0],
      value: this.state.valueToSend
    });
    this.updateState();
  }

  submitLoanRequest = async (event) => {
    event.preventDefault();
    var accounts = await web3.eth.getAccounts();
    var myContract = myContract = new web3.eth.Contract(abi, contractAddress);
    await myContract.methods.submitLoanRequest(this.state.loanRequestAmount, this.state.loanRequestTime, this.state.loanRequestInterest).send({
      from: accounts[0]
    });
    this.updateState();
  }

  guaranteeLoanRequest = async (event) => {
    event.preventDefault();
    var accounts = await web3.eth.getAccounts();
    var myContract = myContract = new web3.eth.Contract(abi, contractAddress);
    await myContract.methods.guaranteeLoan(this.state.guaranteeIndex, this.state.guranteeInterest).send({
      from: accounts[0],
      value: this.state.guaranteeBalance
    });
    this.updateState();
  }

  render() {
    return (
      <div>
      Loan Request Count: {this.state.loanRequestCount}<br/>
      <form onSubmit={this.submitLoanRequest}>
        <label> </label>
        <p>Submit Loan Request</p>
        <input
          amount={this.state.loanRequestAmount}
          onChange={event => this.setState({loanRequestAmount: event.target.value})}
          />
          <input
          amount={this.state.loanRequestTime}
          onChange={event => this.setState({loanRequestTime: event.target.value})}
          />
          <input
          amount={this.state.loanRequestInterest}
          onChange={event => this.setState({loanRequestInterest: event.target.value})}
          />
          <br/>
          <button> Submit Loan Request</button>
      </form>

      <form onSubmit={this.guaranteeLoanRequest}>
        <label> </label>
        <p>Submit Guarantee</p>
        <input
          amount={this.state.guaranteeIndex}
          onChange={event => this.setState({guaranteeIndex: event.target.value})}
          />
          <input
          amount={this.state.guaranteeInterest}
          onChange={event => this.setState({guaranteeInterest: event.target.value})}
          />
          <input
          amount={this.state.guaranteeBalance}
          onChange={event => this.setState({guaranteeBalance: event.target.value})}
          />
          <br/>
          <button> Submit Guanartee</button>
      </form>

      </div>

      // <div>
      //   Loan Request Count: {this.state.lostAmount}<br/>
      //   <form onSubmit={this.sendEther}>
      //     <label> Amount of Ether to send</label>
      //     <input
      //       value={this.state.valueToSend}
      //       onChange={event => this.setState({valueToSend: event.target.value})}
      //       />
      //       <br/>
      //       <button> Send Ether</button>
      //   </form>
      //   </div>
    );
  }

}


// function App() {
//   setupWeb3();
//   web3.eth.getAccounts().then(console.log);

//   useEffect(() => {
//     async function executeAsync() {
//       var myContract = new web3.eth.Contract(abi, contractAddress);
//       const ret = await myContract.methods.test().call();
//       console.log(ret);
//     }
//     executeAsync();
//   })

//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

export default App;
