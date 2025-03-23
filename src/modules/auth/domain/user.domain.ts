import { Base } from '@/modules/common/domain/base.domain';

export class User extends Base {
  username: string;
  password: string;

  constructor(user: User) {
    super();
    Object.assign(this, user);
  }
}
