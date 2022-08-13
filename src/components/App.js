import React, { Component, useEffect, useState } from 'react';
import Web3 from 'web3'
import './App.css';
import MemoryToken from '../abis/MemoryToken.json'
import brain from '../brain.png'

const App = () => {

  const [account, setAccount] = useState('0x0')
  const [contract, setContract] = useState()
  const [totalSupply, setTotalSupply] = useState(0)
  const [tokensURIs, setTokensURIs] = useState([])
  const [cardArray, setCardArray] = useState([])
  const [cardsChosen, setCardsChosen] = useState([])
  const [cardsWon, setCardsWon] = useState([])

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  const loadBlockchainData = async () => {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    setAccount(accounts[0])

    const networkId = await web3.eth.net.getId()
    const networkData = MemoryToken.networks[networkId]

    if (networkData) {
      const abi = MemoryToken.abi
      const address = networkData.address
      const tokenContract = new web3.eth.Contract(abi, address)
      setContract(tokenContract)
      const totalSupply = await tokenContract.methods.totalSupply().call()
      setTotalSupply(totalSupply)

      // Load Tokens
      let balanceOf = await tokenContract.methods.balanceOf(accounts[0]).call()
      for (let i = 0; i < balanceOf; i++) {
        let id = await tokenContract.methods.tokenOfOwnerByIndex(accounts[0], i).call()
        let tokenURI = await tokenContract.methods.tokenURI(id).call()
        setTokensURIs(tokensURIs => [...tokensURIs, tokenURI])
      }

    } else {
      alert('Smart contract not deployed to detected network.')
    }
  }
  
  useEffect(() => {
    loadWeb3()
    loadBlockchainData()
  }, [])

  return (
    <div>
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="http://www.dappuniversity.com/bootcamp"
          target="_blank"
          rel="noopener noreferrer"
        >
        <img src={brain} width="30" height="30" className="d-inline-block align-top" alt="" />
        &nbsp; Memory Tokens
        </a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-muted"><span id="account">{account}</span></small>
          </li>
        </ul>
      </nav>
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto">
              <h1 className="d-4">Edit this file in App.js!</h1>

              <div className="grid mb-4" >

                {/* Code goes here... */}

              </div>

              <div>

                {/* Code goes here... */}

                <div className="grid mb-4" >

                  {/* Code goes here... */}

                </div>

              </div>

            </div>

          </main>
        </div>
      </div>
    </div>
  )
}

export default App;
