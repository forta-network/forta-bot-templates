# NFT Wash Trade Agent Template

Inspired by the research paper: [NFT Wash Trading: Quantifying suspicious behaviour in NFT markets](https://arxiv.org/abs/2202.03866), this agent can monitor a NFT collection's sales on a specified exchange for wash trades. More specifically, this agent finds wallet addresses that bought the same NFT more than once on an exchange. This agent can be configured to monitor a specific NFT collection on either the LooksRare or OpenSea exchange. 

## Agent Setup in 5 steps

### Step 1: Customize your agent.

Update the `src/agent-config.json` to monitor a NFT collection of your choosing on either the LooksRare or OpenSea exchange. 

```javascript
{
  "nftCollectionName": "Meebits",
  "nftCollectionAddress": "0x7Bd29408f11D2bFC23c34f18275bBf23bB716Bc7", // Any ERC-721 Contract
  "nftExchangeName": "LooksRare" // or OpenSea
}
```

### Step 2: Check that your agent config is valid. 

```bash
$ ./node_modules/.bin/ajv validate -s schemas/agent-config.json -d src/agent-config.json
src/agent-config.json valid
```

### Step 3: Run unit tests. 

Current tests only check for empty findings if no matched events are found, so please feel free to add more tests and contribute! For more details on testing, please check out [the Forta SDK test docs](https://docs.forta.network/en/latest/testing/).

```bash
$ npm test
```

### Step 4: Test the agent out on past NFT sale transactions. 

```bash
$ npm run tx HASH_A,HASH_B,HASH_C
```

### Step 5: Deploy the agent! 

For detailed instructions on how to deploy, please check out [the Forta SDK deploy docs](https://docs.forta.network/en/latest/deploying/).

