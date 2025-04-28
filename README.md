# GLNT Reward Distribution Service

This service enables reward distribution functionality to a specified address/addresses and amount/amounts via gRPC. It communicates with [Reward Distribution Contract](https://github.com/blockscope-ai/glnt-reward-distribution-contract) to send the rewards.

## Installation

```bash
$ yarn
```

## Modules

### Contract Module

The Contract Module is the backbone of blockchain communication. It retrieves contract addresses from the `config.json` file and creates RPC connection with [Reward Distribution Contract](https://github.com/blockscope-ai/glnt-reward-distribution-contract). Additionally, it exports the contract connection for other services to use.

### Reward Distributor Module

This module is used to distribute rewards to the user with the usage of [Reward Distribution Contract](https://github.com/blockscope-ai/glnt-reward-distribution-contract). It has controller so it can be connected through gRPC. It functions based on the observer pattern. Essentially, the client sends a request to the service, which then responds with a unique ID for that request. Concurrently, the service processes the request and dispatches the processed request with its corresponding ID through gRPC. Available gRPC proto file is [here](https://github.com/blockscope-ai/glnt-reward-distribution-service/blob/main/src/proto/distribute_reward.proto).

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```
