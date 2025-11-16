import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { RedisUtil } from 'src/utils/redis.util';
import { OtpUtil } from 'src/utils/otp.util';
import * as bcrypt from 'bcryptjs';
import { UserCreateProducer } from '../events/producers/auth.producer';
import { VerifyUserDto } from './dto/verifuUser.dto';
import { firstValueFrom } from 'rxjs';
import { VERIFY } from 'src/constants';
import { UserRequest } from './types/user';

@Injectable()
export class AuthService {
  constructor(
    private readonly redisUtil: RedisUtil,
    private readonly otpUtil: OtpUtil,
    private readonly producer: UserCreateProducer,
  ) {}

  async create(createAuthDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(createAuthDto.password, 10);

      this.producer.publish({ ...createAuthDto, password: hashedPassword });

    const otp = this.otpUtil.generateOtp();

    await this.redisUtil.setValue(`${VERIFY}:${createAuthDto.email}`, otp, 300);
  }

  async verifyUser(userData: VerifyUserDto) {
    const found = (await firstValueFrom(
      this.producer.sendUserEmail(userData.email),
    )) as UserRequest;

    if (!found) {
      throw new BadRequestException('there is no user =user with this email');
    }

    const correctOtp = await this.redisUtil.getValue(
      `${'VERIFY'}:${found.email}`,
    );

    console.log('corect otp: ', correctOtp);
    console.log('found : ', found.email);

    if (!correctOtp || Number(correctOtp) != Number(userData.otp)) {
      throw new BadRequestException('incorrect otp');
    }

    await this.redisUtil.deleteValue(`${VERIFY}:${found.email}`);

    return found;
  }
}
