export interface UserServiceModel {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    username?: string;
    password?: string;
    phoneNumber?: string;
    provider?: {
        id: string;
        accessToken: string;
        refreshToken?: string;
    };
}
