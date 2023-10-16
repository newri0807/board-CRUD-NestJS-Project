/* eslint-disable @typescript-eslint/no-unused-vars */
import { Board, BoardStatus } from './board.model';
import { BoardsService } from './boards.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';

@Controller('boards')
export class BoardsController {
  constructor(private BoardsService: BoardsService) {}

  @Get('/')
  getAllBoard(): Board[] {
    return this.BoardsService.getAllBoard();
  }

  @Post()
  createBoard(@Body() createBoardDto: CreateBoardDto): Board {
    return this.BoardsService.createBoard(createBoardDto);
  }

  // 파라미터 여러개 일때 가져오기
  // http://localhost:3000/boards?id=123&text=ttt
  // (@Param() params: string[])

  // 파라미터 1개 일때 가져오기
  //http://localhost:3000/boards?id=9ea86b90-6be3-11ee-af75-d94506baf599
  @Get('/:id')
  getBoardById(@Param('id') id: string): Board {
    return this.BoardsService.getBoardById(id);
  }

  @Delete('/:id')
  deleteBoard(@Param('id') id: string): void {
    this.BoardsService.deleteBoard(id);
  }

  @Patch('/:id/status')
  updateBoardStatus(
    @Param('id') id: string,
    @Body('status') status: BoardStatus,
  ) {
    return this.BoardsService.updateBoardStatus(id, status);
  }
}
