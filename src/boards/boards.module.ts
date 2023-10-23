import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { BoardRepository } from './board.repository';
import { Board } from './board.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Board]), AuthModule], // TypeORM과 연동하기 위해 사용되는 모듈
  controllers: [BoardsController], // 컨트롤러를 등록합니다.
  providers: [BoardsService, BoardRepository], // 서비스와 저장소(repository)를 등록합니다.
})
export class BoardsModule {}
