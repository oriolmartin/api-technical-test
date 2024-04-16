import bcrypt from "bcrypt";
import JsonWebToken from "jsonwebtoken";
import User from "../models/user";
import { CONFIG } from "../config";

export function checkPassword(
  userPassword: string,
  incomingPassword: string
): boolean {
  return bcrypt.compareSync(incomingPassword, userPassword);
}

export function createPassword(userPassword: string): string {
  return bcrypt.hashSync(userPassword, 10);
}

export function generateJwt(user_id: string): string {
  return JsonWebToken.sign({ user_id }, CONFIG.SECRET_JWT_KEY);
}

export async function checkJwt(jwt?: string): Promise<boolean> {
  const token = JsonWebToken.verify(
    !!jwt && jwt.startsWith("Bearer ") ? jwt.substring(7) : jwt || "",
    CONFIG.SECRET_JWT_KEY
  ) as JsonWebToken.JwtPayload;

  try {
    const user = await User.findById(token.user_id);
    return !!user;
  } catch {
    return false;
  }
}

export async function getUser(jwt?: string): Promise<typeof User | undefined> {
  const token =
    !!jwt &&
    (JsonWebToken.verify(
      jwt.startsWith("Bearer ") ? jwt.substring(7) : jwt || "",
      CONFIG.SECRET_JWT_KEY
    ) as JsonWebToken.JwtPayload);

  let user: typeof User | undefined | null = undefined;

  if (token) {
    user = await User.findById(token.user_id);
  }

  try {
    return user === null ? undefined : user;
  } catch {
    return undefined;
  }
}
