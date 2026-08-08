# 💪 IronFuel — Protein & Sports Nutrition Store

A fast, dark-themed storefront for whey, isolate, mass gainers and protein bars.
Built with Vite + vanilla JS/CSS — no framework overhead, easy to extend.

## Getting started

```bash
npm install
cp .env.example .env   # then fill in your own values
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

## Configuration (`.env`)

Copy `.env.example` to `.env` and fill in your details — this file is git-ignored
so your real values never get committed. All variables are optional; sensible
defaults are used if left blank.

| Variable | Purpose |
|---|---|
| `VITE_SITE_NAME` | Store name shown in the header/footer/title |
| `VITE_TAGLINE` | Short hero tagline |
| `VITE_CONTACT_EMAIL` | Footer contact email |
| `VITE_CONTACT_PHONE` | Footer contact phone |
| `VITE_WHATSAPP_NUMBER` | If set, the phone link opens WhatsApp instead of a dialer |
| `VITE_INSTAGRAM_URL` | Footer Instagram link |
| `VITE_CURRENCY_SYMBOL` | Currency symbol used on product prices |
| `VITE_FREE_SHIPPING_THRESHOLD` | Reserved for a future free-shipping banner |
| `VITE_RAZORPAY_KEY_ID` / `VITE_STRIPE_PUBLISHABLE_KEY` | Reserved for wiring up real checkout later |

> Only variables prefixed `VITE_` are exposed to the browser — that's a Vite
> requirement, and it's also why you should never put secret/private keys here.
> Publishable/public keys only.

## Project structure

```
muscle-protein-store/
├── index.html
├── src/
│   ├── main.js      # renders products, applies .env config, wires up UI
│   └── style.css     # design tokens + layout
├── .env.example
├── package.json
└── vite.config.js
```

## MetaMask / ETH checkout

The **Pay with ETH** section (`#checkout`) connects to MetaMask via `ethers.js`
and sends a small test payment on **Sepolia** (Ethereum's test network) by
default — no real money involved.

1. Install the [MetaMask](https://metamask.io) browser extension.
2. Get free Sepolia test ETH from a faucet, e.g. `https://sepoliafaucet.com`.
3. Set `VITE_STORE_WALLET_ADDRESS` in `.env` to the address that should
   receive payments (use one of your own test wallets while developing).
4. `npm run dev`, click **Connect Wallet**, approve the connection, then
   click **Pay with MetaMask**. MetaMask will prompt you to switch to
   Sepolia automatically if you're on a different network.
5. Once confirmed, the transaction hash links out to the Sepolia block
   explorer.

Relevant env vars (see `.env.example` for all of them):

| Variable | Purpose |
|---|---|
| `VITE_STORE_WALLET_ADDRESS` | Wallet that receives checkout payments |
| `VITE_CHAIN_ID_HEX` | Network MetaMask must be on (`0xaa36a7` = Sepolia) |
| `VITE_CHAIN_RPC_URL` / `VITE_CHAIN_EXPLORER_URL` | Used if MetaMask needs to add the network |
| `VITE_CHECKOUT_AMOUNT_ETH` | Flat amount sent per checkout click |

**Going to mainnet / real payments:** switch `VITE_CHAIN_ID_HEX` to `0x1` and
update the RPC/explorer URLs — but treat that as a separate, carefully
tested step. This demo has no backend order verification, so don't rely on
it alone for a real store.

⚠️ Never commit a `.env` with a private key or seed phrase. This project
only ever asks MetaMask to sign transactions client-side — it never touches
private keys directly.

## Editing products

Products live in the `PRODUCTS` array at the top of `src/main.js`. Add, remove,
or edit entries — each needs a `name`, `flavor`, `protein` (g), `serving` (g),
`price`, `tag`, and an accent `color`.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |

## Notes

This is a front-end demo — "Add to cart" and the newsletter form show
confirmation states but don't hit a real backend yet. Wire them up to your
payment provider and email service when you're ready to go live.
