import { InjectModel } from '@nestjs/mongoose';
import { User } from '../Domain/user.domain';
import { UserRepository } from '../Domain/abstract-user.repo';
import { UserModel } from './user.model';
import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MongoUserRepository implements UserRepository {
  constructor(
    @InjectModel(UserModel.name) private readonly userModel: Model<UserModel>,
  ) {}

  async add(userEntity: User): Promise<User> {
    const newUser = await this.userModel.create(this.fromEntity(userEntity));
    if (newUser) return userEntity;
  }

  async save(user: User): Promise<void> {
    await new this.userModel(this.fromEntity(user)).save();
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.userModel.findById(id, {}, { lean: true }).exec();
    return this.toEntity(user);
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userModel
      .findOne({ email }, {}, { lean: true })
      .exec();
    return this.toEntity(user);
  }

  private fromEntity(user: User): UserModel {
    return {
      _id: new Types.ObjectId(user.id),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      password: user.password,
      refreshToken: user.refreshToken,
    };
  }

  private toEntity(model: UserModel): User {
    return new User(
      model._id.toHexString(),
      model.createdAt,
      model.updatedAt,
      model.firstName,
      model.lastName,
      model.email,
      model.phone,
      model.password,
      model.refreshToken,
    );
  }
}
