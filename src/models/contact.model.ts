import mongoose, { Document, Schema } from 'mongoose';

// Contact Submission interface
export interface IContactSubmission extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'responded' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

// Contact Submission schema
const ContactSubmissionSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
      lowercase: true,
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Please add a subject'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Please add a message'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['new', 'read', 'responded', 'archived'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IContactSubmission>('ContactSubmission', ContactSubmissionSchema);