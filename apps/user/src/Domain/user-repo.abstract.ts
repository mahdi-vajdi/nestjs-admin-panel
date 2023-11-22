import { User } from './user.domain';

export abstract class UserRepository {
  abstract save(user: User): Promise<void>;
  abstract findOneById(id: string): Promise<User>;
  abstract findOneByEmail(email: string): Promise<User>;
}
