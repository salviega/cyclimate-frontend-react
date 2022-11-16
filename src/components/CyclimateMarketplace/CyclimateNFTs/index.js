import "./CyclimateNFTs.scss";
import React from "react";

export function CyclimateNFTs({
  children,
  contracts,
  currency,
  onLoading,
  onSincronizedItems,
  setItem,
  setOpenModal,
}) {
  return (
    <div className="nfts">
      <div className="nfts-container">
        {React.Children.toArray(children).map((child) =>
          React.cloneElement(child, {
            contracts,
            onLoading,
            onSincronizedItems,
            setItem,
            setOpenModal,
          })
        )}
      </div>
    </div>
  );
}
