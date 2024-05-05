export default class Block {
  constructor(timestamp, blockNumber, lastHash, currentHash, data) {
    if (!timestamp || !lastHash || !currentHash || !data) return;
    if (typeof timestamp !== "number") return;
    if (typeof blockNumber !== "number") return;
    if (typeof lastHash !== "string") return;
    if (typeof currentHash !== "string") return;
    if (typeof data !== "object") return;
    this.timestamp = timestamp;
    this.blockNumber = blockNumber;
    this.lastHash = lastHash;
    this.currentHash = currentHash;
    this.data = data;
  }
}
