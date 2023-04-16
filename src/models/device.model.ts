import mongoose, { Model, Schema, Types } from 'mongoose';

export interface Device {
    _id: Types.ObjectId;
    deviceId: string;
    pushToken: string;
    pushOptions: any;
    os: {
        platform: string;
        model: string;
        name: string;
        app: string;
        version: string;
        language: string;
    };
    status: number;
    updatedAt: Date;
    createdAt: Date;
}

export type DeviceModelType = Model<Device, object, Record<string, never>>;

const DeviceSchema = new Schema<Device, DeviceModelType>(
    {
        deviceId: { type: String, required: true },
        pushToken: { type: String },
        pushOptions: {},
        os: {},
        status: { type: Number, required: true, default: 1 }
    },
    { collection: 'devices', timestamps: true }
);

DeviceSchema.index({ deviceId: 1 }, { unique: true });

export const DeviceModel = mongoose.model<Device, DeviceModelType>('Device', DeviceSchema);
