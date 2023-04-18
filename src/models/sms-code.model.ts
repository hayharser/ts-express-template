import mongoose, { Model, Schema } from 'mongoose';
import { UserApiModel } from './api/user.api.model';

const MAX_ATTEMPTS = 1000;

export interface SmsCode {
    _id?: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    deviceId: mongoose.Types.ObjectId;
    code: string;
    createdAt: Date;
}

interface SmsCodeMethods {
    toApiModel(): UserApiModel;

    generateCode(
        userId: mongoose.Types.ObjectId,
        deviceId: mongoose.Types.ObjectId
    ): Promise<SmsCode>;

    findByCode(code: string): Promise<SmsCode>;
}

export interface SmsCodeMongoModel extends Model<SmsCode, object, SmsCodeMethods> {
    generateCode(
        userId: mongoose.Types.ObjectId,
        deviceId: mongoose.Types.ObjectId
    ): Promise<SmsCode>;

    findByCode(code: string): Promise<SmsCode>;
}

const SmsCodeSchema = new Schema<SmsCode, SmsCodeMongoModel, SmsCodeMethods>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'UserModel', required: true },
        deviceId: { type: Schema.Types.ObjectId, ref: 'DeviceModel', required: true },
        code: { type: String }
    },
    { collection: 'sms_codes', timestamps: { createdAt: true, updatedAt: false } }
);

SmsCodeSchema.index({ createdAt: 1 }, { expireAfterSeconds: 1 * 60 });
// no need to add index, as this table is small
// SmsCodeSchema.index({ userId: 1 });
// SmsCodeSchema.index({ code: 1 });

SmsCodeSchema.statics.generateCode = async function (
    userId: mongoose.Types.ObjectId,
    deviceId: mongoose.Types.ObjectId
) {
    let code = 0;
    let smsCode: SmsCode;
    let codeString;
    let attempts = 0;
    // eslint-disable-next-line no-loops/no-loops
    do {
        code = Math.ceil(Math.random() * 9000 + 1000 - 1);
        codeString = code.toString();
        smsCode = await this.findByCode(codeString);
        attempts++;
    } while (smsCode != null && attempts < MAX_ATTEMPTS);

    const smsCodeData = {
        userId,
        deviceId,
        code: codeString
    };
    return this.create(smsCodeData);
};

SmsCodeSchema.statics.findByCode = function (code: string) {
    return this.findOne({ code }).exec();
};
export const SmsCodeModel = mongoose.model<SmsCode, SmsCodeMongoModel>(
    'SmsCodeModel',
    SmsCodeSchema
);
