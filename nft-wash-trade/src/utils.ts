import { LogDescription } from 'forta-agent'

interface saleHistory {
  buyer: string
  /** sale timestamp */
  saleAt: number
}

interface saleMetadata {
  /** # of sales */
  count: number
  /** first sale timestamp */
  firstSaleAt: number
  /** # of sales finding was sent for */
  findingSent: number
}

interface nftReport {
  /** list of past sales history */
  salesHistory: saleHistory[]
  /** map of past sales by buyer address */
  salesMetadata: { [key: string]: saleMetadata }
}

export let nftList: string[] = []
export const nftMap: Map<string, nftReport> = new Map()

export function deleteNft(tokenId: string) {
  nftList = nftList.filter((thisId) => thisId != tokenId)
  nftMap.delete(tokenId)
}

export function getBuyer(transfer: LogDescription): string {
  const buyer = transfer.args.to
  return buyer
}

export function getDateTime(timestamp: number) {
  return new Date(timestamp * 1000).toUTCString()
}

export function getNftId(transfer: LogDescription): string {
  const tokenId = transfer.args.tokenId.toString()
  return tokenId
}

export function getNftWithOldestSale(): string {
  let oldestSaleTimestamp = Math.floor(new Date().getTime() / 1000)
  let tokenId = nftList[0];

  nftMap.forEach(function (report, id) {
    const lastSaleTimestamp = report.salesHistory[report.salesHistory.length - 1].saleAt
    if (lastSaleTimestamp < oldestSaleTimestamp) {
      oldestSaleTimestamp = lastSaleTimestamp
      tokenId = id
    }
  })
  return tokenId
}

export function isTracked(transfer: LogDescription): boolean {
  const tokenId = getNftId(transfer)
  return nftMap.has(tokenId)
}

export function trackNft(transfer: LogDescription, timestamp: number) {
  const buyer = getBuyer(transfer)
  const tokenId = getNftId(transfer)

  if (!nftMap.has(tokenId)) {
    nftMap.set(tokenId, {
      salesHistory: [{ buyer: buyer, saleAt: timestamp }],
      salesMetadata: { [buyer]: { count: 1, firstSaleAt: timestamp, findingSent: 1 } }
    })
    nftList.push(tokenId)
    console.log({ action: "tracking nft", tokenId, ...nftMap.get(tokenId) })
  }
}

export function trackNftSale(tokenId: string, transfer: LogDescription, timestamp: number) {
  const buyer = getBuyer(transfer)
  const nftReport = nftMap.get(tokenId)!

  nftReport.salesHistory.push({ buyer: buyer, saleAt: timestamp })
  if (!nftReport.salesMetadata[buyer]) {
    nftReport.salesMetadata[buyer] = { count: 1, firstSaleAt: timestamp, findingSent: 1 }
  } else {
    nftReport.salesMetadata[buyer].count++
  }
}
