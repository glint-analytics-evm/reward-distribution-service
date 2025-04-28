import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ContractModule } from './contract/contract.module';
import { RewardDistributorModule } from './reward-distributor/reward-distributor.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ContractModule,
    RewardDistributorModule,
  ],
})
export class AppModule {}
