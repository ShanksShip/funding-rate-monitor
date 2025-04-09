# Funding Rate Strategy Monitoring System

A web application for monitoring cryptocurrency funding rates, premiums, and open interest to identify potential trading opportunities. This application is built using Next.js, TypeScript, and TailwindCSS, and can be deployed to Vercel or GitHub Pages.

## Features

- Real-time monitoring of cryptocurrency funding rates
- Visualization of price premiums and open interest
- Statistics dashboard for identifying highest/lowest funding rates
- Historical data for trend analysis
- Simple and elegant UI
- Client-side only, no backend required
- Persistent storage using localStorage

## Getting Started

### Prerequisites

- Node.js 14+ and npm/yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/username/funding-rate-strategy-monitoring-system.git
   cd funding-rate-strategy-monitoring-system
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

### Deploy to Vercel

The easiest way to deploy this application is using Vercel:

1. Push your code to a GitHub repository
2. Connect to Vercel
3. Import your repository
4. Vercel will automatically detect Next.js and deploy your application

### Deploy to GitHub Pages

To deploy to GitHub Pages:

1. Update the `next.config.js` file:
   ```js
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     reactStrictMode: true,
     swcMinify: true,
     basePath: '/repo-name',
     assetPrefix: '/repo-name',
     images: {
       unoptimized: true,
     },
   }

   module.exports = nextConfig
   ```

2. Add a GitHub workflow for deployment:
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [main]

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v3

         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: 16

         - name: Install dependencies
           run: npm ci

         - name: Build and Export
           run: npm run build && npm run export

         - name: Deploy to GitHub Pages
           uses: JamesIves/github-pages-deploy-action@4.1.5
           with:
             branch: gh-pages
             folder: out
   ```

3. Push your changes and GitHub Actions will handle the deployment

## Project Structure

```
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── charts/      # Chart components
│   │   ├── layout/      # Layout components
│   │   └── ui/          # UI components
│   ├── pages/           # Next.js pages
│   ├── services/        # API services
│   ├── store/           # State management
│   ├── styles/          # Global styles
│   ├── types/           # TypeScript types
│   └── utils/           # Utility functions
├── next.config.js       # Next.js configuration
├── package.json         # Dependencies
├── tailwind.config.js   # Tailwind configuration
└── tsconfig.json        # TypeScript configuration
```

## How It Works

The application connects directly to the Binance API from the client side to fetch:

1. Spot and futures prices to calculate premiums
2. Funding rates for perpetual contracts
3. Open interest data to gauge market sentiment

All data is stored in the client's localStorage, allowing for persistence between sessions without the need for a backend server.

## Trading Strategies

The application is designed to help identify opportunities for:

1. **Cash and Carry:** Going long on spot and short on futures when funding rates are positive
2. **Reverse Cash and Carry:** Going short on spot and long on futures when funding rates are negative
3. **Funding Rate Arbitrage:** Taking advantage of funding rate differences between different assets

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This application is for informational purposes only and does not constitute financial advice. Trading cryptocurrency derivatives involves significant risk. Always do your own research before making investment decisions.
