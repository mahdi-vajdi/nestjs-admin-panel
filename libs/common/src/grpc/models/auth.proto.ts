// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v6.30.2
// source: src/grpc/proto/auth.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "grpc_auth";

export interface CreateCredentialRequest {
  userId: string;
  password: string;
}

export interface CreateCredentialResponse {
  createdAt: string;
}

export interface SigninRequest {
  userId: string;
  password: string;
}

export interface SigninResponse {
  refreshToken: string;
  accessToken: string;
}

export interface SignoutRequest {
  userId: string;
  tokenIdentifier: string;
}

export interface SignoutResponse {
  signedOut: boolean;
}

export interface RefreshTokensRequest {
  userId: string;
  refreshToken: string;
}

export interface RefreshTokensResponse {
  refreshToken: string;
  accessToken: string;
}

export interface VerifyRefreshTokenRequest {
  refreshToken: string;
}

export interface VerifyRefreshTokenResponse {
  verified: boolean;
}

export const GRPC_AUTH_PACKAGE_NAME = "grpc_auth";

export interface AuthServiceClient {
  createCredential(request: CreateCredentialRequest): Observable<CreateCredentialResponse>;

  signin(request: SigninRequest): Observable<SigninResponse>;

  signout(request: SignoutRequest): Observable<SignoutResponse>;

  refreshTokens(request: RefreshTokensRequest): Observable<RefreshTokensResponse>;

  verifyRefreshToken(request: VerifyRefreshTokenRequest): Observable<VerifyRefreshTokenResponse>;
}

export interface AuthServiceController {
  createCredential(
    request: CreateCredentialRequest,
  ): Promise<CreateCredentialResponse> | Observable<CreateCredentialResponse> | CreateCredentialResponse;

  signin(request: SigninRequest): Promise<SigninResponse> | Observable<SigninResponse> | SigninResponse;

  signout(request: SignoutRequest): Promise<SignoutResponse> | Observable<SignoutResponse> | SignoutResponse;

  refreshTokens(
    request: RefreshTokensRequest,
  ): Promise<RefreshTokensResponse> | Observable<RefreshTokensResponse> | RefreshTokensResponse;

  verifyRefreshToken(
    request: VerifyRefreshTokenRequest,
  ): Promise<VerifyRefreshTokenResponse> | Observable<VerifyRefreshTokenResponse> | VerifyRefreshTokenResponse;
}

export function AuthServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["createCredential", "signin", "signout", "refreshTokens", "verifyRefreshToken"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const AUTH_SERVICE_NAME = "AuthService";
