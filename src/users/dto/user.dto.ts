interface IUserDto {
    email?: string;
    name?: string;
}

export class UserDto {
    public readonly email: string;
    public readonly name: string;

    constructor(data: IUserDto) {
        this.email = data.email;
        this.name = data.name;
    }
}
