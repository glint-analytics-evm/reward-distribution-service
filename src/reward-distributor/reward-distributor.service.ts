import { Injectable, Logger } from '@nestjs/common';
import { AddressLike, BigNumberish, ethers } from 'ethers';
import { Observable, Subject, concatMap, tap } from 'rxjs';
import { randomUUID } from 'src/common/utils';
import { ContractService } from 'src/contract/contract.service';
import { RewardDistribution__factory } from 'src/generated-contract-types';
import {
  RequestResponse,
  RewardRequest,
  RewardResponse,
  RewardsRequest,
  SubscriberIdentifier,
} from 'src/proto/generated/distribute_reward';

const MAX_RECIPIENTS = 50;

type RequestType = {
  id: string;
  type: 'reward' | 'rewards';
  request: RewardRequest | RewardsRequest;
};

@Injectable()
export class RewardDistributorService {
  constructor(private contractService: ContractService) {
    this.$processes.subscribe((response) => {
      this.logger.debug('🚀 ~ process ~ response:', response);
      switch (response.request.type) {
        case 'reward':
          this.$rewardResponse.next(response.response);
          break;
        case 'rewards':
          this.$rewardsResponse.next(response.response);
          break;
      }
    });
  }

  private readonly logger = new Logger(RewardDistributorService.name);

  private $requests: Subject<RequestType> = new Subject();
  private requests = this.$requests
    .asObservable()
    .pipe(
      tap((request) => this.logger.debug('🚀 ~ requests ~ request:', request)),
    );

  private $processes = this.requests.pipe(
    concatMap((request) => this.processRequest(request)),
  );

  private $rewardResponse = new Subject<RewardResponse>();
  private rewardResponse = this.$rewardResponse.asObservable();

  private $rewardsResponse = new Subject<RewardResponse>();
  private rewardsResponse = this.$rewardsResponse.asObservable();

  async distributeRewardRequest(
    request: RewardRequest,
  ): Promise<RequestResponse> {
    if (!ethers.isAddress(request.recipient))
      return {
        error: 'Invalid address',
      };
    if (!this.isStringBigInt(request.amount))
      return {
        error: 'Invalid amount',
      };

    const requestId = this.generateRequestId('reward_request');

    this.pushRequestToStream({ id: requestId, type: 'reward', request });

    return {
      id: requestId,
    };
  }

  async distributeRewardsRequest(
    request: RewardsRequest,
  ): Promise<RequestResponse> {
    if (request.recipients.some((address) => !ethers.isAddress(address)))
      return {
        error: 'Invalid address',
      };
    if (request.amounts.some((amount) => !this.isStringBigInt(amount)))
      return {
        error: 'Invalid amount',
      };
    if (request.recipients.length !== request.amounts.length)
      return {
        error: 'Recipients and amounts length mismatch',
      };
    if (request.recipients.length > MAX_RECIPIENTS)
      return {
        error: `Max recipient amount is ${MAX_RECIPIENTS}`,
      };

    const requestId = this.generateRequestId('rewards_request');

    this.pushRequestToStream({ id: requestId, type: 'rewards', request });

    return {
      id: requestId,
    };
  }

  distributeRewardResponse(
    subscriberIdentifier: SubscriberIdentifier,
  ): Observable<RewardResponse> {
    this.logger.debug(
      '🚀 ~ distributeRewardResponse ~ subscription started with id:',
      subscriberIdentifier.id,
    );

    return this.rewardResponse;
  }

  distributeRewardsResponse(
    subscriberIdentifier: SubscriberIdentifier,
  ): Observable<RewardResponse> {
    this.logger.debug(
      '🚀 ~ distributeRewardResponse ~ subscription started with id:',
      subscriberIdentifier.id,
    );

    return this.rewardsResponse;
  }

  private generateRequestId(prefix: string): string {
    return `${prefix}-${randomUUID()}`;
  }

  private isStringBigInt(value: string): boolean {
    try {
      BigInt(value);
      return true;
    } catch {
      return false;
    }
  }

  private pushRequestToStream(request: RequestType) {
    this.$requests.next(request);
  }

  private async processRequest(
    request: RequestType,
  ): Promise<{ request: RequestType; response: RewardResponse }> {
    try {
      const receipt = await this.getReceiptPromise(request);

      return {
        request,
        response: {
          id: request.id,
          txHash: receipt.hash,
        },
      };
    } catch (error) {
      return {
        request,
        response: this.handleProcessRequestError(error, request),
      };
    }
  }

  private getReceiptPromise(
    request: RequestType,
  ): Promise<ethers.ContractTransactionReceipt> {
    switch (request.type) {
      case 'reward':
        const { recipient, amount } = request.request as RewardRequest;
        return this.contractDistributeReward(recipient, amount);
      case 'rewards':
        const { recipients, amounts } = request.request as RewardsRequest;
        return this.contractDistributeRewards(recipients, amounts);
    }
  }

  private handleProcessRequestError(error: any, request: RequestType) {
    this.logger.error('🚀 ~ processPayRequest ~ error:', error);

    let errorString = error.message;
    if (error.data) {
      try {
        const possibleError =
          RewardDistribution__factory.createInterface().parseError(error.data);
        if (possibleError) errorString = possibleError.signature;
      } catch (_) {}
    }

    return {
      id: request.id,
      error: errorString,
    };
  }

  private async contractDistributeRewards(
    recipients: AddressLike[],
    amounts: BigNumberish[],
  ) {
    const contract = this.contractService.getRewardContractRPC();

    const tx = await contract.distributeRewards(recipients, amounts);

    return await tx.wait();
  }

  private async contractDistributeReward(
    recipient: AddressLike,
    amount: BigNumberish,
  ) {
    const contract = this.contractService.getRewardContractRPC();

    const tx = await contract.distributeReward(recipient, amount);

    return await tx.wait();
  }
}
