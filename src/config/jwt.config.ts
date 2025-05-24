import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export default registerAs('jwt', (): JwtModuleOptions => {
  return {
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1h' },
  };
});
