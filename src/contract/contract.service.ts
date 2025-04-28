import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { readJsonSync } from 'fs-extra';
import { ServiceError } from 'src/common/ServiceError';
import { RewardDistribution__factory } from 'src/generated-contract-types';

type ChainConfig = {
  chainId: number;
  rpcUrl: string;
  rewardContractAddress: string;
};

type ContractServiceErrorTypes = 'InvalidConfig';
export class ContractServiceError extends ServiceError<ContractServiceErrorTypes> {}

@Injectable()
export class ContractService {
  getRewardContractRPC() {
    const config = this.getChainConfig();

    const provider = new ethers.JsonRpcProvider(config.rpcUrl);
    const wallet = new ethers.Wallet(
      process.env.REWARD_SENDER_PRIVATE_KEY,
      provider,
    );

    return RewardDistribution__factory.connect(
      config.rewardContractAddress,
      wallet,
    );
  }

  private getChainConfig(): ChainConfig {
    const config: ChainConfig = readJsonSync('./config.json');

    if (Number(config.chainId) <= 0)
      throw new ContractServiceError('InvalidConfig', 'Invalid chain ID');

    if (String(config.rpcUrl).trim().length === 0)
      throw new ContractServiceError('InvalidConfig', 'Invalid RPC URL');

    if (!ethers.isAddress(config.rewardContractAddress))
      throw new ContractServiceError(
        'InvalidConfig',
        'Invalid reward contract address',
      );

    return config;
  }
}
