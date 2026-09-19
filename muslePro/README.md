💪 IronFuel — Protein & Sports Nutrition Store
IronFuel is a fast, dark-themed e-commerce website for whey, isolate, mass gainers and protein bars. The project combines a bold, performance-focused user interface with Ethereum blockchain integration to provide a Web3-based payment experience through MetaMask.

The application is built using vanilla JavaScript and Vite, with hand-written CSS used for styling and Ethers.js used to communicate with the Ethereum blockchain.

✨ Features
🛍️ Modern E-Commerce Interface
Bold, dark, performance-driven UI
Responsive layout for different screen sizes
Hero section with a live "macro readout" panel
Category-based product browsing
Bestsellers / featured products section
Scrolling ticker of product highlights

👟 Product Categories
Whey Concentrate
Isolate
Mass Gainer
Bars & Snacks

🦊 MetaMask Integration
MetaMask wallet detection
Wallet connection request
Connected wallet address display
Account-based blockchain interaction

⛓️ Ethereum Blockchain Transactions
Users can:

Connect their MetaMask wallet.
Click Pay with MetaMask.
Confirm the transaction in MetaMask.
Submit an Ethereum transaction.
View the transaction on a blockchain explorer.

☁️ Configurable Storefront
The site pulls its name, tagline, contact details, currency symbol and checkout amount from a `.env` file, so the whole storefront can be rebranded without touching the code.

🛠️ Technologies Used
Frontend
JavaScript (vanilla)
Vite
HTML5
CSS3

Blockchain
Ethereum
MetaMask
Ethers.js
Sepolia Test Network

Development Tools
Visual Studio Code
Git
GitHub
npm

📂 Project Structure
```
ironfuel/
│
├── src/
│   ├── blockchain/
│   │   ├── wallet.js
│   │   └── transaction.js
│   ├── main.js
│   └── style.css
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── vite.config.js
```

🚀 Getting Started
1. Clone the Repository
```
git clone https://github.com/your-username/ironfuel.git
```
2. Navigate to the Project
```
cd ironfuel
```
3. Install Dependencies
```
npm install
```
4. Configure Environment Variables
```
cp .env.example .env   # then fill in your own values
```
5. Start the Development Server
```
npm run dev
```
The application will be available at the local development URL provided by Vite, usually:

http://localhost:5173

⚙️ Configuration (.env)
Copy `.env.example` to `.env` and fill in your details — this file is git-ignored so your real values never get committed. All variables are optional; sensible defaults are used if left blank.

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
| `VITE_STORE_WALLET_ADDRESS` | Wallet that receives checkout payments |
| `VITE_CHAIN_ID_HEX` | Network MetaMask must be on (`0xaa36a7` = Sepolia) |
| `VITE_CHAIN_RPC_URL` / `VITE_CHAIN_EXPLORER_URL` | Used if MetaMask needs to add the network |
| `VITE_CHECKOUT_AMOUNT_ETH` | Flat amount sent per checkout click |

> Only variables prefixed `VITE_` are exposed to the browser — that's a Vite
> requirement, and it's also why you should never put secret/private keys here.
> Publishable/public values only.

🦊 MetaMask Setup
To use the blockchain functionality:

Install the MetaMask browser extension.
Select the Sepolia Test Network.
Open the application.
Click Connect Wallet.
Approve the wallet connection in MetaMask.
Click Pay with MetaMask → to initiate a test transaction.
Confirm the transaction in MetaMask.
View the transaction on the Sepolia blockchain explorer.

⛓️ Blockchain Flow
```
User
  │
  ▼
IronFuel Website
  │
  ▼
Click "Connect Wallet"
  │
  ▼
MetaMask Connection
  │
  ▼
Connected Ethereum Wallet
  │
  ▼
Click "Pay with MetaMask"
  │
  ▼
MetaMask Transaction Confirmation
  │
  ▼
Ethereum / Sepolia Network
  │
  ▼
Transaction Hash
  │
  ▼
Blockchain Explorer
```

💳 Payment Testing
This project is intended for blockchain development and testing.

The application uses the Ethereum Sepolia test network for testing transactions.

Do not use real funds for testing.

Users should use test ETH obtained through an appropriate Sepolia faucet.

🔐 Security
This project is intended as a learning and demonstration project.

Important security practices
Never upload private keys to GitHub.
Never upload seed phrases or recovery phrases.
Never commit .env files containing secrets.
Never expose sensitive wallet credentials.
Use test networks while developing blockchain functionality.

Example .gitignore entries:
```
node_modules/
dist/
.env
.env.local
.vscode/
.DS_Store
```

🎨 UI Highlights
The website focuses on a bold, performance-oriented design with:

Dark theme with high-contrast accents
Live macro readout panel
Scrolling stat ticker
Large product visuals
Responsive sections
Straight-talking, macro-first copy
Interactive buttons
Modern condensed typography

📱 Responsive Design
The interface is designed to work across:

💻 Desktop
🖥️ Large screens
📱 Mobile devices
📟 Tablet devices

Responsive layouts are implemented using hand-written CSS.

🛒 Editing Products
Products live in the `PRODUCTS` array at the top of `src/main.js`. Add, remove, or edit entries — each needs a `name`, `flavor`, `protein` (g), `serving` (g), `price`, `tag`, and an accent `color`.

🔮 Future Improvements
Possible future enhancements include:

🛒 Shopping cart functionality
💰 Dynamic product pricing
⛓️ Product-specific blockchain payments
📦 Blockchain-based order tracking
🔐 Wallet-based user authentication
🧾 Digital transaction receipts
📊 Order history
🖼️ NFT-based product certificates
🔔 Transaction status notifications
🗄️ Backend and database integration
🚀 Production deployment
💳 Multiple cryptocurrency payment options

🧪 Development
Production Build
```
npm run build
```
Preview Production Build
```
npm run preview
```

📜 Available Scripts
| Command | Description |
|---|---|
| `npm install` | Install project dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run preview` | Preview the production build |

🌐 Blockchain Network
Development Network
Ethereum Sepolia Testnet

Blockchain Explorer
https://sepolia.etherscan.io

Transaction hashes generated during testing can be searched on the Sepolia explorer.

⚠️ Disclaimer
This project is created for educational and demonstration purposes.

Blockchain transactions performed during development should use testnet assets only.

This project is not intended to process real-money payments without additional security, backend validation, transaction verification, and production-level infrastructure.

📄 License
This project is available for educational and demonstration purposes.

You may modify and extend the project according to your requirements.
