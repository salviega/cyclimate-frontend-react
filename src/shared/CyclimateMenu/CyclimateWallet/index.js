import './CyclimateWallet.scss'
import React from 'react'
import { ethers } from 'ethers'
import {useViewerConnection} from "@self.id/react";
import { EthereumAuthProvider } from '@self.id/web'
import { useAuth } from '../../../hooks/context'

export function CyclimateWallet () {
  const auth = useAuth()
  const [loading, setLoading] = React.useState(false)
  const [connection, connect, disconnect] = useViewerConnection();

  const connectWallet = async () => {
    if (!window.ethereum?.isMetaMask) {
      alert("Metamask wasn't detected, please install metamask extension")
      return
    }

    if (auth.user.walletAddress === 'Connect wallet') {
      setLoading(true)
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum)
      await web3Provider.send('eth_requestAccounts', [])
      const accounts = await web3Provider.send('eth_requestAccounts', [])

      const web3Signer = web3Provider.getSigner()
      const chainId = await web3Signer.getChainId()
      if (chainId !== 80001) {
        auth.logout()
        alert('Change your network to Mumbai testnet!')
        setLoading(false)
        return
      }
      connect(await auth.connectToSelfID);
      auth.login({ walletAddress: accounts[0] })

      setLoading(false)
    } else {
      auth.logout()
      setLoading(false)
    }
  }

  return (
    <button className='button-wallet' onClick={connectWallet}>
      {loading
        ? 'loading...'
        : auth.user.walletAddress !== 'Connect wallet'
          ? '...' + String(auth.user.walletAddress).slice(36)
          : 'Connect wallet'}
    </button>
  )
}
