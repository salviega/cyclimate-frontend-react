import "./CyclimateNFT.scss";
import logo from "./../../../assets/images/logo-Cyclimate.png";
import React from "react";

export function CyclimateNFT({
  key,
  item,
  contracts,
  onLoading,
  onSincronizedItems,
  setItem,
  setOpenModal,
}) {
  const onBuy = async () => {
    try {
      onLoading();
      const response = await contracts.cycliContract.authorizeOperator(
        contracts.marketPlaceContract.address
      );

      contracts.web3Provider
        .waitForTransaction(response.hash)
        .then(async (_response) => {
          const response2 = await contracts.marketPlaceContract.buyItem(
            contracts.cycliContract.address,
            item.itemId,
            { gasLimit: 250000 }
          );
          contracts.web3Provider
            .waitForTransaction(response2.hash)
            .then((_response2) => {
              setTimeout(() => {
                onSincronizedItems();
                alert("Compra exitosa");
              }, 3000);
            })
            .catch((error) => {
              onSincronizedItems();
              alert("Hubo un error, revisa la consola");
              console.error(error);
            });
        })
        .catch((error) => {
          onSincronizedItems();
          alert("Hubo un error, revisa la consola");
          console.error(error);
        });
    } catch (error) {
      onSincronizedItems();
      alert("Hubo un error, revisa la consola");
      console.error(error);
    }
  };

  const onShowDetail = (item) => {
    setItem(item);
    setOpenModal(true);
  };

  return (
    <div className="nft">
      <figure onClick={() => onShowDetail(item)}>
        <img src={item.image} alt="logo" />
      </figure>
      <div className="nft-description">
        <p className="nft-description__title">{item.name}</p>
        <div className="nft-description-container">
          <figure onClick={() => onShowDetail(item)}>
            <img alt="logo" src={logo} />
          </figure>
          <p className="nft-description-container__price">
            {parseInt(item.price) / 1000000000000000000}
          </p>
        </div>
      </div>
      <button className="nft-description__show" onClick={onBuy}>
        Comprar
      </button>
    </div>
  );
}
