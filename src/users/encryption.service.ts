import { Injectable } from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class EncryptionService {
  async encrypt(password: string) {
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 64)) as Buffer;
    const result = `${salt}.${hash.toString('hex')}`;
    return result;
  }

  async compare(password: string, hash: string) {
    const [salt, hash2] = hash.split('.');
    const result = (await scrypt(password, salt, 64)) as Buffer;
    return hash2 === result.toString('hex');
  }
}
