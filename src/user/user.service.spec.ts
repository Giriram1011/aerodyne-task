import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User, UserSchema } from './schemas/user.schemas';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
describe('UserService', () => {
  let userService: UserService;
  let userModel: Model<User>;

  const mockUser = {
    _id: 'sample-id',
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Sample bio',
    address: 'Sample address',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: {
            create: jest.fn().mockResolvedValue(mockUser),
            find: jest.fn(),
            findById: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findByIdAndRemove: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a user', async () => {
      jest.spyOn(userModel, 'create').mockImplementationOnce(() => Promise.resolve(mockUser as any));

      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        bio: 'Sample bio',
        address: 'Sample address',
      };

      const result = await userService.create(createUserDto);

      expect(userModel.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual({ status: 201, message: 'User created successfully!', data: mockUser });
    });
  });


  describe('findAll', () => {
    it('should find all users', async () => {
      const mockUserList = [mockUser];

      jest.spyOn(userModel, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockUserList),
      } as any);

      const result = await userService.findAll();

      expect(userModel.find).toHaveBeenCalled();
      expect(result).toEqual({
        status: 200,
        message: 'User list retrieved successfully!',
        data: mockUserList,
      });
    });
  });

  describe('findOne', () => {
    it('should find and return a user by ID', async () => {
      jest.spyOn(userModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockUser),
      } as any);

      const result = await userService.findOne(mockUser._id);

      expect(userModel.findById).toHaveBeenCalledWith(mockUser._id);
      expect(result).toEqual({
        status: 200,
        message: 'User retrieved successfully!',
        data: mockUser,
      });
    });

    it('should throw NotFoundException when user is not found', async () => {
      const nonExistentId = 'non-existent-id';

      jest.spyOn(userModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      try {
        await userService.findOne(nonExistentId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`User with ID ${nonExistentId} not found.`);
      }
    });
  });

  describe('update', () => {
    it('should update and return a user by ID', async () => {
      const updateData: UpdateUserDto = {
        name: 'Updated Name',
        email: 'updated.email@example.com',
      };

      jest.spyOn(userModel, 'findOneAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockUser),
      } as any);

      const result = await userService.update(mockUser._id, updateData);

      expect(userModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockUser._id },
        updateData,
        { new: true },
      );
      expect(result).toEqual({
        status: 200,
        message: 'User updated successfully!',
        data: mockUser,
      });
    });

    it('should throw NotFoundException when user is not found', async () => {
      const nonExistentId = 'non-existent-id';
      const updateData: UpdateUserDto = {
        name: 'Updated Name',
        email: 'updated.email@example.com',
      };

      jest.spyOn(userModel, 'findOneAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      try {
        await userService.update(nonExistentId, updateData);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`User with ID ${nonExistentId} not found.`);
      }
    });
  });

  describe('remove', () => {
    it('should remove and return a user by ID', async () => {
      jest.spyOn(userModel, 'findByIdAndRemove').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockUser),
      } as any);

      const result = await userService.remove(mockUser._id);


      expect(userModel.findByIdAndRemove).toHaveBeenCalledWith(mockUser._id);
      expect(result).toEqual({
        status: 200,
        message: 'User deleted successfully!',
        data: mockUser,
      });
    });

    it('should throw NotFoundException when user is not found', async () => {
      const nonExistentId = 'non-existent-id';

      jest.spyOn(userModel, 'findByIdAndRemove').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      try {
        await userService.remove(nonExistentId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`User with ID ${nonExistentId} not found.`);
      }
    });
  });
});
