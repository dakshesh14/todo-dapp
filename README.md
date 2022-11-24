## Web3 based todo web app

This is a simple todo web app built using next.js and solidity. It is a simple todo app that allows you to add, delete and mark tasks as complete. It uses the metamask extension to connect to the ethereum blockchain.

My main aim was to get a better understanding of how make dapp using solidity. Altho I made this project for learning purposes, I still wanted to make it look good and be functional. I used next.js for the frontend and solidity for the smart contract. I used the truffle framework to compile and deploy the smart contract to the ethereum blockchain. I used the ethers library to interact with the smart contract.

We have proper mutations and queries to interact with the smart contract. We also have a subscription to listen for events emitted by the smart contract.

## How to run

1. Clone the repo.
2. Go to client & contract folders and run `npm install` or `yarn`. This will install all the dependencies.
3. Go to the contract folder and run `truffle develop` to start the truffle development console.
4. In the truffle console, run `migrate` to deploy the smart contract to the blockchain.
5. Migrating will create a build folder in the contract folder.
6. Go to the client folder and run `npm run dev` or `yarn dev`. This will start the next.js development server.
7. Go to `localhost:3000` to view the app.
8. Make sure you have metamask installed and connected to the test network.
9. You can add, delete and mark tasks as complete.

> **Note**
> You might get an error when running command `truffle develop` if you get an error run command `node_modules/.bin/truffle develop` instead.

## Preview

![preview]("https://github.com/dakshesh14/todo-dapp/blob/main/public/preview.gif?raw=true")

> **Note**
> Preview window is zoomed in. And the metamask extension is not visible. So, when I am interacting with meta mask, it is not visible in the preview. But it does not means mutation is slow.

## Final Words

I hope you liked the project. If you have any suggestions or improvements, feel free to open an issue or a pull request. I would love to hear your feedback.

## Acknowledgements

- [Truffle](https://www.trufflesuite.com/)
- [Next.js](https://nextjs.org/)
- [Solidity](https://soliditylang.org/)
- [Ethers.js](https://docs.ethers.io/v5/)
- [Metamask](https://metamask.io/)

## Contact

If you want to contact me you can reach me at

- [Linkedin](https://www.linkedin.com/in/dakshesh-jain/)
