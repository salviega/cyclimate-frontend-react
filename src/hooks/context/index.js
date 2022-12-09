import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthContext } from './useAuthContext'
import { useContractContext } from './useContractContext'
import { useDashboardInfoContext } from './useDashboardInfoContext'

const CyclimateContext = React.createContext()

export function CyclimateProvider ({ children }) {
  const { user, login, logout } = useAuthContext()
  const {
    web3Provider,
    web3Signer,
    feedContract,
    cycliContract,
    marketPlaceContract,
    benefitsContract,
    paymentGatewayContract,
    redeemDataContract
  } = useContractContext()

  const { _getChainId, _getAccounts, _getBalance, _connectToSelfID } = useDashboardInfoContext()

  const getChainId = _getChainId(web3Provider)
  const getAccounts = _getAccounts(web3Signer)
  const getBalance = _getBalance(web3Provider)
  const connectToSelfID = _connectToSelfID(window.ethereum, web3Signer)


  return (
    <CyclimateContext.Provider
      value={{
        user,
        login,
        logout,
        web3Provider,
        web3Signer,
        feedContract,
        cycliContract,
        marketPlaceContract,
        benefitsContract,
        paymentGatewayContract,
        redeemDataContract,
        getChainId,
        getAccounts,
        getBalance,
        connectToSelfID
      }}
    >
      {children}
    </CyclimateContext.Provider>
  )
}

export function AuthRoute (props) {
  const auth = useAuth()

  if (!auth.user.walletAddress === 'Connect wallet') {
    return <Navigate to='/' />
  }

  return props.children
}

export function useAuth () {
  const { user, login, logout, connectToSelfID } = React.useContext(CyclimateContext)
  const auth = { user, login, logout, connectToSelfID }
  return auth
}

export function useContracts () {
  const {
    web3Provider,
    web3Signer,
    feedContract,
    cycliContract,
    marketPlaceContract,
    benefitsContract,
    paymentGatewayContract,
    redeemDataContract
  } = React.useContext(CyclimateContext)
  const contracts = {
    web3Provider,
    web3Signer,
    feedContract,
    cycliContract,
    marketPlaceContract,
    benefitsContract,
    paymentGatewayContract,
    redeemDataContract
  }
  return contracts
}

export function useDashboardInfo () {
  const { getChainId, getAccounts, getBalance } =
    React.useContext(CyclimateContext)
  const dashboardInfo = {
    getChainId,
    getAccounts,
    getBalance
  }
  return dashboardInfo
}
