import "./CyclimateMarketplace.scss";
import { ethers } from "ethers";
import React, { useReducer, useState } from "react";
import { Navigate } from "react-router-dom";
import { reducerMarketplace } from "../../hooks/reducer";
import { useAuth, useContracts } from "../../hooks/context";
import { CyclimateNFTs } from "./CyclimateNFTs";
import { CyclimateNFT } from "./CyclimateNFT";
import { CyclimateNFTDetails } from "./CyclimateNFTDetails";
import { CyclimateSupplyNFTs } from "./CyclimateSupplyNFTs";
import { CyclimateNFTsResume } from "./CyclimateNFTsResume";
import { CyclimatePurchasedNFTDetails } from "./CyclimatePurchasedNFTDetails";
import { CyclimateLoading } from "../../shared/CyclimateLoading";
import { CyclimateModal } from "../../shared/CyclimateModal";
import { getDataMarketPlaceSubGraph } from "../../middleware/getDataMarketPlaceSubGraph.js";

export function CyclimateMarketplace() {
  const auth = useAuth();
  const contracts = useContracts();
  const { initialValue, reducerObject, actionTypes } = reducerMarketplace();
  const { getItemsForSale, getPurchasedItems } = getDataMarketPlaceSubGraph();
  const [state, dispatch] = useReducer(reducerObject, initialValue);
  const [item, setItem] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [openModalSummary, setOpenModalSummary] = useState(false);
  const {
    loading,
    error,
    sincronizedItems,
    itemsSale,
    purchasedItems,
    currency,
    tokenIdCounter,
  } = state;

  // ACTIONS CREATORS
  const onError = (error) =>
    dispatch({ type: actionTypes.error, payload: error });
  const onLoading = () => dispatch({ type: actionTypes.loading });
  const onSincronizedItems = () => dispatch({ type: actionTypes.sincronize });
  const onSuccess = ({
    refactoredSaleItems,
    refactoredPurchasedItems,
    currency,
    tokenIdCounter,
  }) =>
    dispatch({
      type: actionTypes.success,
      payload: {
        refactoredSaleItems,
        refactoredPurchasedItems,
        currency,
        tokenIdCounter,
      },
    });

  const fetchData = async () => {
    try {
      let currency = await contracts.feedContract.getLatestPrice();
      currency = ethers.BigNumber.from(currency).toNumber();
      let tokenIdCounter = await contracts.marketPlaceContract.tokenIdCounter();
      tokenIdCounter = ethers.BigNumber.from(tokenIdCounter).toNumber();

      const filteredSaleItems = await filterSaleForItems(
        await getItemsForSale(),
        await getPurchasedItems()
      );
      const refactoredSaleItems = await refactorItems(filteredSaleItems);
      const refactoredPurchasedItems = await refactorItems(
        await getPurchasedItems()
      );
      onSuccess({
        refactoredSaleItems,
        refactoredPurchasedItems,
        currency,
        tokenIdCounter,
      });
    } catch (error) {
      onError(error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [sincronizedItems]);

  if (auth.user.walletAddress === "Connect wallet") {
    return <Navigate to="/" />;
  }

  return (
    <div className="marketplace">
      <p className="marketplace__title">A life full of art</p>
      <p className="marketplace__description">
        We curate a collection of exclusive digital art pieces for our allies.
      </p>
      {!loading /*&& auth.user.isAdmin */ && (
        <div className="marketplace-admin">
          <CyclimateSupplyNFTs
            contracts={contracts}
            tokenIdCounter={tokenIdCounter}
            onLoading={onLoading}
            onSincronizedItems={onSincronizedItems}
          />
        </div>
      )}
      {loading ? (
        <div className="marketplace__loading">
          <CyclimateLoading />
        </div>
      ) : (
        <>
          <CyclimateNFTs
            contracts={contracts}
            onLoading={onLoading}
            onSincronizedItems={onSincronizedItems}
            setItem={setItem}
            setOpenModal={setOpenModal}
          >
            {itemsSale
              ? itemsSale.map((item, index) => (
                  <CyclimateNFT key={index} item={item} />
                ))
              : "There don't NFTs in sale"}
          </CyclimateNFTs>
          <CyclimateNFTsResume
            currency={currency}
            purchasedItems={purchasedItems}
            setItem={setItem}
            setOpenModalSummary={setOpenModalSummary}
          />
        </>
      )}
      {openModal && (
        <CyclimateModal>
          <CyclimateNFTDetails
            currency={currency}
            item={item}
            onLoading={onLoading}
            onSincronizedItems={onSincronizedItems}
            setOpenModal={setOpenModal}
          />
        </CyclimateModal>
      )}
      {openModalSummary && (
        <CyclimateModal>
          <CyclimatePurchasedNFTDetails
            currency={currency}
            item={item}
            setOpenModalSummary={setOpenModalSummary}
          />
        </CyclimateModal>
      )}
    </div>
  );
}

async function filterSaleForItems(itemsForSale, purchasedItems) {
  const boughtItems = [];
  itemsForSale.forEach((itemForSale) => {
    purchasedItems.forEach((purchasedItem) => {
      if (itemForSale.itemId === purchasedItem.itemId) {
        boughtItems.push(itemForSale);
      }
    });
  });

  const filteredItems = await removeDuplicates([
    ...itemsForSale,
    ...boughtItems,
  ]);
  return filteredItems;
}

async function removeDuplicates(itemListWithDuplicates) {
  const itemListWithoutDuplicates = itemListWithDuplicates.filter(
    (item, index) => {
      itemListWithDuplicates.splice(index, 1);
      const unique = !itemListWithDuplicates.includes(item);
      itemListWithDuplicates.splice(index, 0, item);
      return unique;
    }
  );

  const saleForItems = await Promise.all(itemListWithoutDuplicates);
  return saleForItems;
}

async function refactorItems(items) {
  const result = items.map(async (item) => {
    const response = await fetch(item.tokenURI);
    const metadata = await response.json();
    const refactoredItem = {
      itemId: item.itemId,
      name: metadata.name,
      description: metadata.description,
      price: item.price,
      image: metadata.image,
      artist: item.artist,
      taxFee: item.taxFee,
      addressTaxFeeToken: item.addressTaxFeeToken,
      contract: item.nft,
      tokenId: item.tokenId,
      tokenStandard: metadata.tokenStandard,
      buyer: item.buyer,
    };
    return refactoredItem;
  });
  const refactoredItems = await Promise.all(result);
  return refactoredItems;
}
