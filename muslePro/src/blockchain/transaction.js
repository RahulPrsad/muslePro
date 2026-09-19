import { parseEther } from 'ethers';

/**
 * Send an ETH payment from the connected wallet to the store address.
 * @param {import('ethers').BrowserProvider} provider
 * @param {string} toAddress
 * @param {string|number} amountEth - amount in ETH, e.g. "0.001"
 * @returns {Promise<import('ethers').TransactionResponse>}
 */
export async function sendPayment(provider, toAddress, amountEth) {
  if (!toAddress) throw new Error('NO_STORE_ADDRESS');
  const signer = await provider.getSigner();
  const tx = await signer.sendTransaction({
    to: toAddress,
    value: parseEther(String(amountEth)),
  });
  return tx; // caller can await tx.wait() for confirmation
}

export function explorerTxUrl(explorerBaseUrl, txHash) {
  const base = (explorerBaseUrl || 'https://sepolia.etherscan.io').replace(/\/$/, '');
  return `${base}/tx/${txHash}`;
}
