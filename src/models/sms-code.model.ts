import mongoose, { Document, Model, Schema } from 'mongoose';

const MAX_ATTEMPTS = 1000;

export interface SmsCode {
    _id: any | mongoose.Types.ObjectId;
    userId: number;
    deviceId: number;
    code: string;
    createdAt: Date;
}

export interface SmsCodeDoc extends Document, SmsCode {}

export interface SmsCodeMongoModel extends Model<SmsCodeDoc> {
    generateCode(
        userId: mongoose.Types.ObjectId,
        deviceId: mongoose.Types.ObjectId
    ): Promise<SmsCodeDoc>;

    findByCode(code: string): Promise<SmsCodeDoc>;
}

const SmsCodeSchema = new Schema(
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
    let smsCode: SmsCodeDoc;
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

SmsCodeSchema.statics.findByCode = function (code: string): Promise<SmsCode> {
    return this.findOne({ code });
};
export const SmsCodeModel = mongoose.model<SmsCodeDoc, SmsCodeMongoModel>(
    'SmsCodeModel',
    SmsCodeSchema
);
