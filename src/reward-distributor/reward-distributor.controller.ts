import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  RewardRequest,
  RewardsRequest,
  SubscriberIdentifier,
} from 'src/proto/generated/distribute_reward';
import { RewardDistributorService } from './reward-distributor.service';

@Controller('reward-distributor')
export class RewardDistributorController {
  constructor(
    private readonly rewardDistributorService: RewardDistributorService,
  ) {}

  /* eslint-disable @typescript-eslint/no-unused-vars */
  @GrpcMethod('DistributeReward', 'DistributeRewardRequest')
  async distributeRewardRequest(
    data: RewardRequest,
    _metadata: Metadata,
    _call: ServerUnaryCall<any, any>,
  ) {
    return this.rewardDistributorService.distributeRewardRequest(data);
  }

  @GrpcMethod('DistributeReward', 'DistributeRewardsRequest')
  async distributeRewardsRequest(
    data: RewardsRequest,
    _metadata: Metadata,
    _call: ServerUnaryCall<any, any>,
  ) {
    return this.rewardDistributorService.distributeRewardsRequest(data);
  }

  @GrpcMethod('DistributeReward', 'DistributeRewardResponse')
  distributeRewardResponse(
    data: SubscriberIdentifier,
    _metadata: Metadata,
    _call: ServerUnaryCall<any, any>,
  ) {
    return this.rewardDistributorService.distributeRewardResponse(data);
  }

  @GrpcMethod('DistributeReward', 'DistributeRewardsResponse')
  distributeRewardsResponse(
    data: SubscriberIdentifier,
    _metadata: Metadata,
    _call: ServerUnaryCall<any, any>,
  ) {
    return this.rewardDistributorService.distributeRewardsResponse(data);
  }
}
