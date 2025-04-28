import { Module } from '@nestjs/common';
import { ContractModule } from 'src/contract/contract.module';
import { RewardDistributorController } from './reward-distributor.controller';
import { RewardDistributorService } from './reward-distributor.service';

@Module({
  imports: [ContractModule],
  providers: [RewardDistributorService],
  controllers: [RewardDistributorController],
})
export class RewardDistributorModule {}
