import { HydratedDocument, Model, model, Schema } from 'mongoose';
import * as bcrypt from 'bcrypt';

const SALT_WORK_FACTORY = 10;

export interface IUserDevice {
    fcmToken: string;
    osName: string;
    osVersion: string;
    deviceId: string;
}

export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password?: string;
    phoneNo: string;
    profileUrl: string;
    bio: string;
    deviceInfo: IUserDevice[];
}

interface IUserMethods {
    fullName(): string;
}

interface UserModelType extends Model<IUser, object, IUserMethods> {
    createWithFullName(name: string): Promise<HydratedDocument<IUser, IUserMethods>>;
}

// user schema
const UserSchema = new Schema<IUser, UserModelType, IUserMethods>(
    {
        firstName: { type: String, trim: true, default: '' },
        lastName: { type: String, trim: true, default: '' },
        email: { type: String, trim: true, required: false, index: true },
        username: { type: String, trim: true, required: false, index: true },
        phoneNo: { type: String, trim: true, required: true, index: true },
        profileUrl: { type: String, trim: true, default: '' },
        bio: { type: String, trim: true, default: '' },

        // token: { type: String, default: '' },
        // reset_password_token: { type: String, default: '' },
        // reset_password_expires: { type: Date, default: null },
        //
        password: { type: String, trim: false },
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
        deviceInfo: [
            {
                fcmToken: { type: String, default: '' },
                osName: { type: String, default: '' },
                osVersion: { type: String, default: '' },
                deviceId: { type: String, default: '' }
            }
        ]
    },
    {
        timestamps: true
    }
);

UserSchema.static('createWithFullName', function createWithFullName(name: string) {
    const [firstName, lastName] = name.split(' ');
    return this.create({ firstName, lastName });
});
UserSchema.method('fullName', function fullName(): string {
    return this.firstName + ' ' + this.lastName;
});

UserSchema.pre('save', function (next) {
    // only hash the password if it has been modified (or is new)
    if (!this.isModified('password') || !this.password) {
        return next();
    }

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTORY, (err, salt) => {
        if (err) {
            return next(err);
        }

        // hash the password using our new salt
        bcrypt.hash(this.password!, salt, (err, hash) => {
            if (err) {
                return next(err);
            }

            // override the cleartext password with the hashed one
            this.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
};

// UserSchema.plugin(aggregatePaginate);
export const UserModel = model<IUser, UserModelType>('User', UserSchema);
