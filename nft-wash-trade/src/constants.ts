export const EXCHANGE_CONTRACT_ADDRESSES: Record<string, string> = {
  "LooksRare": "0x59728544B08AB483533076417FbBB2fD0B17CE3a", // LooksRare: Exchange 
  "OpenSea": "0x7f268357A8c2552623316e2562D90e642bB538E5" // OpenSea: Wyvern Exchange v2 
}
export const EXCHANGE_TRADE_EVENTS: Record<string, string> = {
  "LooksRare": "event TakerBid(bytes32 orderHash, uint256 orderNonce, address indexed taker, address indexed maker, address indexed strategy, address currency, address collection, uint256 tokenId, uint256 amount, uint256 price)",
  "OpenSea": "event OrdersMatched(bytes32 buyHash, bytes32 sellHash, address indexed maker, address indexed taker, uint price, bytes32 indexed metadata)"
}

export const MAX_AGE = 24 * 60 * 60 * 30 // 30 days
export const MAX_DEPTH = 50
export const MAX_SALES = 1
export const MAX_TOKENS = 100000

export const TRANSFER_EVENT = "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
