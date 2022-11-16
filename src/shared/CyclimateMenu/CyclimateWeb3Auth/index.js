import "./CyclimateWeb3Auth.scss";
import React from "react";
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from "@web3auth/base";
import { Web3Auth } from "@web3auth/modal";
import { ethersRPC } from "./ethersRPC";

const clientId =
  "BIUsf57Ux9ezViHnb5VEAnK2nX6nVRv2Kw-jom21XqvBqr22cDQBi3MdsOzHnMtzRSaoybCUhhGf4YMc0llIQpk"; // get from https://dashboard.web3auth.io

export function CyclimateWeb3Auth() {
  const [web3auth, setWeb3auth] = React.useState(null);
  const [provider, setProvider] = React.useState(null);
  const {
    getChainId: _getChainId,
    getAccounts: _getAccounts,
    getBalance: _getBalance,
  } = ethersRPC();

  React.useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3Auth({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0xA869",
            rpcTarget: "https://api.avax-test.network/ext/bc/C/rpc",
            displayName: "Avalanche FUJI C-Chain",
            blockExplorer: "testnet.snowtrace.io",
            ticker: "AVAX",
            tickerName: "AVAX",
          },
          uiConfig: {
            appLogo: "https://images.web3auth.io/web3auth-logo-w.svg",
            theme: "dark",
            loginMethodsOrder: [
              "google",
              "facebook",
              "twitter",
              "email_passwordless",
            ],
            defaultLanguage: "en",
          },
        });

        await web3auth.initModal({
          modalConfig: {
            [WALLET_ADAPTERS.OPENLOGIN]: {
              label: "openlogin",
              loginMethods: {
                reddit: {
                  showOnModal: false,
                },
                github: {
                  showOnModal: false,
                },
                linkedin: {
                  showOnModal: false,
                },
                twitch: {
                  showOnModal: false,
                },
                line: {
                  showOnModal: false,
                },
                kakao: {
                  showOnModal: false,
                },
                weibo: {
                  showOnModal: false,
                },
                wechat: {
                  showOnModal: false,
                },
              },
              showOnModal: true,
            },
          },
        });

        setWeb3auth(web3auth);

        if (web3auth.provider) {
          setProvider(web3auth.provider);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    console.log(user);
  };

  const logout = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
  };

  const getChainId = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const chainId = await _getChainId(provider);
    console.log(chainId);
  };
  const getAccounts = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const address = await _getAccounts(provider);
    console.log(address);
  };

  const getBalance = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const balance = await _getBalance(provider);
    console.log(balance);
  };

  // const sendTransaction = async () => {
  //   if (!provider) {
  //     console.log("provider not initialized yet");
  //     return;
  //   }
  //   const rpc = new RPC(provider);
  //   const receipt = await rpc.sendTransaction();
  //   console.log(receipt);
  // };

  // const signMessage = async () => {
  //   if (!provider) {
  //     console.log("provider not initialized yet");
  //     return;
  //   }
  //   const rpc = new RPC(provider);
  //   const signedMessage = await rpc.signMessage();
  //   console.log(signedMessage);
  // };

  // const getPrivateKey = async () => {
  //   if (!provider) {
  //     console.log("provider not initialized yet");
  //     return;
  //   }
  //   const rpc = new RPC(provider);
  //   const privateKey = await rpc.getPrivateKey();
  //   console.log(privateKey);
  // };
  const loggedInView = (
    <>
      <button onClick={getUserInfo} className="card">
        Get User Info
      </button>
      <button onClick={getChainId} className="card">
        Get Chain ID
      </button>
      <button onClick={getAccounts} className="card">
        Get Accounts
      </button>
      <button onClick={getBalance} className="card">
        Get Balance
      </button>
      {/* <button onClick={sendTransaction} className="card">
        Send Transaction
      </button>
      <button onClick={signMessage} className="card">
        Sign Message
      </button>
      <button onClick={getPrivateKey} className="card">
        Get Private Key
      </button> */}
      <button onClick={logout} className="card">
        Log Out
      </button>

      <div id="console" style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }} />
      </div>
    </>
  );

  const unloggedInView = (
    <button onClick={login} className="card">
      Login
    </button>
  );

  return (
    <div className="container">
      <div className="grid">{provider ? loggedInView : unloggedInView}</div>
    </div>
  );
}
