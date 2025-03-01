
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quote } from './quote.entity';

@Injectable()
export class QuoteRepository {
    constructor(
        @InjectRepository(Quote)
        private readonly quoteRepository: Repository<Quote>,
    ) {}
}