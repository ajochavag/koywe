import { GoneException, NotFoundException } from '@nestjs/common';

export class QuotaNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Quota with ID ${id} not found.`);
  }
}

export class QuotaExpiredException extends GoneException {
  constructor(id: string) {
    super(`Quota with ID ${id} has expired.`);
  }
}
