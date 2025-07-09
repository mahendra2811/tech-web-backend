import mongoose, { Document, Schema } from 'mongoose';
import slugify from 'slugify';

// Service interface
export interface IService extends Document {
  title: string;
  slug: string;
  description: string;
  detailedDescription?: string;
  icon: string;
  features?: string[];
  price?: {
    amount: number;
    currency: string;
    billingCycle?: 'one-time' | 'monthly' | 'yearly';
  };
  createdAt: Date;
  updatedAt: Date;
}

// Service schema
const ServiceSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      trim: true,
    },
    detailedDescription: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      required: [true, 'Please add an icon'],
    },
    features: {
      type: [String],
    },
    price: {
      amount: {
        type: Number,
      },
      currency: {
        type: String,
        default: 'USD',
      },
      billingCycle: {
        type: String,
        enum: ['one-time', 'monthly', 'yearly'],
      },
    },
  },
  {
    timestamps: true,
  }
);

// Create slug from title before saving
ServiceSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true });
  }
  next();
});

export default mongoose.model<IService>('Service', ServiceSchema);