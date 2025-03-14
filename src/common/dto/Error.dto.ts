import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ErrorDto {
  @ApiProperty({
    oneOf: [
      {
        type: 'string',
      },
      {
        type: 'array',
        items: { type: 'string' },
      },
    ],
  })
  'message': string | string[];
  @ApiProperty()
  @IsString()
  'error': string;
  @ApiProperty()
  @IsNumber()
  'statusCode': number;
}
