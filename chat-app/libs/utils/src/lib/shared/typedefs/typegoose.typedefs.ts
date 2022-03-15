import { Ref } from '@typegoose/typegoose';
import { Types } from 'mongoose';


export type Reference<T> = Ref<T> | Types.ObjectId;
