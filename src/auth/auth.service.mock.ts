export const AuthServiceMock = {
    login: jest.fn().mockResolvedValue('token'),
    generateToken: jest.fn().mockResolvedValue('token'),
    forgotPassword: jest.fn().mockResolvedValue('OK'),
    resetPassword: jest.fn().mockResolvedValue('OK'),
    resendConfirmation: jest.fn().mockResolvedValue('OK'),
};
