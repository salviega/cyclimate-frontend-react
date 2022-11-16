import logo from "../../../assets/images/logo-Cyclimate.png";
import React from "react";
import "./CyclimateEventDetails.scss";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { ethers } from "ethers";
import { QRCodeSVG } from "qrcode.react";
import { useAuth, useContracts } from "../../../hooks/context";
import { CyclimateLoading } from "../../../shared/CyclimateLoading";
import benefitContractAbi from "../../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/BenefitContract.sol/BenefitContract.json";

export function CyclimateEventDetails({ getItem }) {
  const [item, setItem] = React.useState({});
  const [contract, setContract] = React.useState({});
  const [buttons, setButtons] = React.useState([]);
  const [error, setError] = React.useState(false);
  const [counter, setCounter] = React.useState(0);
  const [maxMint, setmaxMint] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [sincronizedItems, setSincronizedItems] = React.useState(true);
  const auth = useAuth();
  const contracts = useContracts();
  const location = useLocation();
  const { slug } = useParams();
  const navigate = useNavigate();

  const data = async (id) => {
    try {
      setItem(await getItem(id));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error);
      console.error(error);
    }
  };

  const getBenefit = async (id) => {
    const benefitContractAddress = await contracts.benefitsContract.getBenefit(
      id
    );
    const benefitContract = new ethers.Contract(
      benefitContractAddress,
      benefitContractAbi.abi,
      contracts.web3Signer
    );
    setCounter(
      ethers.BigNumber.from(await benefitContract.tokenIdCounter()).toNumber()
    );
    setmaxMint(
      ethers.BigNumber.from(await benefitContract.maxMint()).toNumber()
    );
    setContract(benefitContract);

    const benefitsIdByOwner = await benefitContract.getBenefitsIdsByCustomer(
      auth.user.walletAddress
    );
    const parsedBenefitsIdByOwner = benefitsIdByOwner.map(async (benefitId) => {
      const parsedIntId = ethers.BigNumber.from(benefitId).toNumber();
      const benefit = await benefitContract.tokens(parsedIntId);
      return { id: parsedIntId, checkIn: benefit[2], reedem: benefit[3] };
    });
    const refactoredBenefits = await Promise.all(parsedBenefitsIdByOwner);
    setButtons(refactoredBenefits);
  };

  const onCheckIn = async (benefit) => {
    const response = await contract.checkIn(benefit.id);

    contracts.web3Provider
      .waitForTransaction(response.hash)
      .then(async (_response) => {
        alert(`Firmas el beneficio ${benefit.id}`);
        setSincronizedItems(false);
      });
  };

  const mintBenefit = async () => {
    try {
      setLoading(true);
      const response = await contracts.cycliContract.authorizeOperator(
        contract.address
      );
      contracts.web3Provider
        .waitForTransaction(response.hash)
        .then(async (_response) => {
          const response2 = await contract.safeMint(
            contracts.cycliContract.address,
            {
              gasLimit: 2500000,
            }
          );
          contracts.web3Provider
            .waitForTransaction(response2.hash)
            .then(async (_response2) => {
              alert("¡Got to benefit!");
              setSincronizedItems(false);
            })
            .catch(async (error) => {
              console.log(error);
              setLoading(false);
              setError(true);
            });
        })
        .catch(async (error) => {
          console.log(error);
          setLoading(false);
          setError(true);
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(true);
    }
  };

  React.useEffect(() => {
    if (location.state?.event) {
      setItem(location.state?.event);
      getBenefit(location.state?.event.benefitId);
      setLoading(false);
      setSincronizedItems(true);
    } else {
      data(slug);
      getBenefit(slug);
      setLoading(false);
      setSincronizedItems(true);
    }
  }, [sincronizedItems]);

  if (auth.user.walletAddress === "Connect wallet") {
    return <Navigate to="/" />;
  }

  if (!item) {
    return <></>;
  }

  return (
    <div className="details-container">
      {error && "Hubo un error... mira la consola"}
      {loading && !error && (
        <div className="details__loading">
          <CyclimateLoading />
        </div>
      )}
      {!loading && !error && (
        <div className="details">
          <img src={item.imageBase64} alt="logo" />
          <div className="details-info">
            <h1>{item.name}</h1>
            <p>count: {counter} </p>
            <p>max: {maxMint}</p>
            <div className="details-info-price">
              <figure>
                <img src={logo} alt="logo" />
              </figure>
              <h2>{parseInt(item.price)}</h2>
            </div>
            <p>{item.description}</p>
          </div>
          <div className="details-buttons">
            <button
              className="details-buttons__volver"
              onClick={() => navigate("/")}
            >
              Back
            </button>
            {counter === maxMint ? null : (
              <button
                className="details-buttons__redimir"
                onClick={mintBenefit}
              >
                Redeem
              </button>
            )}
            <div>
              {buttons
                ? buttons.map((button, index) =>
                    !button.checkIn ? (
                      <button
                        key={index}
                        className="details-buttons__redimir"
                        onClick={() => onCheckIn(button)}
                      >
                        Check-in {button.id}
                      </button>
                    ) : button.reedem ? null : (
                      <div className="qr">
                        <QRCodeSVG
                          value={`dark-surf-5539.on.fleek.co/approve/${slug}==${button.id}`}
                        />
                        <button
                          className="details-buttons__volver"
                          onClick={() =>
                            navigate(`/approve/${slug}==${button.id}`)
                          }
                        >
                          redeem
                        </button>
                      </div>
                    )
                  )
                : "No hay beneficios que redimir"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
