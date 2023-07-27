// test/app.e2e-spec.ts

import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateUserDto } from '../src/user/dto/create-user.dto';

describe('UserController (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const createUserDto: CreateUserDto = {
    name: 'John Doe',
    email: generateRandomEmail(),
    bio: 'Sample bio',
    address: 'Sample address',
  };
  function generateRandomEmail(): string {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const randomString = Array.from({ length: 10 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
    return `${randomString}.doe@example.com`;
  }
  let createdUserId: string;

  it('/user (POST) should create a new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/user')
      .send(createUserDto)
      .expect(HttpStatus.CREATED);

    expect(response.body).toEqual({
      status: 201,
      message: 'User created successfully!',
      data: expect.objectContaining({
        _id: expect.any(String),
        name: createUserDto.name,
        email: createUserDto.email,
        bio: createUserDto.bio,
        address: createUserDto.address,
      }),
    });
    createdUserId = response.body.data._id;
  });

  it('/user/:id (GET) should retrieve a user by ID', async () => {
    const response = await request(app.getHttpServer())
      .get(`/user/${createdUserId}`)
      .expect(HttpStatus.OK);

    expect(response.body).toEqual({
      status: 200,
      message: 'User retrieved successfully!',
      data: expect.objectContaining({
        _id: createdUserId,
        name: createUserDto.name,
        email: createUserDto.email,
        bio: createUserDto.bio,
        address: createUserDto.address,
      }),
    });
  });

  it('/user/:id (GET) should return 404 when user is not found', async () => {
    const nonExistentId = "64c24c2c837a371bae903efa";
    await request(app.getHttpServer())
      .get(`/user/${nonExistentId}`)
      .expect(HttpStatus.NOT_FOUND);
  });
});
