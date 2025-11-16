import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { OtpUtil } from 'src/utils/otp.util';
import { RedisUtil } from 'src/utils/redis.util';
import { ClientsModule } from '@nestjs/microservices';
import { kafkaConfig } from 'src/config/kafka.config';
import { UserCreateProducer } from '../events/producers/auth.producer';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        ...kafkaConfig,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, OtpUtil, RedisUtil, UserCreateProducer], 
})
export class AuthModule {}
