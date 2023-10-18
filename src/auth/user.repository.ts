import { DataSource, EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  constructor(@InjectRepository(User) private dataSource: DataSource) {
    super(User, dataSource.manager);
  }

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    //비밀번호 암호화하기
    const salt = await bcrypt.genSalt();
    const hasedPassword = await bcrypt.hash(password, salt);

    const user = this.create({ username, password: hasedPassword });

    //이미 있는 유저를 다시 생성하려 하면 에러 던져주기
    // error.code 23305 ?
    // 이 코드는 PostgreSQL 데이터베이스에서 unique constraint violation을 나타냅니다.
    // 즉, 이미 존재하는 사용자 이름이 있음을 나타낼 수 있습니다.
    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23305') {
        throw new ConflictException('Existing username');
      } else {
        console.log('error', error);
      }
    }
  }
}
