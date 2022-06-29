export const EmailServiceMock = {
    emailConfirmation: jest.fn().mockResolvedValue('OK'),
    forgotPassword: jest.fn().mockResolvedValue('OK'),
};
