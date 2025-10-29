import { Context } from "elysia";

export type Session = {
  id: string;
  name: string;
  username: string;
  email: string;
  iat?: number;
  iss?: string;
  sub?: string;
  aud?: string | string[];
  jti?: string;
  nbf?: number;
  exp?: number;
};

export type Page = {
  context?: Context;
  session?: Session;
};
