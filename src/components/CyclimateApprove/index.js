import React from 'react'
import { ethers } from 'ethers'
import { useNavigate, useParams } from 'react-router-dom'

import benefitContractAbi from '../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/BenefitContract.sol/BenefitContract.json'
import { useContracts } from '../../hooks/context'

import './CyclimateApprove.scss'

export function CyclimateApprove ({ getItem }) {
  const [contract, setContract] = React.useState({})
  const [customer, setCustomer] = React.useState({})

  const contracts = useContracts()
  // const location = useLocation();
  const { slug } = useParams()
  const navigate = useNavigate()

  const data = async (param) => {
    try {
      const splitedParam = param.split('==')
      const firebaseId = splitedParam[0]
      const tokenId = splitedParam[1]
      console.log(tokenId)
      const item = await getItem(firebaseId)
      const benefitContract = new ethers.Contract(
        item.benefitContractAddress,
        benefitContractAbi.abi,
        contracts.web3Signer
      )
      const token = await benefitContract.tokens(tokenId)
      console.log(tokenId)
      const managerAddress = await benefitContract.isManagerOrAdmin()
      console.log(
        'managerAddress: ' + managerAddress + ' ' + 'redeem: ' + token[3]
      )
      if (!managerAddress || token[3]) {
        return navigate('/')
      }
      setCustomer({ address: await benefitContract.ownerOf(tokenId), tokenId })
      setContract(benefitContract)
    } catch (error) {
      console.error(error)
    }
  }

  React.useEffect(() => {
    data(slug)
  }, [])

  const onRedeemBenefit = async () => {
    console.log('customer address', customer.address)
    console.log('tokenId', customer.tokenId)
    const response = await contract.redeemBenefit(
      customer.address,
      parseInt(customer.tokenId),
      {
        gasLimit: 2500000
      }
    )
    contracts.web3Provider
      .waitForTransaction(response.hash)
      .then(async (_response) => {
        window.alert('Was burned the benefit')
        navigate('/')
      })
  }

  return (
    <div className='approve'>
      <button className='details-buttons__redimir' onClick={onRedeemBenefit}>
        Burn
      </button>
    </div>
  )
}
