export const TopicSessionServiceMock = {
    create: jest.fn().mockResolvedValue({ id: '123' }),
    updateProgress: jest.fn().mockResolvedValue({ id: '123' }),
    findOne: jest.fn().mockResolvedValue({ id: '123', user: '234' }),
};
