import { ethers } from 'ethers'

import addresses from '../../blockchain/environment/contract-address.json'
import benefitsContractAbi from '../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/BenefitsContract.sol/BenefitsContract.json'
import cycliContractAbi from '../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/CycliContract.sol/CycliContract.json'
import feedContractAbi from '../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/FeedContract.sol/FeedContract.json'
import marketPlaceContractAbi from '../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/MarketplaceContract.sol/MarketplaceContract.json'
import paymentgatewayContractAbi from '../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/PaymentGatewayContract.sol/PaymentGatewayContract.json'
import reedemDataContractAbi from '../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/ReedemDataContract.sol/RedeemDataContract.json'
const feedContractAddress = addresses[0].feedcontract
const cycliContractAddress = addresses[1].cyclicontract
const marketPlaceContractAddress = addresses[2].marketplacecontract
const benefitsContractAddress = addresses[3].benefitscontract
const paymenGatewayContractAddress = addresses[4].paymentgatewaycontract
const redeemDataContractAddress = addresses[5].redeemdatacontract

export function useContractContext () {
  const provider = new ethers.providers.JsonRpcProvider(
    'https://rpc.ankr.com/polygon_mumbai'
  )

  const web3Provider = new ethers.providers.Web3Provider(window.ethereum)
  const web3Signer = web3Provider.getSigner()

  const feedContract = generateContract(
    feedContractAddress,
    feedContractAbi.abi,
    provider
  )
  const cycliContract = generateContract(
    cycliContractAddress,
    cycliContractAbi.abi,
    web3Signer
  )
  const marketPlaceContract = generateContract(
    marketPlaceContractAddress,
    marketPlaceContractAbi.abi,
    web3Signer
  )
  const benefitsContract = generateContract(
    benefitsContractAddress,
    benefitsContractAbi.abi,
    web3Signer
  )

  const paymentGatewayContract = generateContract(
    paymenGatewayContractAddress,
    paymentgatewayContractAbi.abi,
    web3Signer
  )

  const redeemDataContract = generateContract(
    redeemDataContractAddress,
    reedemDataContractAbi.abi,
    web3Signer
  )

  return {
    web3Provider,
    web3Signer,
    feedContract,
    cycliContract,
    marketPlaceContract,
    benefitsContract,
    paymentGatewayContract,
    redeemDataContract
  }
}

function generateContract (address, abi, provider) {
  const contract = new ethers.Contract(address, abi, provider)
  return contract
}
