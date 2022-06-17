export const createModelMock = (mockedValue: any) => {
    const exec = jest.fn().mockResolvedValue(mockedValue);
    return {
        create() { return { exec } },
        findAll() { return { exec } },
        findOne() { return { exec } },
        update() { return { exec } },
        remove() { return { exec } },
    };
};
