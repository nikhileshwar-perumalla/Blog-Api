import { Schema , model , Types } from "mongoose";


const tokenSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    }
});

export default model('Token',tokenSchema); 