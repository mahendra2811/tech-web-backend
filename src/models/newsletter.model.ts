import mongoose, { Document, Schema } from 'mongoose';

// Newsletter Subscription interface
export interface INewsletterSubscription extends Document {
  email: string;
  status: 'active' | 'unsubscribed';
  createdAt: Date;
  updatedAt: Date;
  lastEmailSent?: Date;
}

// Newsletter Subscription schema
const NewsletterSubscriptionSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'unsubscribed'],
      default: 'active',
    },
    lastEmailSent: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<INewsletterSubscription>('NewsletterSubscription', NewsletterSubscriptionSchema);