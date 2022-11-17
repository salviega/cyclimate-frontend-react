import feedContractAbi from "../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/FeedContract.sol/FeedContract.json";
import cycliContractAbi from "../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/CycliContract.sol/CycliContract.json";
import marketPlaceContractAbi from "../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/MarketplaceContract.sol/MarketplaceContract.json";
import benefitsContractAbi from "../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/BenefitsContract.sol/BenefitsContract.json";
// import paymentGatewayContractAbi from "../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/PaymentGatewayContract.sol/PaymentGatewayContract.json";
import addresses from "../../blockchain/environment/contract-address.json";
import { ethers } from "ethers";
const feedContractAddress = addresses[0].feedcontract;
const cycliContractAddress = addresses[1].cyclicontract;
const marketPlaceContractAddress = addresses[2].marketplacecontract;
const benefitsContractAddress = addresses[3].benefitscontract;
// const paymenGatewayContractAddress = addresses[4].paymentgatewaycontract;

export function useContractContext(signer) {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://rpc.ankr.com/polygon_mumbai"
  );

  const feedContract = generateContract(
    feedContractAddress,
    feedContractAbi.abi,
    provider
  );

  const _cycliContract = (web3Signer) => {
    return generateContract(
      cycliContractAddress,
      cycliContractAbi.abi,
      web3Signer
    );
  };

  const _marketPlaceContract = (web3Signer) => {
    return generateContract(
      marketPlaceContractAddress,
      marketPlaceContractAbi.abi,
      web3Signer
    );
  };

  const _benefitsContract = (web3Signer) => {
    return generateContract(
      benefitsContractAddress,
      benefitsContractAbi.abi,
      web3Signer
    );
  };

  // const _paymentGatewayContract = (web3Signer) => {
  //   return generateContract(
  //     paymenGatewayContractAddress,
  //     paymentGatewayContractAbi.abi,
  //     web3Signer
  //   )
  // }

  return {
    feedContract,
    _cycliContract,
    _marketPlaceContract,
    _benefitsContract,
    //_paymentGatewayContract
  };
}

function generateContract(address, abi, provider) {
  const contract = new ethers.Contract(address, abi, provider);
  return contract;
}
