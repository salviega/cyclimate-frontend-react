const fs = require('fs')
const { ethers } = require('hardhat')

async function main () {
  const FeedContract = await ethers.getContractFactory('FeedContract')
  const feedContract = await FeedContract.deploy()
  await feedContract.deployed()
  console.log('FeedContract was deployed to: ' + feedContract.address)
  console.log(
    'FeedContract was deployed to block number: ' +
      (await feedContract.provider.getBlockNumber())
  )

  const CycliContract = await ethers.getContractFactory('CycliContract')
  const cycliContract = await CycliContract.deploy()
  await cycliContract.deployed()
  console.log('CycliContract was deployed to: ' + cycliContract.address)
  console.log(
    'CycliContract was deployed to block number: ' +
      (await cycliContract.provider.getBlockNumber())
  )

  const MarketplaceContract = await ethers.getContractFactory(
    'MarketplaceContract'
  )
  const marketplaceContract = await MarketplaceContract.deploy(
    cycliContract.address
  )
  await marketplaceContract.deployed()
  console.log(
    'MarketplaceContract was deployed to: ' + marketplaceContract.address
  )
  console.log(
    'MarketplaceContract was deployed to block number: ' +
      (await marketplaceContract.provider.getBlockNumber())
  )

  await cycliContract.authorizeOperator(marketplaceContract.address)
  await marketplaceContract.addContractToken(cycliContract.address)

  const BenefitsContract = await ethers.getContractFactory('BenefitsContract')
  const benefitsContract = await BenefitsContract.deploy()
  await benefitsContract.deployed()
  console.log('BenefitsContract was deployed to: ' + benefitsContract.address)
  console.log(
    'BenefitsContract was deployed to block number: ' +
      (await benefitsContract.provider.getBlockNumber())
  )

  await cycliContract.authorizeOperator(benefitsContract.address)

  const PaymentGatewayContract = await ethers.getContractFactory(
    'PaymentGatewayContract'
  )
  const paymentgatewaycontract = await PaymentGatewayContract.deploy(
    cycliContract.address
  )
  await paymentgatewaycontract.deployed()

  console.log(
    'PaymentGatewayContract was deployed to: ' + paymentgatewaycontract.address
  )
  console.log(
    'PaymentGatewayContract was deployed to block number: ' +
      (await paymentgatewaycontract.provider.getBlockNumber())
  )
  await cycliContract.authorizeOperator(paymentgatewaycontract.address)

  const RedeemDataContract = await ethers.getContractFactory(
    'RedeemDataContract'
  )
  const redeemDataContract = await RedeemDataContract.deploy(
    '0xf7e113AF5C0e7D19002EEEbCdae11a2Da66Af00B', // Oracule
    cycliContract.address
  )
  await redeemDataContract.deployed()

  console.log(
    'RedeemDataContract was deployed to: ' + redeemDataContract.address
  )
  console.log(
    'RedeemDataContract was deployed to block number: ' +
      (await redeemDataContract.provider.getBlockNumber())
  )

  const addresses = [
    {
      feedcontract: feedContract.address,
      blocknumber: await feedContract.provider.getBlockNumber()
    },
    {
      cyclicontract: cycliContract.address,
      blocknumber: await cycliContract.provider.getBlockNumber()
    },
    {
      marketplacecontract: marketplaceContract.address,
      blocknumber: await marketplaceContract.provider.getBlockNumber()
    },
    {
      benefitscontract: benefitsContract.address,
      blocknumber: await benefitsContract.provider.getBlockNumber()
    },
    {
      paymentgatewaycontract: paymentgatewaycontract.address,
      blocknumber: await paymentgatewaycontract.provider.getBlockNumber()
    },
    {
      redeemdatacontract: redeemDataContract.address,
      blocknumber: await redeemDataContract.provider.getBlockNumber()
    }
  ]
  const addressesJSON = JSON.stringify(addresses)
  fs.writeFileSync(
    'src/blockchain/environment/contract-address.json',
    addressesJSON
  )
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
