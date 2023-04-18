import { Model, model, Schema, Types } from 'mongoose';
import { UserApiModel } from './api/user.api.model';

export enum FederatedAccountProviders {
    FACEBOOK = 'facebook',
    LINKEDIN = 'linkedin'
}

export interface UserDevice {
    device: Types.ObjectId;
    isVerified: boolean;
}

export interface FederatedAccount {
    provider: string;
    id: string;
    accessToken: string;
    refreshToken?: string;
}

export interface User {
    _id?: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    username?: string;
    phoneNumber?: string;
    salt?: string;
    password?: string;
    profileUrl?: string;
    bio?: string;
    devices?: Types.DocumentArray<UserDevice>;
    federatedAccounts: FederatedAccount[];
}

interface UserMethods {
    toApiModel(): UserApiModel;
}

export type UserModelType = Model<User, {}, UserMethods>;

const userDeviceSchema = new Schema<UserDevice>(
    {
        device: { type: Schema.Types.ObjectId, ref: 'DeviceModel', required: true },
        isVerified: { type: Boolean, required: true, default: false }
    },
    { _id: false, timestamps: true }
);

// user schema
const UserSchema = new Schema<User, UserModelType, UserMethods>(
    {
        firstName: { type: String, trim: true, default: '' },
        lastName: { type: String, trim: true, default: '' },
        email: { type: String, trim: true, required: false, index: true },
        username: { type: String, trim: true, required: false, index: true },
        phoneNumber: { type: String, trim: true, required: true, index: true },

        salt: { type: String, trim: false },
        password: { type: String, trim: false },

        federatedAccounts: [
            {
                _id: false,
                provider: { type: String, required: true },
                id: { type: String, required: true },
                accessToken: { type: String, required: true },
                refreshToken: { type: String, required: false }
            }
        ],
        devices: [userDeviceSchema]
        // token: { type: String, default: '' },
        // reset_password_token: { type: String, default: '' },
        // reset_password_expires: { type: Date, default: null },
        //
        // old_password: [{ type: String, trim: true }],
        // otp_code: { type: Number, trim: true, default: 0, max: 999999 },
        // signup_step: { type: Number, trim: true, default: 1, min: 1, max: 4 }, // 1: mobile no, 2: otp, 3: account info, 4: complete
        // is_password_reset: { type: Boolean, default: false },
        //
        // is_locked: { type: Boolean, default: false },
        // locked_at: { type: Number, default: 0 },
        // attempts: { type: Number, default: 0 },
        //
        // is_premium_user: { type: Boolean, default: 0, index: true },
        // is_registered: { type: Boolean, default: 0, index: true },
        // is_suspended: { type: Boolean, default: 0 },
        // is_account_closed: { type: Boolean, default: 0 },
    },
    {
        timestamps: true
    }
);

UserSchema.method('toApiModel', function toApiModel(): UserApiModel {
    return {
        id: this._id.toString(),
        firstName: this.firstName,
        lastName: this.lastName,
        username: this.username,
        email: this.email
    };
});

// UserSchema.plugin(aggregatePaginate);
export const UserModel = model<User, UserModelType>('User', UserSchema);
