import { IsNotEmpty } from 'class-validator';

export class CreateBoardDto {
  // [PIPE]  파이프를 이용한 유효성 체크
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  description: string;
}
