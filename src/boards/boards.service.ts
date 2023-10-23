import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardRepository } from './board.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { BoardStatus } from './board-status.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class BoardsService {
  constructor(
    //@InjectRepository(Board)
    private boardRepository: BoardRepository,
  ) {}

  async getAllBoards(user: User): Promise<Board[]> {
    const query = this.boardRepository.createQueryBuilder('board');

    query.where('board.userId = :userId', { userId: user.id });

    const boards = await query.getMany();

    return boards;
  }

  createBoard(createBoardDto: CreateBoardDto, user: User): Promise<Board> {
    return this.boardRepository.createBoard(createBoardDto, user);
  }

  async getBoardById(id: number): Promise<Board> {
    const found = await this.boardRepository.findOne({ where: { id: id } });

    if (!found) {
      throw new NotFoundException(`Can't find the board with id ${id}`);
    }

    return found;
  }

  async deleteBoard(id: number, user: User): Promise<void> {
    const result = await this.boardRepository.delete({
      id,
      user: {
        id: user.id,
      },
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Can't find Board with id ${id}`);
    }
  }

  async updateBoardStatus(
    id: number,
    status: BoardStatus,
    user: User,
  ): Promise<Board> {
    if (!user || !user.id) {
      throw new UnauthorizedException(`Invalid user.`);
    }

    const board = await this.getBoardById(id);
    if (!board) {
      throw new NotFoundException(`Board with ID ${id} not found.`);
    }

    if (!board.userId || board.userId !== user.id) {
      throw new UnauthorizedException(
        `Only the owner can update the board status.`,
      );
    }

    board.status = status;
    await this.boardRepository.save(board);

    return board;
  }

  // private boards: Board[] = [];
  // getAllBoard(): Board[] {
  //   return this.boards; // 리턴값 설정
  // }
  // createBoard(createBoardDto: CreateBoardDto) {
  //   const { title, description } = createBoardDto;
  //   const board: Board = {
  //     id: uuid(), // for unique id
  //     title,
  //     description,
  //     status: BoardStatus.PUBLIC,
  //   };
  //   this.boards.push(board);
  //   return board;
  // }
  // getBoardById(id: string): Board {
  //   const found = this.boards.find((board) => board.id === id);
  //   // [PIPE] 특정 게시물을 찾을 때 없는 경우 결과 값 처리
  //   if (!found) {
  //     throw new NotFoundException(`Can't find board with id ${id}`);
  //   }
  //   return found;
  // }
  // deleteBoard(id: string): void {
  //   const found = this.getBoardById(id);
  //   // [PIPE] 없는 게시물을 지우려 할 때 결과 값 처리
  //   if (!found) {
  //     throw new NotFoundException(`Can't delete board with id ${id}`);
  //   }
  //   this.boards = this.boards.filter((board) => board.id != id);
  // }
  // // 상태값만 업데이트
  // updateBoardStatus(id: string, status: BoardStatus): Board {
  //   const board = this.getBoardById(id);
  //   board.status = status;
  //   return board;
  // }
}
