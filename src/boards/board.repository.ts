import { DataSource, EntityRepository, Repository } from 'typeorm';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatus } from './board-status.enum';
import { InjectRepository } from '@nestjs/typeorm';

@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {
  // constructor 추가
  constructor(@InjectRepository(Board) private dataSource: DataSource) {
    super(Board, dataSource.manager); // 변경
  }

  async createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
    const { title, description } = createBoardDto;

    const board = this.create({
      title,
      description,
      status: BoardStatus.PUBLIC,
    });

    await this.save(board);
    return board;
  }
}
