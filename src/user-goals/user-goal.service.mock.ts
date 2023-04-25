export const UserGoalServiceMock = {
    create: jest.fn().mockResolvedValue({ _id: '123' }),
    findAll: jest.fn().mockResolvedValue([{ _id: '123' }]),
    findOne: jest.fn().mockResolvedValue({ _id: '123' }),
    remove: jest.fn().mockResolvedValue({ _id: '123' }),
    setCurrentSession: jest.fn().mockResolvedValue({ _id: '123' }),
};
