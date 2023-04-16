export interface UserServiceModel {
    firstName: string;
    lastName: string;
    email: string;

    provider: {
        id: string;
        accessToken: string;
        refreshToken?: string;
    };
}
