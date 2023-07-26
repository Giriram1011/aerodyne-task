import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schemas';
import { Model } from 'mongoose';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: Model,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        name: 'John Doe',
        username: 'johndoe',
        email: 'john.doe@example.com',
        bio: 'Sample bio',
        address: 'Sample address',
      };

      const mockUser = {
        _id: 'sample-id',
        ...createUserDto,
      };

      jest.spyOn(service, 'create').mockResolvedValue({ status: 201, message: 'User created successfully!', data: mockUser });

      const result = await controller.create(createUserDto);

      expect(result).toEqual({ status: 201, message: 'User created successfully!', data: mockUser });
    });
  });

  // Add more test cases for other methods like findAll, findOne, update, remove
});
