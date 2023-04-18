import * as mongoose from 'mongoose';

import { mongoConfigs } from '../config/mongo.configs';

const { user, password, host, db } = mongoConfigs;
const url = `mongodb://${user}:${password}@${host}/${db}?authSource=admin`;

mongoose.connect(url);
