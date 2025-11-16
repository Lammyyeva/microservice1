import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { UserCreatePayload } from 'src/types/user';
import { UserService } from 'src/user/user.service';

export class UserConsumer {
  constructor(private readonly usersService: UserService) {}

  //cho to bu usul bolmady!!!!! 
  // bulary controllerde goymasan, bu fayl message' y receive edip bilenok eken eger -de hokman controller faylda dalde sunda saklat diyilse @Controller 
  // goysanam bolya eken. karoce su faylda message' lary receive etjek bolsan bolanok @Controller goyup munam conrtroller etmeli bolya. Yadyndan chykarma!!

  @EventPattern('create-user')
   async handleCreateUser(@Payload() userData: UserCreatePayload) {
    console.log('pleaseeeee receive events');
    
   await this.usersService.create(userData);
  }
    
  @MessagePattern('find.user.by.email')
  getUser(@Payload() data: { email: string }) {
    console.log('pleaseeeee receive message');

    return this.usersService.findOne(data.email);
  }
}
