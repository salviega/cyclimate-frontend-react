import "./CyclimateGateway.scss";
import { ethers } from "ethers";
import React, { useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth, useContracts } from "../../hooks/context";
import { CyclimateLoading } from "../../shared/CyclimateLoading";

export function CyclimateGateway() {
  const auth = useAuth();
  const contracts = useContracts();
  let amount = useRef();
  const email = useRef();
  const [loading, setLoading] = useState(false);

  const onError = (error) => {
    alert("Hubo un error, revisa la consola");
    setLoading(false);
    console.error(error);
  };

  const onRequestPayOut = async (event) => {
    event.preventDefault();
    amount = ethers.utils.parseEther(amount.current.value, "ether");

    const info = {
      email: email.current.value,
      amount: parseInt(amount) * 10 ** 18,
    };

    try {
      setLoading(true);
      const response = await contracts.cycliContract.authorizeOperator(
        contracts.paymentGatewayContract.address
      );

      contracts.web3Provider
        .waitForTransaction(response.hash)
        .then(async (_response) => {
          const response2 =
            await contracts.paymentGatewayContract.requestPayOut(
              "0x40193c8518BB267228Fc409a613bDbD8eC5a97b3", // Oracule
              "5374949059814605a400982b797d84d5", // job ID
              info.email,
              amount,
              info.amount,
              { gasLimit: 200000 }
            );
          contracts.web3Provider
            .waitForTransaction(response2.hash)
            .then(async (_response2) => {
              setTimeout(() => {
                alert("Was changed your Cycli to dollars");
                setLoading(false);
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
      onError(error);
    }
  };

  if (auth.user.walletAddress === "Connect wallet") {
    return <Navigate to="/" />;
  }

  return (
    <div className="faucet">
      <p className="faucet__title">Payment gateway</p>
      <p className="faucet__description">
        Convert your Cycli to dollars, it will arrive to your Paypal account
      </p>
      {loading ? (
        <div className="faucet__loading">
          <CyclimateLoading />
        </div>
      ) : (
        <form className="faucet-form" onSubmit={onRequestPayOut}>
          <span>
            <p className="faucet-form__subtitle">Email</p>

            <input
              className="faucet-form__add"
              ref={email}
              type="email"
              required
            />
          </span>
          <span>
            <p className="faucet-form__subtitle">Cycli token</p>
            <input className="faucet-form__add" ref={amount} required min="1" />
          </span>
          <div className="faucet-form-container">
            <button className="faucet-form__submit">Redeem</button>
          </div>
        </form>
      )}
    </div>
  );
}
