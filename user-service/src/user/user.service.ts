import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { UserCreatePayload } from 'src/types/user';

@Injectable()
export class UserService {
  constructor(@InjectRepository(Users) private userRepo: Repository<Users>) {}

  private async validateRegister(data: UserCreatePayload) {
    const found = await this.userRepo.findOneBy({ email: data.email });

    if (found) {
      throw new NotFoundException(
        'user with this email address has already been registered',
      );
    }
  }

  async create(createAuthDto: UserCreatePayload) {
    await this.validateRegister(createAuthDto);
    console.log('hello please please save');
    
    return await this.userRepo.save(createAuthDto);
}

  async findOne(email: string) {
    console.log('repos email', email);
    
    const user = await this.userRepo.findOneBy({ email: email });

    console.log('please ', user);
    

    return user ?? null;
  }

}
