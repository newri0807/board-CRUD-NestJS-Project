import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private UserRepository: UserRepository) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.UserRepository.createUser(authCredentialsDto);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;

    // 1. UserRepository를 통해 사용자 이름이 username과 일치하는 사용자의 데이터를 데이터베이스에서 찾는다.
    const user = await this.UserRepository.findOne({
      where: { username: username },
    });

    //                                  입력값,    db값
    if (user && (await bcrypt.compare(password, user.password))) {
      return 'login success';
    } else {
      throw new UnauthorizedException('login failed');
    }
  }
}
