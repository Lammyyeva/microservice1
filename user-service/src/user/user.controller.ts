import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { UserCreatePayload } from 'src/types/user';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @EventPattern('create-user')
  async handleCreateUser(@Payload() userData: UserCreatePayload) {
    console.log('events got');

    await this.usersService.create(userData);
  }

  @MessagePattern('find.user.by.email')
  async getUser(@Payload() data: { email: string }) {
    console.log('user emails: ', data.email);
    console.log('events got: ', data.email);

    return await this.usersService.findOne(data.email);
  }
}
