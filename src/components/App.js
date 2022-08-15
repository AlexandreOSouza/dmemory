import React, { Component, useEffect, useState } from 'react';
import Web3 from 'web3'
import './App.css';
import MemoryToken from '../abis/MemoryToken.json'
import brain from '../brain.png'

const CARD_ARRAY = [
  {
    name: 'fries',
    img: '/images/fries.png'
  },
  {
    name: 'cheeseburger',
    img: '/images/cheeseburger.png'
  },
  {
    name: 'ice-cream',
    img: '/images/ice-cream.png'
  },
  {
    name: 'pizza',
    img: '/images/pizza.png'
  },
  {
    name: 'milkshake',
    img: '/images/milkshake.png'
  },
  {
    name: 'hotdog',
    img: '/images/hotdog.png'
  },
  {
    name: 'fries',
    img: '/images/fries.png'
  },
  {
    name: 'cheeseburger',
    img: '/images/cheeseburger.png'
  },
  {
    name: 'ice-cream',
    img: '/images/ice-cream.png'
  },
  {
    name: 'pizza',
    img: '/images/pizza.png'
  },
  {
    name: 'milkshake',
    img: '/images/milkshake.png'
  },
  {
    name: 'hotdog',
    img: '/images/hotdog.png'
  }
]

const App = () => {

  const [account, setAccount] = useState('0x0')
  const [contract, setContract] = useState()
  const [totalSupply, setTotalSupply] = useState(0)
  const [tokensURIs, setTokensURIs] = useState([])
  const [cardsChosenId, setCardsChosenId] = useState([])
  const [cardsChosen, setCardsChosen] = useState([])
  const [cardsWon, setCardsWon] = useState([])
  const [cardArray, setCardArray] = useState(CARD_ARRAY.sort(() => 0.5 - Math.random()))

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

  const chooseImage = (cardId) => {
    cardId = cardId.toString()
    if(cardsWon.includes(cardId)) {
      return window.location.origin + '/images/white.png'
    }
    else if(cardsChosenId.includes(cardId)) {
      return CARD_ARRAY[cardId].img
    } else {
      return window.location.origin + '/images/blank.png'
    }
  }

  const flipCard = async (cardId) => {
    const alreadyChosen = cardsChosen.length

    console.log('flip')
    console.log(cardsChosenId)


    setCardsChosen(cardsChosen => [...cardsChosen, cardArray[cardId].name])
    setCardsChosenId(cardsChosenId => [...cardsChosenId, cardId])

    if (alreadyChosen === 1) {
      setTimeout(checkForMatch, 1000)
    }
  }

  const checkForMatch = async () => {

    const optionOneId = cardsChosenId[0]
    const optionTwoId = cardsChosenId[1]


    console.log(cardsChosen)
    console.log(cardsChosenId)

    if (optionOneId == optionTwoId) {
      alert('You have clicked the same card!')
    } else if (cardsChosen[0] == cardsChosen[1]) {
      alert('You have found a match!')
      contract.mint(
        account,
        window.location.origin + CARD_ARRAY[optionOneId].img.toString()
      )
      .send({ from: account })
      .on('transactionHash', (hash) => {
        setCardsWon(cardsWon => [...cardsWon, optionOneId, optionTwoId])
        setTokensURIs(tokensURIs => [...tokensURIs, CARD_ARRAY[optionOneId].img])
      })
    } else {
      alert('Sorry, try again!')
    }
    setCardsChosen([])
    setCardsChosenId([])

    if (cardsWon.length === CARD_ARRAY.length) {
      alert('You have won the game!')
    }
  }

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
              <h1 className="d-4">Start matching now!</h1>

              <div className="grid mb-4" >

                {/* Code goes here... */}

              </div>

              <div>

                {/* Code goes here... */}

                <div className="grid mb-4" >

                  {cardArray.map((card, key) => {
                    return(
                      <img
                        key={key}
                        src={chooseImage(key)}
                        data-id={key}
                        onClick={(event) => {
                          let cardId = event.target.getAttribute('data-id')
                          if(!cardsWon.includes(cardId.toString())) {
                            flipCard(cardId)
                          }
                        }}
                      />
                    )
                  })}

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
