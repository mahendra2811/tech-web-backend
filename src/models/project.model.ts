import mongoose, { Document, Schema } from 'mongoose';
import slugify from 'slugify';

// Project interface
export interface IProject extends Document {
  title: string;
  slug: string;
  category: string;
  description: string;
  detailedDescription?: string;
  technologies: string[];
  techStack?: {
    name: string;
    icon?: string;
  }[];
  image?: string;
  gallery?: string[];
  featured: boolean;
  projectDate: Date;
  tags?: string[];
  githubUrl?: string;
  liveUrl?: string;
  isOpenSource?: boolean;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

// Project schema
const ProjectSchema: Schema = new Schema(
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
    category: {
      type: String,
      required: [true, 'Please add a category'],
      trim: true,
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
    technologies: {
      type: [String],
      required: [true, 'Please add technologies'],
    },
    techStack: [
      {
        name: {
          type: String,
          required: true,
        },
        icon: {
          type: String,
        },
      },
    ],
    image: {
      type: String,
    },
    gallery: {
      type: [String],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    projectDate: {
      type: Date,
      required: [true, 'Please add a project date'],
    },
    tags: {
      type: [String],
    },
    githubUrl: {
      type: String,
      match: [
        /^(https?:\/\/)?(www\.)?github\.com\/[\w-]+(\/[\w-]+)*\/?$/,
        'Please use a valid GitHub URL',
      ],
    },
    liveUrl: {
      type: String,
      match: [
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
        'Please use a valid URL',
      ],
    },
    isOpenSource: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Create slug from title before saving
ProjectSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true });
  }
  next();
});

export default mongoose.model<IProject>('Project', ProjectSchema);