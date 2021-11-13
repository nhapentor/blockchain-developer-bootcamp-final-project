import React from 'react'
import Link from 'next/link'
import Web3Container from '../lib/Web3Container'


const Web3Utils = require('web3-utils');

class Dapp extends React.Component {
  
  state = {
    balance: undefined,
    ethBalance: undefined,
    receiver: '',
    amount: 0
  };

  mintXaber = async () => {
    const { accounts, contract } = this.props
    await contract.methods.mint(Web3Utils.toChecksumAddress(accounts[0]), Web3Utils.toWei("1")).send({ from: accounts[0] })
    alert('Minted')
  };

  transferXaber = async () => {
    const { accounts, contract } = this.props
    await contract.methods.transfer(Web3Utils.toChecksumAddress(this.state.receiver), Web3Utils.toWei(this.state.amount)).send({ from: accounts[0] })
    alert('Transfered')
  };

  getValue = async () => {
    const { accounts, contract } = this.props
    const balanceInWei = await contract.methods.balanceOf(accounts[0]).call({ from: accounts[0] })
    this.setState({ balance: balanceInWei / 1e18 })
  };

  getEthBalance = async () => {
    const { web3, accounts } = this.props
    const balanceInWei = await web3.eth.getBalance(accounts[0])
    this.setState({ ethBalance: balanceInWei / 1e18 })
  };

  onReceiverChanged = (e) => {
    this.setState({ receiver: e.target.value })
  }  
  
  onTransferAmountChanged = (e) => {
    this.setState({ amount: e.target.value.toString() })
  }

  render () {
    const { balance = 'N/A', ethBalance = 'N/A' } = this.state

    return (
      <div>
        <h1>My Dapp</h1>

        <div>
          Receiver Address: 
          <input type="text" onChange={this.onReceiverChanged} value={this.state.receiver} />
        </div>
        <div>
          Transfer Amount: 
          <input type="text" onChange={this.onTransferAmountChanged} value={this.state.amount} />
        </div>
        <button onClick={this.transferXaber}>Transfer XABER</button>
        
        <button onClick={this.mintXaber}>Mint XABER</button>
       
        <div><button onClick={this.getValue}>Get XABER balance</button> XABER Balance: {balance}</div>
        <div> <button onClick={this.getEthBalance}>Get ETHER balance</button> Ether Balance: {ethBalance}</div>
       
      </div>
    )
  }
}

export default () => (
  <Web3Container
    renderLoading={() => <div>Loading Dapp Page...</div>}
    render={({ web3, accounts, contract }) => (
      <Dapp accounts={accounts} contract={contract} web3={web3} />
    )}
  />
)
