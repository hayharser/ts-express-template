import { Types } from 'mongoose';

export interface UserServiceModel {
    _id?: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    username?: string;
    password?: string;
    phoneNumber?: string;
    salt?: string;
    provider?: {
        id: string;
        accessToken: string;
        refreshToken?: string;
    };
}
