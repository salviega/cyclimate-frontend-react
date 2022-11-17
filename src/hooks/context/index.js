import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "./useAuthContext";
import { useContractContext } from "./useContractContext";
import { useDashboardInformationContext } from "./useDashboardInfoContext";

const CyclimateContext = React.createContext();

export function CyclimateProvider({ children }) {
  const {
    user,
    login,
    logout,
    getWeb3Auth,
    web3Auth,
    web3Provider,
    web3Signer,
  } = useAuthContext();
  const {
    feedContract,
    _cycliContract,
    _marketPlaceContract,
    _benefitsContract,
    // _paymentGatewayContract,
  } = useContractContext();
  const {
    _getUserInfo,
    _getChainId,
    _getAccounts,
    _getBalance,
    _getPrivateKey,
  } = useDashboardInformationContext();

  const cycliContract = _cycliContract(web3Signer);
  const marketPlaceContract = _marketPlaceContract(web3Signer);
  const benefitsContract = _benefitsContract(web3Signer);
  // // const paymentGatewayContract = _paymentGatewayContract(web3Signer);

  const getUserInfo = _getUserInfo(web3Auth);
  const getChainId = _getChainId(web3Provider);
  const getAccounts = _getAccounts(web3Signer);
  const getBalance = _getBalance(web3Provider);
  const getPrivateKey = _getPrivateKey(web3Provider);

  return (
    <CyclimateContext.Provider
      value={{
        user,
        login,
        logout,
        getWeb3Auth,
        web3Provider,
        web3Signer,
        feedContract,
        cycliContract,
        marketPlaceContract,
        benefitsContract,
        // paymentGatewayContract,
        getUserInfo,
        getChainId,
        getAccounts,
        getBalance,
        getPrivateKey,
      }}
    >
      {children}
    </CyclimateContext.Provider>
  );
}

export function AuthRoute(props) {
  const auth = useAuth();

  if (!auth.user.walletAddress === "Connect wallet") {
    return <Navigate to="/" />;
  }

  return props.children;
}

export function useAuth() {
  const { user, login, logout, getWeb3Auth } =
    React.useContext(CyclimateContext);
  const auth = { user, login, logout, getWeb3Auth };
  return auth;
}

export function useContracts() {
  const {
    web3Provider,
    web3Signer,
    feedContract,
    cosmoContract,
    marketPlaceContract,
    benefitsContract,
    // paymentGatewayContract,
  } = React.useContext(CyclimateContext);
  const contracts = {
    web3Provider,
    web3Signer,
    feedContract,
    cosmoContract,
    marketPlaceContract,
    benefitsContract,
    // paymentGatewayContract,
  };
  return contracts;
}

export function useDashboardInfo() {
  const { getUserInfo, getChainId, getAccounts, getBalance, getPrivateKey } =
    React.useContext(CyclimateContext);
  const dashboardInfo = {
    getUserInfo,
    getChainId,
    getAccounts,
    getBalance,
    getPrivateKey,
  };
  return dashboardInfo;
}
