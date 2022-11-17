import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from "@web3auth/base";
import { Web3Auth } from "@web3auth/modal";
import { ethers } from "ethers";
import { useState } from "react";

const clientId =
  "BIUsf57Ux9ezViHnb5VEAnK2nX6nVRv2Kw-jom21XqvBqr22cDQBi3MdsOzHnMtzRSaoybCUhhGf4YMc0llIQpk";

const adminWallets = [
  "0x70a792ad975aa0977c6e9d55a14f5f2228bbc685",
  "0xa3542355604cFD6531AAf020DDAB3bDFFf4d1809",
  "0x91DC541109033C060779Aad8a578E34223e694cb",
  "0x3fCc7e9dffC0605a9bF3bB07254c40F6d15f843c",
];

export function useAuthContext() {
  const initialState = JSON.parse(localStorage.getItem("wallet")) || {
    walletAddress: "Connect wallet",
  };
  const [user, setUser] = useState(initialState);
  const [web3Auth, setWeb3Auth] = useState(null);
  const [web3Provider, setWeb3Provider] = useState(null);
  const [web3Signer, setWeb3Signer] = useState(null);

  const getWeb3Auth = async (web3auth) => {
    setWeb3Auth(web3auth);
    const web3authProvider = await web3auth.connect();

    const ethersProvider = new ethers.providers.Web3Provider(web3authProvider);
    setWeb3Provider(ethersProvider);
    const ethersSigner = ethersProvider.getSigner();
    setWeb3Signer(ethersSigner);
  };

  const login = async () => {
    try {
      const web3auth = new Web3Auth({
        clientId,
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: "0xA869", // 43113 - decimal
          rpcTarget: "https://api.avax-test.network/ext/bc/C/rpc", // This is the public RPC we have added, please pass on your own endpoint while creating an app
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

      if (!web3auth) {
        console.log("web3auth not initialized yet");
        return;
      }

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

      setWeb3Auth(web3auth);
      const web3authProvider = await web3auth.connect();
      const ethersProvider = new ethers.providers.Web3Provider(
        web3authProvider
      );
      setWeb3Provider(ethersProvider);

      const ethersSigner = ethersProvider.getSigner();
      setWeb3Signer(ethersSigner);

      let walletAddress = await ethersSigner.getAddress();
      walletAddress = walletAddress.toLowerCase();
      let isAdmin = false;
      let adminWallet = adminWallets.find(
        (wallet) => wallet.toLowerCase() === walletAddress
      );

      try {
        adminWallet = adminWallet.toLowerCase();
        if (adminWallet.toLowerCase() === walletAddress) isAdmin = true;
        const stringifiedUser = JSON.stringify({ walletAddress, isAdmin });
        localStorage.setItem("wallet", stringifiedUser);
        setUser({ walletAddress, isAdmin });
      } catch {
        const stringifiedUser = JSON.stringify({ walletAddress, isAdmin });
        localStorage.setItem("wallet", stringifiedUser);
        setUser({ walletAddress, isAdmin });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    if (!web3Auth) {
      console.log("web3auth not initialized yet");
      return;
    }

    await web3Auth.logout();
    setWeb3Provider(null);
    setWeb3Signer(null);
    localStorage.clear();
    window.location.reload();
  };

  return {
    user,
    login,
    logout,
    getWeb3Auth,
    web3Auth,
    web3Provider,
    web3Signer,
  };
}
