export const createServiceMock = (mockedValue: any) => {
    return {
        create: jest.fn().mockResolvedValue(mockedValue),
        findAll: jest.fn().mockResolvedValue([mockedValue]),
        findOne: jest.fn().mockResolvedValue(mockedValue),
        getById: jest.fn().mockResolvedValue(mockedValue),
        update: jest.fn().mockResolvedValue(mockedValue),
        remove: jest.fn().mockResolvedValue({}),
    };
};
