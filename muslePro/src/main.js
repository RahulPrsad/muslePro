import './style.css';
import { connectWallet, ensureChain, onWalletEvents, shortenAddress } from './blockchain/wallet.js';
import { sendPayment, explorerTxUrl } from './blockchain/transaction.js';

// ---- Config pulled from .env (see .env.example) ----
const env = import.meta.env;
const CONFIG = {
  siteName: env.VITE_SITE_NAME || 'IronFuel',
  tagline: env.VITE_TAGLINE || 'Fuel the rep that matters',
  email: env.VITE_CONTACT_EMAIL || 'hello@ironfuel.example',
  phone: env.VITE_CONTACT_PHONE || '+91 90000 00000',
  whatsapp: env.VITE_WHATSAPP_NUMBER || '',
  instagram: env.VITE_INSTAGRAM_URL || '#',
  currency: env.VITE_CURRENCY_SYMBOL || '₹',
  storeWallet: env.VITE_STORE_WALLET_ADDRESS || '',
  chainIdHex: env.VITE_CHAIN_ID_HEX || '0xaa36a7',
  chainName: env.VITE_CHAIN_NAME || 'Sepolia Test Network',
  chainRpcUrl: env.VITE_CHAIN_RPC_URL || 'https://rpc.sepolia.org',
  chainExplorerUrl: env.VITE_CHAIN_EXPLORER_URL || 'https://sepolia.etherscan.io',
  chainCurrencySymbol: env.VITE_CHAIN_CURRENCY_SYMBOL || 'SepoliaETH',
  checkoutAmountEth: env.VITE_CHECKOUT_AMOUNT_ETH || '0.0005',
};

// ---- Product catalog ----
const PRODUCTS = [
  {
    name: 'Whey Gold',
    flavor: 'Double Rich Chocolate',
    protein: 24,
    serving: 30,
    price: 2499,
    tag: 'Bestseller',
    color: '#c8ff3d',
  },
  {
    name: 'Isolate Zero',
    flavor: 'Vanilla Bean',
    protein: 27,
    serving: 31,
    price: 3199,
    tag: 'Low Lactose',
    color: '#ff8a3d',
  },
  {
    name: 'Mass Stack XL',
    flavor: 'Cookies & Cream',
    protein: 50,
    serving: 165,
    price: 2899,
    tag: 'High Calorie',
    color: '#7dd3fc',
  },
  {
    name: 'Fuel Bar',
    flavor: 'Peanut Crunch',
    protein: 20,
    serving: 60,
    price: 149,
    tag: 'On the go',
    color: '#f4c2ff',
  },
];

function renderProducts() {
  const grid = document.getElementById('product-grid');
  grid.innerHTML = PRODUCTS.map(
    (p, i) => `
    <div class="product-card">
      <div class="product-media">
        <span class="product-tag">${p.tag}</span>
        <div class="tub" style="background:${p.color}"></div>
      </div>
      <div class="product-body">
        <h3>${p.name}</h3>
        <p class="product-flavor">${p.flavor}</p>
        <div class="product-macros">
          <span><b>${p.protein}g</b> protein</span>
          <span>${p.serving}g serving</span>
        </div>
        <div class="product-footer">
          <span class="price">${CONFIG.currency}${p.price.toLocaleString('en-IN')}</span>
          <button class="add-btn" data-index="${i}">Add</button>
        </div>
      </div>
    </div>`
  ).join('');

  grid.querySelectorAll('.add-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const index = Number(btn.dataset.index);
      addToCart(index);
      btn.textContent = 'Added ✓';
      btn.classList.add('added');
      setTimeout(() => {
        btn.textContent = 'Add';
        btn.classList.remove('added');
      }, 1400);
    });
  });
}

// ---- Shopping cart ----
const CART_STORAGE_KEY = 'ironfuel-cart';
let cart = loadCart();

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Keep only entries that still map to a valid product index
    return Array.isArray(parsed)
      ? parsed.filter((item) => Number.isInteger(item.index) && PRODUCTS[item.index] && item.qty > 0)
      : [];
  } catch {
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // localStorage unavailable (private mode, etc.) — cart just won't persist
  }
}

function addToCart(index, qty = 1) {
  const existing = cart.find((item) => item.index === index);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ index, qty });
  }
  saveCart();
  renderCart();
}

function setQty(index, qty) {
  const item = cart.find((i) => i.index === index);
  if (!item) return;
  if (qty <= 0) {
    cart = cart.filter((i) => i.index !== index);
  } else {
    item.qty = qty;
  }
  saveCart();
  renderCart();
}

function cartTotal() {
  return cart.reduce((sum, item) => sum + (PRODUCTS[item.index]?.price || 0) * item.qty, 0);
}

function cartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function renderCart() {
  const countEl = document.getElementById('cart-count');
  const itemsEl = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total-value');
  const checkoutTotalEl = document.getElementById('checkout-cart-total');
  if (!countEl || !itemsEl || !totalEl) return;

  countEl.textContent = String(cartCount());

  if (cart.length === 0) {
    itemsEl.innerHTML = '<p class="cart-empty">Your cart is empty. Add a product to get started.</p>';
  } else {
    itemsEl.innerHTML = cart
      .map((item) => {
        const p = PRODUCTS[item.index];
        return `
        <div class="cart-item">
          <div class="tub-mini" style="background:${p.color}"></div>
          <div class="cart-item-body">
            <h4>${p.name}</h4>
            <p>${p.flavor} · ${CONFIG.currency}${p.price.toLocaleString('en-IN')}</p>
          </div>
          <div class="cart-item-qty">
            <button data-action="dec" data-index="${item.index}" aria-label="Decrease quantity">−</button>
            <span>${item.qty}</span>
            <button data-action="inc" data-index="${item.index}" aria-label="Increase quantity">+</button>
          </div>
        </div>`;
      })
      .join('');

    itemsEl.querySelectorAll('button[data-action]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const index = Number(btn.dataset.index);
        const item = cart.find((i) => i.index === index);
        const current = item ? item.qty : 0;
        setQty(index, btn.dataset.action === 'inc' ? current + 1 : current - 1);
      });
    });
  }

  const totalText = `${CONFIG.currency}${cartTotal().toLocaleString('en-IN')}`;
  totalEl.textContent = totalText;
  if (checkoutTotalEl) checkoutTotalEl.textContent = totalText;
}

function wireCart() {
  const cartBtn = document.getElementById('cart-btn');
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  const closeBtn = document.getElementById('cart-close');
  const checkoutBtn = document.getElementById('cart-checkout-btn');

  function openCart() {
    drawer.hidden = false;
    overlay.hidden = false;
  }
  function closeCart() {
    drawer.hidden = true;
    overlay.hidden = true;
  }

  cartBtn.addEventListener('click', openCart);
  closeBtn.addEventListener('click', closeCart);
  overlay.addEventListener('click', closeCart);
  checkoutBtn.addEventListener('click', closeCart);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCart();
  });

  renderCart();
}

function wireMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('main-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function applyConfig() {
  document.title = `${CONFIG.siteName} — ${CONFIG.tagline}`;
  document.getElementById('hero-tagline').textContent =
    `${CONFIG.tagline}. Whey, isolate and mass gainers built around one number that actually matters: grams of protein per ${CONFIG.currency === '₹' ? 'rupee' : 'dollar'}.`;
  document.getElementById('currency-note').textContent = CONFIG.currency;
  document.getElementById('footer-sitename').textContent = CONFIG.siteName;
  document.getElementById('footer-year').textContent = new Date().getFullYear();

  const emailEl = document.getElementById('footer-email');
  emailEl.textContent = CONFIG.email;
  emailEl.href = `mailto:${CONFIG.email}`;

  const phoneEl = document.getElementById('footer-phone');
  phoneEl.textContent = CONFIG.phone;
  phoneEl.href = CONFIG.whatsapp
    ? `https://wa.me/${CONFIG.whatsapp}`
    : `tel:${CONFIG.phone.replace(/\s+/g, '')}`;

  const instaEl = document.getElementById('footer-insta');
  instaEl.href = CONFIG.instagram;

  document.querySelectorAll('#site-logo, .logo').forEach((el) => {
    el.innerHTML = `${CONFIG.siteName.slice(0, Math.ceil(CONFIG.siteName.length / 2))}<span>${CONFIG.siteName.slice(
      Math.ceil(CONFIG.siteName.length / 2)
    )}</span>`;
  });
}

function wireNewsletter() {
  const form = document.getElementById('newsletter-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button');
    const original = btn.textContent;
    btn.textContent = 'You’re on the list ✓';
    form.reset();
    setTimeout(() => (btn.textContent = original), 2200);
  });
}

// ---- Wallet / checkout state ----
const wallet = { provider: null, address: null, chainId: null };

function chainConfigForAdd() {
  return {
    chainId: CONFIG.chainIdHex,
    chainName: CONFIG.chainName,
    rpcUrls: [CONFIG.chainRpcUrl],
    nativeCurrency: { name: CONFIG.chainCurrencySymbol, symbol: CONFIG.chainCurrencySymbol, decimals: 18 },
    blockExplorerUrls: [CONFIG.chainExplorerUrl],
  };
}

function setCheckoutNote(message, isError = false) {
  const note = document.getElementById('checkout-note');
  note.textContent = message;
  note.classList.toggle('error', isError);
}

function refreshWalletUI() {
  const walletBtn = document.getElementById('wallet-btn');
  const statusVal = document.getElementById('wallet-status-value');
  const networkVal = document.getElementById('wallet-network-value');
  const payBtn = document.getElementById('pay-btn');

  if (wallet.address) {
    walletBtn.textContent = `🦊 ${shortenAddress(wallet.address)}`;
    walletBtn.classList.add('connected');
    statusVal.textContent = shortenAddress(wallet.address);
    networkVal.textContent =
      String(wallet.chainId) === String(parseInt(CONFIG.chainIdHex, 16))
        ? CONFIG.chainName
        : `Chain ${wallet.chainId} (switch needed)`;
    payBtn.disabled = false;
    payBtn.textContent = `Pay with MetaMask`;
  } else {
    walletBtn.textContent = '🦊 Connect Wallet';
    walletBtn.classList.remove('connected');
    statusVal.textContent = 'Not connected';
    networkVal.textContent = '—';
    payBtn.disabled = true;
    payBtn.textContent = 'Connect wallet first';
  }
}

async function handleConnectWallet() {
  const walletBtn = document.getElementById('wallet-btn');
  try {
    walletBtn.textContent = 'Connecting…';
    const { address, chainId, provider } = await connectWallet();
    wallet.address = address;
    wallet.chainId = chainId;
    wallet.provider = provider;
    refreshWalletUI();

    const targetChainId = parseInt(CONFIG.chainIdHex, 16);
    if (chainId !== targetChainId) {
      setCheckoutNote(`Switching to ${CONFIG.chainName}…`);
      await ensureChain(CONFIG.chainIdHex, chainConfigForAdd());
      // chainChanged listener below will refresh state/UI
    } else {
      setCheckoutNote('Wallet connected. Ready to pay.');
    }
  } catch (err) {
    refreshWalletUI();
    if (err?.message === 'NO_METAMASK') {
      setCheckoutNote('MetaMask not found — install the browser extension to continue.', true);
    } else if (err?.code === 4001) {
      setCheckoutNote('Connection request rejected.', true);
    } else {
      setCheckoutNote(err?.message || 'Could not connect wallet.', true);
    }
  }
}

async function handlePay() {
  const payBtn = document.getElementById('pay-btn');
  if (!wallet.provider || !wallet.address) return;

  if (!CONFIG.storeWallet) {
    setCheckoutNote('No store wallet address configured — set VITE_STORE_WALLET_ADDRESS in .env.', true);
    return;
  }

  const originalText = payBtn.textContent;
  payBtn.disabled = true;
  payBtn.textContent = 'Confirm in MetaMask…';
  setCheckoutNote('Waiting for confirmation in your wallet…');

  try {
    const tx = await sendPayment(wallet.provider, CONFIG.storeWallet, CONFIG.checkoutAmountEth);
    payBtn.textContent = 'Broadcasting…';
    setCheckoutNote(`Transaction sent: ${shortenAddress(tx.hash)} — waiting for confirmation…`);
    await tx.wait();
    const url = explorerTxUrl(CONFIG.chainExplorerUrl, tx.hash);
    setCheckoutNote(`✅ Confirmed! View it on the explorer: ${url}`);
    const note = document.getElementById('checkout-note');
    note.innerHTML = `✅ Confirmed! <a href="${url}" target="_blank" rel="noopener">View on block explorer →</a>`;
  } catch (err) {
    if (err?.code === 'ACTION_REJECTED' || err?.code === 4001) {
      setCheckoutNote('Transaction rejected in wallet.', true);
    } else {
      setCheckoutNote(err?.shortMessage || err?.message || 'Transaction failed.', true);
    }
  } finally {
    payBtn.disabled = false;
    payBtn.textContent = originalText;
  }
}

function wireWallet() {
  document.getElementById('checkout-amount').textContent = `${CONFIG.checkoutAmountEth} ${CONFIG.chainCurrencySymbol}`;
  document.getElementById('wallet-btn').addEventListener('click', handleConnectWallet);
  document.getElementById('pay-btn').addEventListener('click', handlePay);
  refreshWalletUI();

  onWalletEvents({
    onAccountsChanged: (accounts) => {
      wallet.address = accounts[0] || null;
      if (!wallet.address) setCheckoutNote('Wallet disconnected.');
      refreshWalletUI();
    },
    onChainChanged: () => {
      // Reload connection state cleanly on chain switch
      window.location.reload();
    },
  });
}

applyConfig();
renderProducts();
wireNewsletter();
wireWallet();
wireCart();
wireMobileNav();
