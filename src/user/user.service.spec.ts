import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User, UserSchema } from './schemas/user.schemas';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

describe('UserService', () => {
  let service: UserService;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: Model,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

      jest.spyOn(userModel.prototype, 'save').mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual({
        status: 201,
        message: 'User created successfully!',
        data: mockUser,
      });
    });
  });

  // Add more test cases for other methods like findAll, findOne, update, remove
});
