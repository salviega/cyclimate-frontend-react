import React, { useRef } from 'react'
import { ethers } from 'ethers'

import './CyclimateSupplyNFTs.scss'

export function CyclimateSupplyNFTs ({
  contracts,
  tokenIdCounter,
  onLoading,
  onSincronizedItems
}) {
  const price = useRef()
  const tokenURI = useRef()
  const tokenId = useRef()
  const artistWallet = useRef()
  const taxFee = useRef()

  const putInSale = async (event) => {
    event.preventDefault()
    let roundPrice = Math.round(Number(price.current.value))
    let parsedTaxFee = parseInt(taxFee.current.value)
    parsedTaxFee = (parsedTaxFee * roundPrice) / 100
    parsedTaxFee = ethers.utils.parseEther(parsedTaxFee.toString(), 'ether')
    roundPrice = ethers.utils.parseEther(roundPrice.toString(), 'ether')
    const parsedTokenId = parseInt(tokenId.current.value)

    try {
      const response = await contracts.marketPlaceContract.mint(
        tokenURI.current.value,
        artistWallet.current.value,
        parsedTaxFee,
        contracts.cycliContract.address
      )

      onLoading()
      contracts.web3Provider
        .waitForTransaction(response.hash)
        .then(async (_response) => {
          const response2 = await contracts.marketPlaceContract.approve(
            contracts.marketPlaceContract.address,
            parsedTokenId,
            { gasLimit: 250000 }
          )
          contracts.web3Provider
            .waitForTransaction(response2.hash)
            .then(async (_response2) => {
              setTimeout(async () => {
                const response3 = await contracts.marketPlaceContract.sellItem(
                  contracts.marketPlaceContract.address,
                  parsedTokenId,
                  roundPrice
                )
                contracts.web3Provider
                  .waitForTransaction(response3.hash)
                  .then((_response3) => {
                    setTimeout(() => {
                      window.alert('It has just put the NFT up for sale')
                      onSincronizedItems()
                    }, 3000)
                  })
                  .catch((error) => {
                    window.alert('Hubo un error, revisa la consola')
                    onSincronizedItems()
                    console.error(error)
                  })
              }, 5000)
            })
            .catch((error) => {
              window.alert('Hubo un error, revisa la consola')
              onSincronizedItems()
              console.error(error)
            })
        })
        .catch((error) => {
          window.alert('Hubo un error, revisa la consola')
          onSincronizedItems()
          console.error(error)
        })
    } catch (error) {
      window.alert('Hubo un error, revisa la consola')
      onSincronizedItems()
      console.error(error)
    }
  }

  return (
    <div className='supply'>
      <h1 className='supply__title'>Sell NFT</h1>
      <form className='supply-form' onSubmit={putInSale}>
        <span>
          <p className='supply-form__subtitle'>Add the price in Cyclimate: </p>
          <input
            className='supply-form__add'
            type='number'
            required
            min='1'
            step='0.01'
            ref={price}
          />
        </span>
        <span>
          <p className='supply-form__subtitle'>Add the token ID: </p>
          <input
            className='supply-form__add'
            type='number'
            required
            min='0'
            step='0'
            ref={tokenId}
          />
        </span>
        <span>
          <p className='supply-form__subtitle'>
            Add the metadata of the new NFT:{' '}
          </p>
          <input
            className='supply-form__add'
            type='url'
            required
            ref={tokenURI}
          />
        </span>
        <span>
          <p className='supply-form__subtitle'>Wallet of the artist: </p>
          <input
            className='supply-form__add'
            type='text'
            required
            ref={artistWallet}
          />
        </span>
        <span>
          <p className='supply-form__subtitle'>% Fee of the artist: </p>
          <input
            className='supply-form__add'
            type='number'
            required
            min='1'
            step='1'
            max='100'
            ref={taxFee}
          />
        </span>
        <div className='supply-form-create'>
          <button className='supply-form-create__submit'>Create NFT</button>
          <p className='supply-form-create__idCounter'>
            {' '}
            currency token ID: {tokenIdCounter}
          </p>
        </div>
      </form>
    </div>
  )
}
