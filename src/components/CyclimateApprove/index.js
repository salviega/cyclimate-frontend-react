import "./CyclimateApprove.scss";
import React from "react";
import { useAuth, useContracts } from "../../hooks/context";
import { useNavigate, useParams } from "react-router-dom";
import { ethers } from "ethers";
import benefitContractAbi from "../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/BenefitContract.sol/BenefitContract.json";

export function CyclimateApprove({ getItem }) {
  const [item, setItem] = React.useState({});
  const [contract, setContract] = React.useState({});
  const [customer, setCustomer] = React.useState({});
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [sincronizedItems, setSincronizedItems] = React.useState(true);

  const auth = useAuth();
  const contracts = useContracts();
  // const location = useLocation();
  const { slug } = useParams();
  const navigate = useNavigate();

  const data = async (param) => {
    try {
      const splitedParam = param.split("==");
      const firebaseId = splitedParam[0];
      const tokenId = splitedParam[1];
      console.log(tokenId);
      setItem(await getItem(firebaseId));
      const item = await getItem(firebaseId);
      console.log(item);
      const benefitContract = new ethers.Contract(
        item.benefitContractAddress,
        benefitContractAbi.abi,
        contracts.web3Signer
      );
      const token = await benefitContract.tokens(tokenId);
      console.log(tokenId);
      const managerAddress = await benefitContract.isManagerOrAdmin();
      console.log(
        "managerAddress: " + managerAddress + " " + "redeem: " + token[3]
      );
      if (!managerAddress || token[3]) {
        return navigate("/");
      }
      setCustomer({ address: await benefitContract.ownerOf(tokenId), tokenId });
      setContract(benefitContract);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error);
      console.error(error);
    }
  };

  React.useEffect(() => {
    data(slug);
    setLoading(false);
    setSincronizedItems(true);
  }, []);

  const onRedeemBenefit = async () => {
    console.log("customer address", customer.address);
    console.log("tokenId", customer.tokenId);
    const response = await contract.redeemBenefit(
      customer.address,
      parseInt(customer.tokenId),
      {
        gasLimit: 2500000,
      }
    );
    contracts.web3Provider
      .waitForTransaction(response.hash)
      .then(async (_response) => {
        alert("Fue aceptado el beneficio");
        navigate("/");
      });
  };

  return (
    <div className="approve">
      <button className="details-buttons__redimir" onClick={onRedeemBenefit}>
        Quemar
      </button>
    </div>
  );
}
