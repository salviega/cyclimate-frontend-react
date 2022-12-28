import React from 'react'
import { ethers } from 'ethers'

import { useAuth } from '../../../hooks/context'

import './CyclimateWallet.scss'

export function CyclimateWallet() {
	const [loading, setLoading] = React.useState(false)
	const auth = useAuth()

	const connectWallet = async () => {
		if (!window.ethereum?.isMetaMask) {
			window.alert(
				"Metamask wasn't detected, please install metamask extension"
			)
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
				window.alert('Change your network to Mumbai testnet!')
				setLoading(false)
				return
			}
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
