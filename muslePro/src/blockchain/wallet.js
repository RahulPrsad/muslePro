import { BrowserProvider } from 'ethers';

/** True if a MetaMask-compatible provider is injected. */
export function hasMetaMask() {
  return typeof window !== 'undefined' && !!window.ethereum;
}

/**
 * Request account access from MetaMask and return the connected address.
 * Throws if MetaMask isn't installed or the user rejects the request.
 */
export async function connectWallet() {
  if (!hasMetaMask()) {
    throw new Error('NO_METAMASK');
  }
  const provider = new BrowserProvider(window.ethereum);
  const accounts = await provider.send('eth_requestAccounts', []);
  const network = await provider.getNetwork();
  return {
    address: accounts[0],
    chainId: Number(network.chainId),
    provider,
  };
}

/** Ask MetaMask to switch (or add) the target network, e.g. Sepolia. */
export async function ensureChain(targetChainIdHex, chainConfig) {
  if (!hasMetaMask()) throw new Error('NO_METAMASK');
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: targetChainIdHex }],
    });
  } catch (err) {
    // 4902 = chain not added to MetaMask yet
    if (err.code === 4902 && chainConfig) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [chainConfig],
      });
    } else {
      throw err;
    }
  }
}

/** Subscribe to account/chain changes; returns an unsubscribe function. */
export function onWalletEvents({ onAccountsChanged, onChainChanged }) {
  if (!hasMetaMask()) return () => {};
  const handleAccounts = (accounts) => onAccountsChanged?.(accounts);
  const handleChain = (chainId) => onChainChanged?.(chainId);
  window.ethereum.on('accountsChanged', handleAccounts);
  window.ethereum.on('chainChanged', handleChain);
  return () => {
    window.ethereum.removeListener('accountsChanged', handleAccounts);
    window.ethereum.removeListener('chainChanged', handleChain);
  };
}

export function shortenAddress(address) {
  if (!address) return '';
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}
