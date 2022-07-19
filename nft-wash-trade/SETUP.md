# NFT Wash Trade bot Template

Inspired by the research paper: [NFT Wash Trading: Quantifying suspicious behaviour in NFT markets](https://arxiv.org/abs/2202.03866), this bot can monitor a NFT collection's sales on a specified exchange for wash trades. More specifically, this bot finds wallet addresses that bought the same NFT more than once on an exchange. This bot can be configured to monitor a specific NFT collection on either the LooksRare or OpenSea exchange.

## bot Setup in 5 steps

### Step 1: Customize your bot.

Update the `bot-config.json` to monitor a NFT collection of your choosing on either the LooksRare or OpenSea exchange.

```javascript
{
  "nftCollectionName": "Meebits",
  "nftCollectionAddress": "0x7Bd29408f11D2bFC23c34f18275bBf23bB716Bc7", // Any ERC-721 Contract
  "nftExchangeName": "LooksRare" // or OpenSea
}
```

### Step 2: Check that your bot config is valid.

```bash
$ npm run validate-config

> nft-wash-trade@0.0.1 validate-config
> npm run build && ajv validate -s schemas/bot-config.json -d bot-config.json


> nft-wash-trade@0.0.1 build
> tsc

bot-config.json valid
```

### Step 3: Run unit tests.

Current tests only check for empty findings if no matched events are found, so please feel free to add more tests and contribute! For more details on testing, please check out [the Forta SDK test docs](https://docs.forta.network/en/latest/testing/).

```bash
$ npm test
```

### Step 4: Test the bot out on past NFT sale transactions.

```bash
$ npm run tx HASH_A,HASH_B,HASH_C
```

### Step 5: Deploy the bot!

For detailed instructions on how to deploy, please check out [the Forta SDK deploy docs](https://docs.forta.network/en/latest/deploying/).

