import "./CyclimateFaucet.scss";
import logo from "../../assets/images/logo-Cyclimate.png";
import { ethers } from "ethers";
import React, { useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth, useContracts } from "../../hooks/context";
import { CyclimateLoading } from "../../shared/CyclimateLoading";

export function CyclimateFaucet() {
  const auth = useAuth();
  const contracts = useContracts();
  const address = useRef();
  const [loading, setLoading] = useState(false);
  const amount = ethers.utils.parseEther("10", "ether");

  const onError = (error) => {
    alert("Hubo un error, revisa la consola");
    setLoading(false);
    console.error(error);
  };

  const onSafeMint = async (event) => {
    event.preventDefault();

    const info = {
      address: address.current.value,
      amount,
    };

    try {
      setLoading(true);

      const response = await contracts.cycliContract.authorizeOperator(
        contracts.marketPlaceContract.address
      );

      contracts.web3Provider
        .waitForTransaction(response.hash)
        .then(async (_response) => {
          const response2 = await contracts.cycliContract.safeMint(
            info.address,
            info.amount
          );
          contracts.web3Provider
            .waitForTransaction(response2.hash)
            .then(async (_response2) => {
              setTimeout(() => {
                setLoading(false);
                alert("Fueron añadidos 10 Cyclimate a su billetera");
              }, 3000);
            })
            .catch((error) => {
              onError(error);
            });
        })
        .catch((error) => {
          onError(error);
        });
    } catch (error) {
      onError();
    }
  };

  if (auth.user.walletAddress === "Connect wallet") {
    return <Navigate to="/" />;
  }

  return (
    <div className="faucet">
      <p className="faucet__title">Faucet</p>
      <p className="faucet__description">Remove all the Cyclimate you want.</p>
      {loading ? (
        <div className="faucet__loading">
          <CyclimateLoading />
        </div>
      ) : (
        <form className="faucet-form" onSubmit={onSafeMint}>
          <span>
            <p className="faucet-form__subtitle">Wallet address</p>
            <input
              className="faucet-form__add"
              ref={address}
              type="text"
              required
            />
          </span>
          <div className="faucet-form-container">
            <figure>
              <img src={logo} alt="logo" />
            </figure>
            <button className="faucet-form__submit">Redeen 10 CCL</button>
          </div>
        </form>
      )}
    </div>
  );
}
