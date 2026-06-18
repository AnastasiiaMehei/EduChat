import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  provider: 'local' | 'google';
}

@Injectable()
export class AuthService {
  private readonly users = new Map<string, UserRecord>();
  private readonly googleClient: OAuth2Client;

  constructor(private readonly configService: ConfigService) {
    this.googleClient = new OAuth2Client(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
    );
  }

  async signup(name: string, email: string, password: string) {
    const normalizedEmail = email.toLowerCase();

    if (this.users.has(normalizedEmail)) {
      throw new ConflictException('User already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user: UserRecord = {
      id: crypto.randomUUID(),
      name,
      email: normalizedEmail,
      passwordHash,
      provider: 'local',
    };

    this.users.set(normalizedEmail, user);

    return this.buildAuthPayload(user);
  }

  async login(email: string, password: string) {
    const normalizedEmail = email.toLowerCase();
    const user = this.users.get(normalizedEmail);

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.buildAuthPayload(user);
  }

  async googleLogin(credential: string) {
    const ticket = await this.googleClient.verifyIdToken({
      idToken: credential,
      audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
    });

    const payload = ticket.getPayload();

    if (!payload?.email) {
      throw new UnauthorizedException('Google authentication failed');
    }

    const email = payload.email.toLowerCase();
    const existingUser = this.users.get(email);

    if (existingUser) {
      const updatedUser = {
        ...existingUser,
        name: payload.name || existingUser.name,
        provider: 'google' as const,
      };
      this.users.set(email, updatedUser);
      return this.buildAuthPayload(updatedUser);
    }

    const user: UserRecord = {
      id: crypto.randomUUID(),
      name: payload.name || email,
      email,
      provider: 'google',
    };

    this.users.set(email, user);

    return this.buildAuthPayload(user);
  }

  async me(token: string) {
    const payload = this.verifyToken(token);
    const user = this.users.get(payload.email);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  private buildAuthPayload(user: UserRecord) {
    const token = this.signToken({
      sub: user.id,
      email: user.email,
      name: user.name,
    });

    return {
      token,
      user: this.sanitizeUser(user),
    };
  }

  private sanitizeUser(user: UserRecord) {
    const { passwordHash, ...rest } = user;
    return rest;
  }

  private signToken(payload: object) {
    const secret = this.configService.get<string>('JWT_SECRET') || 'dev-secret';
    return jwt.sign(payload, secret, { expiresIn: '7d' });
  }

  private verifyToken(token: string) {
    const secret = this.configService.get<string>('JWT_SECRET') || 'dev-secret';

    return jwt.verify(token, secret) as {
      sub: string;
      email: string;
      name: string;
    };
  }
}
