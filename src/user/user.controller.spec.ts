import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schemas';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;
  // let userModel: Model<User>;
  const mockUser = {
    _id:"sample-id",
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Sample bio',
    address: 'Sample address',
  }
  const mockUserService = {
    findAll: jest.fn().mockResolvedValueOnce([mockUser]),
    create: jest.fn(),
    findOne: jest.fn().mockResolvedValueOnce(mockUser),
    update: jest.fn(),
    remove: jest.fn().mockResolvedValueOnce({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
    // userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('User CRUD', () => {
    it('should get all user', async () => {
      const result = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });
    it('should create a new user', async () => {
      const createUserDto = {
        name: 'John Doe',
        username: 'johndoe',
        email: 'john.doe@example.com',
        bio: 'Sample bio',
        address: 'Sample address',
      };

      mockUserService.create = jest.fn().mockResolvedValueOnce(mockUser);

      const result = await controller.create(
        createUserDto
      );

      expect(service.create).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
    it('should get a user by ID', async () => {
      const result = await controller.findOne(mockUser._id);
      expect(service.findOne).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
    it('should update user by its ID', async () => {
      const updateUser = { ...mockUser };
      const book = { title: 'Updated name' };
      service.update = jest.fn().mockResolvedValueOnce(updateUser);
      const result = await controller.update(
        mockUser._id,
        book as UpdateUserDto,
      );
      expect(service.update).toHaveBeenCalled();
      expect(result).toEqual(updateUser);
    });
      it('should delete a user by ID', async () => {
        const result = await controller.remove(mockUser._id);
  
        expect(service.remove).toHaveBeenCalled();
        expect(result).toEqual({ deleted: true });
    });
  });

  // Add more test cases for other methods like findAll, findOne, update, remove
});
