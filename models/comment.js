import { Schema, model } from 'mongoose';

const commentSchema = new Schema(
  {
    blog: { type: Schema.Types.ObjectId, ref: 'blog', required: true, index: true },
    author: { type: Schema.Types.ObjectId, ref: 'user', required: true, index: true },
    content: { type: String, required: true, maxlength: 1000 },
  },
  { timestamps: true }
);

commentSchema.index({ blog: 1, createdAt: -1 });

export default model('comment', commentSchema);
