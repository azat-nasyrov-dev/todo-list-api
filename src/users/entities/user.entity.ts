import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true, nullable: false })
  username: string;

  @Column({ name: 'password_hash', type: 'text', nullable: false })
  passwordHash: string;
}
