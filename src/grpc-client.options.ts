import { ServerCredentials } from '@grpc/grpc-js';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcClientOptions: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'distribute_reward',
    protoPath: join(__dirname, 'proto/distribute_reward.proto'),
    credentials: ServerCredentials.createInsecure(),
  },
};
