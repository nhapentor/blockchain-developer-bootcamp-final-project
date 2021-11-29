# [PoC] Blockchain-based Employee Incentivization Platform

A platform for companies to build employee engagement programes with the use of blockchain technology. 

The platform allows companies to incentivize employees for their contributions as rewarded tokens which can be given from both top-down and peer-to-peer to encourage social connection between employees.

With the token-based reward points, it gives more flexibility for employees to manage their rewards e.g. redemption for company-provided benefits, spending on platform’s marketplace, giving away to others or even exchanging for cash.

## Demo

**Notes:**

1. The demo contracts deployed on **_Rinkeby Test Network_** and make use of <a href="https://docs.opengsn.org/contracts/addresses.html#gsn-deployment-addresses" target="_blank">Ethereum Gas Station Network (GSN)</a>.
2. To interact with the demo dApps using _MetaMask_, users don't have to pay for any gas but it requires to have the Ether balance in the users' accounts though.
3. Due to the _GSN_ architecture, the users' transactions are forwarded to the <a href="https://relays.opengsn.org/" target="_blank">Relay Servers</a>, therefore it takes quite long to transact the requests. _Please be patien_ :)

**URL:** 
https://employee-engagement.sslabs.sh

**Screencast URL:** 
https://1drv.ms/v/s!Ah7Zl_7cgemrjsUt8HAbYJL-yL9oMQ?e=M023f2

### Simple Workflow
1. Enter the service platform
2. Login with Metamask
3. If there is no data for the logged-in MetaMask account before, the frontend asks to fill profile information
4. After complete filling the profile, the platform reward 10 XABER utility token
5. Users can use the XABER token on the service platform by   
- Start a new disucssion on a topic and giveaway the certain amount of the token as a reward to the for selected reply (think of stackoverflow's approved answer).
- Transfer the token to other users in the system for gratitudes
- Redeem the token for NFT badges 

## Local Development Environment

### Prerequisites

- Node.js >= v14.18.1
- Yarn v1.22.17
- Truffle v5.4.22
- Ganache CLI v6.12.2
- Truffle and Ganache

### Directory Structure

1. `client`: Next.js web frontend.
2. `contracts`: Solidity Smart Contracts.
3. `migrations`: Migration files for truffle to deploy smart contracts to an Ethereum network.
3. `test`: Unittests for smart contracts.
4. `build`: The directory for smart contracts' artifacts after compiling and from _GSN_

### Smart Contracts and GSN

To avoid issues, please follow the steps accordingly as some steps are depent on the prior ones.

1. Change directory to the root of the project then run `yarn install` to install dependencies
2. Spin up local Ethereum network, due to some constraints, the `networkId` and `chainId` arguments must be supplied with `1337`
```
npx ganache-cli --networkId 1337 --chainId 1337 --port 8545
```
3. Rename the `.env.example` file in the project's root directory to `.env` and populated the `MNEMONIC` value with _ganace-cli_ generated one
```
MNEMONIC=your mnemonic here
RINKEBY_ENDPOINT_URL=https://rinkeby.infura.io/v3/your_infura_project_secret_here
RINKEBY_TRUSTED_FORWARDER_ADDRESS=0x83A54884bE4657706785D7309cf46B58FE5f6e8a
```
- This `MNEMONIC` is used when deploying smart contracts, therefore to deploy on _Rinkeby Test Network_, the account from the `MNEMONIC` must have enough test Ether
- `RINKEBY_ENDPOINT_URL` is the endpoint for `HDWalletProvider`, it's required to connect to _Rinkeby Test Network_ when deploying smart contracts
- Leave `RINKEBY_TRUSTED_FORWARDER_ADDRESS` as is, it's required to deploy the smart contracts to _Rinkeby Test Network_

4. Still in the project's root directory, run `yarn gsn` to build and deploy _GSN-related smart contracts_ on the _ganace_cli's local network_ and start _GSN's relay server_
5. In the project's root directory, run `truffle compile --all` to compile the smart contracts
6. In the project's root directory, run `truffle test` for smart contracts' unittests
7. In the project's root directory, run `truffle migrate --reset` to deploy smart contracts to  _ganace-cli local network_

### Frontend

1. Change directory to the `client` under project's root directory
2. Run `yarn install` to install dependencies
3. Run `yarn dev` to start frontend local dev server
4. Or run `yarn build` then `yarn start` to build and run the frontend
5. Open a browser to `http://localhost:3000`
6. On _MetaMask_ make sure to connect to `Localhost 8545` network with `chainId` and `networkId` as `1337`
7. The frontend requires environment variables from the `.env` file
```
NEXT_PUBLIC_STRAPI_BACKEND=https://employee-engagement.sslabs.sh:1337
NEXT_PUBLIC_RINKEBY_PAYMASTER_ADDRESS=0xB0B8452a4fa8E58b318001A49D035C8689FaB083
NEXT_PUBLIC_RINKEBY_GSN_RELAYER=https://rk22-relayer​.sslabs​.sh/gsn1
```
- `NEXT_PUBLIC_STRAPI_BACKEND` is the backend required both running locally or test network, e.g. store data off-chain as well as images. The pre-configured here should work with every environment
- `NEXT_PUBLIC_RINKEBY_PAYMASTER_ADDRESS` is the address of _GSN's paymaster_ contract which take responsibilities to pay gas fees instead of users
- `NEXT_PUBLIC_RINKEBY_GSN_RELAYER` is the _GSN relay server_ setup for _Rinkeby_Test_Network_, it can be leave as is

## My Public Ethereum Wallet for Certification:

If eligible, please send the certification to this Ethereum EOA address 
```0x68037F970eDf769FC29c9916ceE34a2255CafF50```

## Future Features

- More engagement activities to earn token
- Apply more gamifications, e.g. ranking system, to drive engagement
- Search and view and interact with other users for encourage social connection
- More...
