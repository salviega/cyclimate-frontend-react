import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ethers } from 'ethers'
import { Navigate } from 'react-router-dom'

import { useAuth, useContracts, useDashboardInfo } from '../../hooks/context'
import { pushProtocolRestApi } from '../../middleware/pushProtocolRestApi'
import { CyclimateLoading } from '../../shared/CyclimateLoading'
import { CyclimateModal } from '../../shared/CyclimateModal'

import { CyclimateDashboardNFT } from './CyclimateDashboardNFT'
import { CyclimateDashboardNFTDetails } from './CyclimateDashboardNFTDetails'
import { CyclimateDashboardNFTs } from './CyclimateDashboardNFTs'
import { CyclimateLineGraph } from './CyclimateGraph'
import { CyclimateNotifications } from './CyclimateNotifications'
import { CyclimateTransfer } from './CyclimateTransfer'

import './CyclimateDashboard.scss'

export function CyclimateDashboard () {
  const auth = useAuth()
  const contracts = useContracts()
  const dashboardInfo = useDashboardInfo()
  const [loading, setLoading] = useState(true)
  const [sincronized, setSincronized] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [graphInformation, setGraphInformation] = useState([])
  const [NFTs, setNFTs] = useState([])
  const [item, setItem] = useState({})
  const [counter, setCounter] = useState(0)
  const [openModal, setOpenModal] = useState(false)
  const [openModalTransfer, setOpenModalTransfer] = useState(false)
  const initialState = {
    name: '',
    email: '',
    chainId: '',
    wallet: '',
    balance: '',
    Cyclimate: '',
    privateKey: ''
  }
  const [userInformation, setUserInformation] = useState(initialState)
  const { getNotifications } = pushProtocolRestApi()

  const onRedeemTokens = async () => {
    try {
      setLoading(true)
      const response = await contracts.redeemDataContract.requestPayOut(
        '29b34c07e3824e8f90639200b5d63781', // jobID
        { gasLimit: 250000 }
      )
      contracts.web3Provider
        .waitForTransaction(response.hash)
        .then(async (_response) => {
          window.alert('Your data was changes for cycli')
          setSincronized(false)
        })
        .catch((error) => {
          window.alert('Hubo un error revisa la consola')
          console.log(error)
          setSincronized(false)
        })
    } catch (error) {
      console.error(error)
      window.alert('hubo un error revisa la consola')
      setSincronized(false)
    }
  }

  const getPackagesData = async () => {
    try {
      const response = await axios.get(
        'https://cyclimate-backend-node.herokuapp.com/counter'
      )
      const data = response.data
      setCounter(data.data)
    } catch (error) {
      console.error(error)
    }
  }

  const getGraphInfo = async () => {
    try {
      const response = await axios.get(
        'https://cyclimate-backend-node.herokuapp.com/lastest'
      )
      const data = response.data
      const refactoredData = data.map((datum) => {
        return {
          x: datum.DATE_C,
          y: datum.CO2
        }
      })
      setGraphInformation(refactoredData)
    } catch (error) {
      console.error(error)
    }
  }

  const getNFTInfo = async () => {
    try {
      const response = await axios.get(
        'https://cyclimate-backend-node.herokuapp.com/allNFTs',
        {
          params: {
            address: contracts.marketPlaceContract.address,
            wallet: auth.user.walletAddress
          }
        }
      )

      return await response.data
    } catch (error) {
      console.error(error)
    }
  }

  const perfilInformation = () => {
    if (userInformation.name) {
      return (
        <>
          <div className='dashboard-personal-data'>
            <div className='dashboard-personal-data-info'>
              <h1>My information</h1>

              <p>Name: {userInformation.name}</p>
              <p>Email: {userInformation.email}</p>
              <p>ChainId: {userInformation.chainId}</p>
              <p>Wallet: {userInformation.wallet}</p>
              <p>Balance: {userInformation.balance}</p>
              <p>Cyclimate: {userInformation.Cyclimate}</p>
              <p>Private key: {userInformation.privateKey}</p>
            </div>
          </div>
        </>
      )
    }
    return (
      <>
        <div className='dashboard-personal-data'>
          <div className='dashboard-personal-data-info'>
            <h1>My information</h1>
            <p>Wallet: {userInformation.wallet}</p>
            <p>Balance: {userInformation.balance}</p>
            <p>Cycli: {userInformation.Cyclimate}</p>
            <p>ChainId: {userInformation.chainId}</p>
          </div>
        </div>
      </>
    )
  }

  useEffect(() => {
    getNotifications(auth.user.walletAddress)
      .then(async (response) => {
        let Cyclimate = await contracts.cycliContract.balanceOf(
          auth.user.walletAddress
        )
        Cyclimate = ethers.utils.formatEther(Cyclimate)
        // const userInfo = await dashboardInfo.getUserInfo;
        let balance = await dashboardInfo.getBalance
        balance = parseFloat(balance)
        const user = {
          // name: userInfo.name || null,
          // email: userInfo.email || null,
          chainId: await dashboardInfo.getChainId,
          wallet: await dashboardInfo.getAccounts,
          balance: balance.toFixed(4),
          Cyclimate,
          privateKey: (await dashboardInfo.getPrivateKey) || null
        }
        // eslint-disable-next-line array-callback-return
        Object.keys(user).map((attribute) => {
          if (user[attribute] === null) {
            delete user[attribute]
          }
        })
        getPackagesData()
        setNFTs(await getNFTInfo())
        getGraphInfo()
        setUserInformation(user)
        setNotifications(response)
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setLoading(false)
      })
  }, [sincronized])

  if (auth.user.walletAddress === 'Connect wallet') {
    return <Navigate to='/' />
  }

  return (
    <>
      {loading
        ? (
          <div className='main__loading'>
            <CyclimateLoading />
          </div>
          )
        : (
          <div className='dashboard'>
            <div className='dashboard-personal'>
              {perfilInformation()}
              <div className='dashboard-notifications'>
                <h1 className='dashboard-notifications__title'>Notifications</h1>
                <CyclimateNotifications notifications={notifications} />
              </div>
            </div>
            <div className='dashboard-sensor'>
              <h2>
                Redeem {counter} Cyclimate for the total of your collected data
              </h2>
              <div className='dashboard-sensor-redeem'>
                {counter !== 0 && (
                  <>
                    <CyclimateLineGraph graphInformation={graphInformation} />
                    <button onClick={onRedeemTokens}>Redeem</button>
                  </>
                )}
              </div>
            </div>
            <h2 className='dashboard-notifications__title'>My NFTs</h2>

            <CyclimateDashboardNFTs
              contracts={contracts}
              setLoading={setLoading}
              setSincronized={setSincronized}
              setItem={setItem}
              setOpenModal={setOpenModal}
              setOpenModalTransfer={setOpenModalTransfer}
            >
              {NFTs
                ? NFTs.map((item, index) => (
                  <CyclimateDashboardNFT key={index} item={item} />
                ))
                : "There don't NFTs"}
            </CyclimateDashboardNFTs>
          </div>
          )}
      {openModal && (
        <CyclimateModal>
          <CyclimateDashboardNFTDetails
            item={item}
            setLoading={setLoading}
            setSincronized={setSincronized}
            setOpenModal={setOpenModal}
            setOpenModalTransfer={setOpenModalTransfer}
          />
        </CyclimateModal>
      )}
      {openModalTransfer && (
        <CyclimateModal>
          <CyclimateTransfer
            item={item}
            setLoading={setLoading}
            setSincronized={setSincronized}
            setOpenModal={setOpenModal}
            setOpenModalTransfer={setOpenModalTransfer}
          />
        </CyclimateModal>
      )}
    </>
  )
}
