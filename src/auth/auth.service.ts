import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private UserRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.UserRepository.createUser(authCredentialsDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;

    // 1. UserRepository를 통해 사용자 이름이 username과 일치하는 사용자의 데이터를 데이터베이스에서 찾는다.
    const user = await this.UserRepository.findOne({
      where: { username: username },
    });

    //                                  입력값,    db값
    if (user && (await bcrypt.compare(password, user.password))) {
      // 유저 토큰 생성 ( Secret +  Payload )
      const paylaod = { username }; // 중요 정보는 제외
      const accessToken = await this.jwtService.sign(paylaod);

      return { accessToken };
    } else {
      throw new UnauthorizedException('login failed');
    }
  }
}
