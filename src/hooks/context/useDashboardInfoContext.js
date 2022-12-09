import { ethers } from 'ethers'
import { EthereumAuthProvider } from '@self.id/web'


export function useDashboardInfoContext () {
  const _getChainId = async (web3Provider) => {
    if (web3Provider) {
      const detailsNetwork = await web3Provider.getNetwork()
      return detailsNetwork.chainId
    }
  }

  const _getAccounts = async (web3Signer) => {
    if (web3Signer) {
      return await web3Signer.getAddress()
    }
  }

  const _getBalance = async (web3Provider) => {
    if (web3Provider) {
      const web3Signer = web3Provider.getSigner()
      const address = await web3Signer.getAddress()
      return ethers.utils.formatEther(
        await web3Provider.getBalance(address) // eth
      )
    }
  }

  const _connectToSelfID = async (web3Provider, web3Signer) => {
    return new EthereumAuthProvider(web3Provider, await web3Signer.getAddress());
  }



  return {
    _getChainId,
    _getAccounts,
    _getBalance,
    _connectToSelfID
  }
}
