import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { VerifyUserDto } from 'src/auth/dto/verifuUser.dto';

@Injectable()
export class UserCreateProducer {
  constructor(@Inject('USER_SERVICE') private userClient: ClientKafka) {}

  async onModuleInit() {
    this.userClient.subscribeToResponseOf('find.user.by.email');
    await this.userClient.connect();
  }

   publish(data: RegisterDto) {
    console.log('message was sent');

    this.userClient.emit('create-user', data);
  }


  sendUserEmail(email: string) {
    console.log(' problem; ', email);

    return this.userClient.send('find.user.by.email', { email });
  }
}
