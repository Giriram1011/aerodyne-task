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
    email: 'john.doe@example.com',
    bio: 'Sample bio',
    address: 'Sample address',
  };

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

    // Save the created user ID for later use in the next test
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
    const nonExistentId = 'non-existent-id';
    await request(app.getHttpServer())
      .get(`/user/${nonExistentId}`)
      .expect(HttpStatus.NOT_FOUND);
  });
});
