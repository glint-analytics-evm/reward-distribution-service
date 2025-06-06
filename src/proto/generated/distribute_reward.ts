/* eslint-disable */
import { Observable } from 'rxjs';

export const protobufPackage = 'distribute_reward';

export interface RewardRequest {
  /** address of the reward recipient */
  recipient: string;
  /** amount of the reward (it is string because it will be converted to bigint) */
  amount: string;
}

export interface RewardsRequest {
  /** addresses of the reward recipients */
  recipients: string[];
  /** amounts of the reward (it is string because it will be converted to bigint) */
  amounts: string[];
}

export interface RequestResponse {
  /** id of the request (generated by the server)(if successful) */
  id?: string | undefined;
  /** error message (if not successful) */
  error?: string | undefined;
}

export interface RewardResponse {
  /** RequestResponse's id */
  id: string;
  /** transaction hash (if successful) */
  txHash?: string | undefined;
  /** error message (if not successful) */
  error?: string | undefined;
}

export interface SubscriberIdentifier {
  /** identifier for gRPC client (use uuid preferably) */
  id: string;
}

export interface DistributeReward {
  /** DistributeRewardRequest is used to distribute reward to a single recipient */
  DistributeRewardRequest(request: RewardRequest): Promise<RequestResponse>;
  /** DistributeRewardsRequest is used to distribute rewards to multiple recipients */
  DistributeRewardsRequest(request: RewardsRequest): Promise<RequestResponse>;
  /** DistributeRewardResponse is used to stream reward responses for DistributeRewardRequest */
  DistributeRewardResponse(
    request: SubscriberIdentifier,
  ): Observable<RewardResponse>;
  /** DistributeRewardsResponse is used to stream reward responses for DistributeRewardsRequest */
  DistributeRewardsResponse(
    request: SubscriberIdentifier,
  ): Observable<RewardResponse>;
}
