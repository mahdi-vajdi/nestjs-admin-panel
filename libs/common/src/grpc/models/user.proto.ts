// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v6.30.2
// source: src/grpc/proto/user.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "grpc_user";

export interface CreateUserRequest {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

export interface CreateUserResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetUserByIdRequest {
  userId: string;
}

export interface GetUserByEmailRequest {
  userEmail: string;
}

export interface GetUserByIdResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
}

export interface GetUserByEmailResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
}

export interface UserExistsRequest {
  email: string;
  phone: string;
}

export interface UserExistsResponse {
  userExists: boolean;
}

export const GRPC_USER_PACKAGE_NAME = "grpc_user";

export interface UserServiceClient {
  createUser(request: CreateUserRequest): Observable<CreateUserResponse>;

  getUserById(request: GetUserByIdRequest): Observable<GetUserByIdResponse>;

  getUserByEmail(request: GetUserByEmailRequest): Observable<GetUserByEmailResponse>;

  userExists(request: UserExistsRequest): Observable<UserExistsResponse>;
}

export interface UserServiceController {
  createUser(
    request: CreateUserRequest,
  ): Promise<CreateUserResponse> | Observable<CreateUserResponse> | CreateUserResponse;

  getUserById(
    request: GetUserByIdRequest,
  ): Promise<GetUserByIdResponse> | Observable<GetUserByIdResponse> | GetUserByIdResponse;

  getUserByEmail(
    request: GetUserByEmailRequest,
  ): Promise<GetUserByEmailResponse> | Observable<GetUserByEmailResponse> | GetUserByEmailResponse;

  userExists(
    request: UserExistsRequest,
  ): Promise<UserExistsResponse> | Observable<UserExistsResponse> | UserExistsResponse;
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["createUser", "getUserById", "getUserByEmail", "userExists"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const USER_SERVICE_NAME = "UserService";
