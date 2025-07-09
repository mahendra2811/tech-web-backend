import mongoose, { Document, Schema } from 'mongoose';

// Testimonial interface
export interface ITestimonial extends Document {
  name: string;
  position: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Testimonial schema
const TestimonialSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    position: {
      type: String,
      required: [true, 'Please add a position'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Please add a company'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Please add content'],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please add a rating'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
    },
    avatar: {
      type: String,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);