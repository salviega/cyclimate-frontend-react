import feedContractAbi from "../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/FeedContract.sol/FeedContract.json";
import cycliContractAbi from "../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/CycliContract.sol/CycliContract.json";
import marketPlaceContractAbi from "../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/MarketplaceContract.sol/MarketplaceContract.json";
import benefitsContractAbi from "../../blockchain/hardhat/artifacts/src/blockchain/hardhat/contracts/BenefitsContract.sol/BenefitsContract.json";
import addresses from "../../blockchain/environment/contract-address.json";
import { ethers } from "ethers";
const feedContractAddress = addresses[0].feedcontract;
const cycliContractAddress = addresses[1].cyclicontract;
const marketPlaceContractAddress = addresses[2].marketplacecontract;
const benefitsContractAddress = addresses[3].benefitscontract;
const paymentGatewayContractAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_cycliContract",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "ChainlinkCancelled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "ChainlinkFulfilled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "ChainlinkRequested",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "OwnershipTransferRequested",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "requestId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "string",
        name: "response",
        type: "string",
      },
    ],
    name: "RequestForInfoFulfilled",
    type: "event",
  },
  {
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "account",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "amount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_requestId",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "_payment",
        type: "uint256",
      },
      {
        internalType: "bytes4",
        name: "_callbackFunctionId",
        type: "bytes4",
      },
      {
        internalType: "uint256",
        name: "_expiration",
        type: "uint256",
      },
    ],
    name: "cancelRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "contractBalances",
    outputs: [
      {
        internalType: "uint256",
        name: "eth",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "link",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "erc777",
    outputs: [
      {
        internalType: "contract ERC777",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_requestId",
        type: "bytes32",
      },
      {
        internalType: "string",
        name: "_info",
        type: "string",
      },
    ],
    name: "fulfillRequestInfo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getChainlinkToken",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lastRetrievedInfo",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_oracle",
        type: "address",
      },
      {
        internalType: "string",
        name: "_jobId",
        type: "string",
      },
      {
        internalType: "string",
        name: "email",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "valor",
        type: "string",
      },
    ],
    name: "requestPayOut",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_operator",
        type: "address",
      },
      {
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_userData",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "_operatorData",
        type: "bytes",
      },
    ],
    name: "tokensReceived",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawBalance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawLink",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
const paymenGatewayContractAddress =
  "0x3a7aCC38404EA49Ac8b229182AeCF83a8E64ae02";

export function useContractContext(signer) {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://rpc.ankr.com/polygon_mumbai"
  );

  const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
  const web3Signer = web3Provider.getSigner();

  const feedContract = generateContract(
    feedContractAddress,
    feedContractAbi.abi,
    provider
  );
  const cycliContract = generateContract(
    cycliContractAddress,
    cycliContractAbi.abi,
    web3Signer
  );
  const marketPlaceContract = generateContract(
    marketPlaceContractAddress,
    marketPlaceContractAbi.abi,
    web3Signer
  );
  const benefitsContract = generateContract(
    benefitsContractAddress,
    benefitsContractAbi.abi,
    web3Signer
  );

  const paymentGatewayContract = generateContract(
    paymenGatewayContractAddress,
    paymentGatewayContractAbi,
    web3Signer
  );

  return {
    web3Provider,
    web3Signer,
    feedContract,
    cycliContract,
    marketPlaceContract,
    benefitsContract,
    paymentGatewayContract,
  };
}

function generateContract(address, abi, provider) {
  const contract = new ethers.Contract(address, abi, provider);
  return contract;
}
