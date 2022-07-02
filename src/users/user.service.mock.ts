export const UserServiceMock = {
    create: jest
        .fn()
        .mockResolvedValue({ _id: '123', email: 'some@mail.com', emailConfirmed: true }),
    confirmEmail: jest.fn().mockResolvedValue('OK'),
    findById: jest
        .fn()
        .mockResolvedValue({ _id: '123', email: 'some@mail.com', emailConfirmed: true }),
    findByEmail: jest
        .fn()
        .mockResolvedValue({ _id: '123', email: 'some@mail.com', emailConfirmed: true }),
    updatePassword: jest.fn().mockResolvedValue('OK'),
};
