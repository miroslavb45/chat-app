import { Ref } from '@typegoose/typegoose';
import * as mongoose from 'mongoose';

export type Reference<T> = Ref<T> | mongoose.Types.ObjectId;
