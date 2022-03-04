# NFT Wash Trade Agent

:star2: Check out `SETUP.md` on how to customize and deploy your own NFT wash trade agent!

## Description

Inspired by the research paper: [NFT Wash Trading: Quantifying suspicious behaviour in NFT markets](https://arxiv.org/abs/2202.03866), this agent monitors the following NFT collection's sales on the specified exchange and detects wallet addresses involved in wash trading:

```javascript
{
  "nftCollectionName": "Meebits",
  "nftCollectionAddress": "0x7Bd29408f11D2bFC23c34f18275bBf23bB716Bc7", // Any ERC-721 Contract
  "nftExchangeName": "LooksRare" // or OpenSea
}
```

More specifically, the agent detects wallet addresses that bought the same Meebits NFT more than once on the LooksRare exchange.

## Supported Chains

- Ethereum

## Alerts

- NFT-WASH-TRADE
  - Fired when an NFT was bought by the same wallet address more than once
  - Severity is always set to "medium"
  - Type is always set to "suspicious"

## Scope

- Only the latest 50 sales for an NFT will be tracked. Old sales will be removed to make room for new sales. 
- If the last NFT sale is over 30 days old, old sales history will be wiped for that particular NFT.
- Maximum of 100,000 NFTs with the latest sales will be tracked. NFT with the least activity will be removed to make room for NFT with latest sales. 

## Test Data

The agent behavior can be verified with the following list of transactions:

```bash
$ npm run tx 0xd033cb4b4609b47c224d6143ee7e9102ec9df74a6b196a5e72ed3622f1c103d8,0x2719a320a6987b98c80efacca0f8bdc9202755533ea72249f2d1be715ddecf0d,0x8723e406aa35e1a6e2e10bfa6b93ea7c074d8a4c480adb1b6bc3418d5e76bdff
...
1 findings for transaction 0x8723e406aa35e1a6e2e10bfa6b93ea7c074d8a4c480adb1b6bc3418d5e76bdff {
  "name": "NFT Wash Trade",
  "description": "Meebits #13531 Wash Trade on LooksRare",
  "alertId": "NFT-WASH-TRADE",
  "protocol": "ethereum",
  "severity": "Medium",
  "type": "Suspicious",
  "metadata": {
    "buyer": "0xc32575Be004af0843D995D6139BBeB9F8085D970",
    "tokenId": "13531",
    "collectionContract": "0x7Bd29408f11D2bFC23c34f18275bBf23bB716Bc7",
    "collectionName": "Meebits",
    "exchangeContract": "0x59728544B08AB483533076417FbBB2fD0B17CE3a",
    "exchangeName": "LooksRare",
    "salesCountSoFar": "2",
    "firstSaleTimestampTracked": "Tue, 01 Mar 2022 05:24:48 GMT",
    "salesHistory": "buyer 0xc32575Be004af0843D995D6139BBeB9F8085D970 at Tue, 01 Mar 2022 05:24:48 GMT -> buyer 0x2EdaDfb25586B1E4d6623C7021E76A2Fa595cdEc at Tue, 01 Mar 2022 05:33:00 GMT -> buyer 0xc32575Be004af0843D995D6139BBeB9F8085D970 at Wed, 02 Mar 2022 08:49:37 GMT"
  }
}
```
