import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { internet } from 'faker';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
describe('Authentication System (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', async () => {
    const email = internet.email();
    const res = await request(app.getHttpServer()).post('/auth/signup').send({
      email,
      password: internet.password(),
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email', email);
  });

  test('should signup as a new user and then get the curently logged in user', async () => {
    const email = internet.email();
    const password = internet.password();
    const res = await request(app.getHttpServer()).post('/auth/signup').send({
      email,
      password,
    });

    const cookie = res.get('Set-Cookie');

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email', email);

    const res2 = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Cookie', cookie);

    expect(res2.status).toBe(200);
    expect(res2.body).toHaveProperty('id');
    expect(res2.body).toHaveProperty('email', email);
  });
});
