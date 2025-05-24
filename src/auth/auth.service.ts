import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../users/entities/user.entity';
import { HashingService } from './hashing/hashing.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthMessages } from './auth.constants';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  /**
   * @param userRepository User repository for working with the database
   * @param hashingService Password hashing service (abstraction over bcrypt)
   * @param jwtService Service for generating JWT tokens
   */
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(HashingService)
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registers a new user
   * Checks the uniqueness of the username, hashes the password, saves in the database
   *
   * @param dto Object with registration data (username and password)
   * @return Successful registration message
   * @throws HttpException 409, if the user exists
   * @throws HttpException 500, if an internal error occurred
   */
  public async register(dto: RegisterDto): Promise<{ message: string }> {
    try {
      const existingUser = await this.userRepository.findOneBy({ username: dto.username });
      if (existingUser) {
        throw new HttpException(AuthMessages.USER_EXISTS, HttpStatus.CONFLICT);
      }

      const passwordHash = await this.hashingService.hash(dto.password);
      const user = this.userRepository.create({
        username: dto.username,
        passwordHash,
      });

      await this.userRepository.save(user);
      this.logger.log(`User registered: ${user.username}`);

      return { message: 'User registered successfully' };
    } catch (err: unknown) {
      this.logger.error('Registration failed', (err as Error).stack);
      if (err instanceof HttpException) throw err;
      throw new HttpException(AuthMessages.REGISTRATION_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Authorizes the user by name and password
   * Checks the existence of the user and the correctness of the password
   * Returns a JWT token upon successfull authorization
   *
   * @param dto Object with login data (username and password)
   * @returns JWT access token
   * @throws HttpException 401, if the credentials are incorrect
   * @throws HttpException 500, if an internal error occurred
   */
  public async login(dto: LoginDto): Promise<{ access_token: string }> {
    try {
      const user = await this.userRepository.findOneBy({ username: dto.username });
      if (!user) {
        throw new HttpException(AuthMessages.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
      }

      const isPasswordValid = await this.hashingService.compare(dto.password, user.passwordHash);
      if (!isPasswordValid) {
        throw new HttpException(AuthMessages.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
      }

      const payload = { sub: user.id, username: user.username };
      const token = await this.jwtService.signAsync(payload);
      this.logger.log(`User logged in: ${user.username}`);

      return { access_token: token };
    } catch (err: unknown) {
      this.logger.error('Login failed', (err as Error).stack);
      if (err instanceof HttpException) throw err;
      throw new HttpException(AuthMessages.LOGIN_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
