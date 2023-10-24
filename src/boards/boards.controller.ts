import { AuthGuard } from '@nestjs/passport';
import { Logger, UseGuards } from '@nestjs/common';
/* eslint-disable @typescript-eslint/no-unused-vars */

import { BoardsService } from './boards.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';
import { Board } from './board.entity';
import { BoardStatus } from './board-status.enum';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('boards')
@UseGuards(AuthGuard())
export class BoardsController {
  private logger = new Logger('BoardsController'); // <- log 보이게 SET, 'BoardsController' 네임 변경 가능

  constructor(private BoardsService: BoardsService) {}

  @Get('/')
  getAllBoard(@GetUser() user: User): Promise<Board[]> {
    this.logger.verbose(`💥 User ${user.username} trying to get all boards`);
    return this.BoardsService.getAllBoards(user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @GetUser() user: User,
  ): Promise<Board> {
    this.logger.verbose(
      `💥 User ${user.username} creating a new board. Payload: ${JSON.stringify(
        createBoardDto,
      )}`,
    );
    return this.BoardsService.createBoard(createBoardDto, user);
  }

  @Get('/:id')
  getBoardById(@Param('id') id: number): Promise<Board> {
    return this.BoardsService.getBoardById(id);
  }

  @Delete('/:id')
  deleteBoard(
    @Param('id', ParseIntPipe) id,
    @GetUser() user: User,
  ): Promise<void> {
    return this.BoardsService.deleteBoard(id, user);
  }

  @Patch('/:id/status')
  updateBoardStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', BoardStatusValidationPipe) status: BoardStatus,
    @GetUser() user: User,
  ) {
    return this.BoardsService.updateBoardStatus(id, status, user);
  }

  // @Get('/')
  // getAllBoard(): Board[] {
  //   return this.BoardsService.getAllBoard();
  // }

  // @Post()
  // @UsePipes(ValidationPipe) // [PIPE] 유효성 검사 SET
  // createBoard(@Body() createBoardDto: CreateBoardDto): Board {
  //   return this.BoardsService.createBoard(createBoardDto);
  // }

  // // 파라미터 여러개 일때 가져오기
  // // http://localhost:3000/boards?id=123&text=ttt
  // // (@Param() params: string[])

  // // 파라미터 1개 일때 가져오기
  // //http://localhost:3000/boards?id=9ea86b90-6be3-11ee-af75-d94506baf599

  // @Get('/:id')
  // getBoardById(@Param('id') id: string): Board {
  //   return this.BoardsService.getBoardById(id);
  // }

  // @Delete('/:id')
  // deleteBoard(@Param('id') id: string): void {
  //   this.BoardsService.deleteBoard(id);
  // }

  // @Patch('/:id/status')
  // updateBoardStatus(
  //   @Param('id') id: string,
  //   @Body('status', BoardStatusValidationPipe) status: BoardStatus, // [ 커스텀 PIPE ] 유효성 검사 SET
  // ) {
  //   return this.BoardsService.updateBoardStatus(id, status);
  // }
}
