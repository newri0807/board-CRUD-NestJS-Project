import { BadRequestException, PipeTransform } from '@nestjs/common';
import { BoardStatus } from '../board-status.enum';

// [ 커스텀 PIPE ] 유효성 검사
export class BoardStatusValidationPipe implements PipeTransform {
  readonly StatusOptions = [BoardStatus.PRIAVATE, BoardStatus.PUBLIC];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform(value: any) {
    value = value.toUpperCase();

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`${value} isn't in the status options`);
    }

    return value;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private isStatusValid(status: any) {
    const index = this.StatusOptions.indexOf(status);
    return index !== -1;
  }
}
