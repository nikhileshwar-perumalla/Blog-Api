import { Schema, model } from 'mongoose';

const blogSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'user', required: true, index: true },
    tags: [{ type: String, trim: true, lowercase: true }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    likeCount: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

blogSchema.index({ author: 1, createdAt: -1 });

export default model('blog', blogSchema);
