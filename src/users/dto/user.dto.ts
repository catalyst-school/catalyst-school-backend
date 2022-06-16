interface IUserDto {
    email?: string;
    name?: string;
}

export class UserDto {
    private readonly email: string;
    private readonly name: string;

    constructor(data: IUserDto) {
        this.email = data.email;
        this.name = data.name;
    }
}