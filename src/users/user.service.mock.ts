export const UserServiceMock = {
    create: jest
        .fn()
        .mockResolvedValue({ _id: '123', email: 'some@mail.com', emailConfirmed: true }),
    confirmEmail: jest.fn().mockResolvedValue("OK"),
};
