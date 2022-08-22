export const TopicsServiceMock = {
    create: jest.fn().mockResolvedValue({ _id: '123' }),
    findOne: jest.fn().mockResolvedValue({ _id: '123' }),
};
