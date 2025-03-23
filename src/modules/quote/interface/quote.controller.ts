import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateQuoteDto } from '../application/dto/create-quote.dto';
import { Quote } from '../domain/quote.domain';
import { QuoteFacade } from '../application/service/quote.facade';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  CreateQuoteOperation,
  CreateQuoteResponses,
  GetQuoteOperation,
  GetQuoteResponses,
} from '../swagger/quote.swagger';

@ApiTags('Quotes')
@ApiBearerAuth()
@Controller('quote')
@UseGuards(AuthGuard())
export class QuoteController {
  constructor(private readonly quoteFacade: QuoteFacade) {}

  @Get(':id')
  @ApiOperation(GetQuoteOperation)
  @ApiResponse(GetQuoteResponses.SUCCESS)
  @ApiResponse(GetQuoteResponses.NOT_FOUND)
  @ApiResponse(GetQuoteResponses.EXPIRED)
  @ApiResponse(GetQuoteResponses.RETRIEVAL_ERROR)
  @ApiResponse(GetQuoteResponses.UNAUTHORIZED)
  @ApiResponse(GetQuoteResponses.BAD_REQUEST)
  @ApiParam({
    name: 'id',
    description: 'Quote UUID v4',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<Quote> {
    return await this.quoteFacade.findOneQuote(id);
  }

  @Post()
  @ApiOperation(CreateQuoteOperation)
  @ApiResponse(CreateQuoteResponses.CREATED)
  @ApiResponse(CreateQuoteResponses.CREATION_ERROR)
  @ApiResponse(CreateQuoteResponses.BAD_REQUEST)
  @ApiResponse(CreateQuoteResponses.UNAUTHORIZED)
  @ApiBody({ type: CreateQuoteDto })
  async create(@Body() createQuoteDto: CreateQuoteDto): Promise<Quote> {
    return await this.quoteFacade.createQuote(createQuoteDto);
  }
}
