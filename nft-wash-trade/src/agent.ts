import {
  Finding,
  LogDescription,
  HandleTransaction,
  FindingSeverity,
  FindingType
} from 'forta-agent'
import {
  deleteNft,
  getDateTime,
  getNftId,
  getNftWithOldestSale,
  isTracked,
  nftList,
  nftMap,
  trackNft,
  trackNftSale
} from './utils'
import {
  MAX_AGE,
  MAX_DEPTH,
  MAX_SALES,
  MAX_TOKENS,
  EXCHANGE_CONTRACT_ADDRESSES,
  EXCHANGE_TRADE_EVENTS,
  TRANSFER_EVENT
} from './constants'

// load config file
import config from './agent-config.json';

// load configuration data from agent config file
const {
  nftCollectionAddress,
  nftCollectionName,
  nftExchangeName
} = config;

const tradeEvent: string = EXCHANGE_TRADE_EVENTS[nftExchangeName]
const nftExchangeAddress: string = EXCHANGE_CONTRACT_ADDRESSES[nftExchangeName]

function checkCycle(transfer: LogDescription, timestamp: number): Finding[] {
  const results: Finding[] = []
  const tokenId = getNftId(transfer)
  const nftReport = nftMap.get(tokenId)!
  var pastSalesCount = nftReport.salesHistory.length

  // Keep track of recent sales only
  if (pastSalesCount == MAX_DEPTH) {
    nftReport.salesHistory.shift()
    pastSalesCount -= 1
  }

  // If last sale is older than 30 days, wipe past sales and track new sale
  const lastSale = nftReport.salesHistory[pastSalesCount - 1]
  if (timestamp - lastSale.saleAt > MAX_AGE) {
    deleteNft(tokenId)
    trackNft(transfer, timestamp)
  }

  trackNftSale(tokenId, transfer, timestamp)

  for (const address in nftReport.salesMetadata) {
    const { count, firstSaleAt, findingSent } = nftReport.salesMetadata[address]
    if (count > MAX_SALES && count > findingSent) {
      const finding = Finding.fromObject({
        name: "NFT Wash Trade",
        description: `${nftCollectionName} #${tokenId} Wash Trade on ${nftExchangeName}`,
        alertId: "NFT-WASH-TRADE",
        severity: FindingSeverity.Medium,
        type: FindingType.Suspicious,
        metadata: {
          buyer: address,
          tokenId: tokenId,
          collectionContract: nftCollectionAddress,
          collectionName: nftCollectionName,
          exchangeContract: nftExchangeAddress,
          exchangeName: nftExchangeName,
          salesCountSoFar: `${count}`,
          firstSaleTimestampTracked: getDateTime(firstSaleAt),
          salesHistory: `${nftReport.salesHistory.map(s => `buyer ${s.buyer} at ${getDateTime(s.saleAt)}`).join(" -> ")}`
        },
      })
      console.log({ action: "found cycle", finding })
      results.push(finding)
      nftReport.salesMetadata[address].findingSent += 1
    }
  }

  return results
}

const handleTransaction: HandleTransaction = async (txEvent) => {
  const findings: Finding[] = []

  const tradeEvents = txEvent.filterLog(tradeEvent, nftExchangeAddress)
  const transferEvents = txEvent.filterLog(TRANSFER_EVENT, nftCollectionAddress)

  // Check that the transfers are for the trades
  if (tradeEvents.length == transferEvents.length) {
    transferEvents.forEach((transfer) => {
      const saleTimestamp = txEvent.timestamp
      if (isTracked(transfer)) {
        findings.push(...checkCycle(transfer, saleTimestamp))
      } else {
        trackNft(transfer, saleTimestamp)
        // remove oldest NFT if number of tracked tokens exceed MAX_TOKENS
        if (nftList.length > MAX_TOKENS) {
          const tokenId = getNftWithOldestSale()
          deleteNft(tokenId)
        }
      }
    })
  }

  return findings
}

export default {
  handleTransaction
}
