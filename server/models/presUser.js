// models/presUser.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // prevents password from being returned in find queries
    },

    image: {
      type: String,
      default:
        'https://res.cloudinary.com/your-cloud-name/image/upload/v1/defaults/user-avatar.png',
      // You can replace with your real Cloudinary default image URL later
    },

    address: {
      type: {
        line1: { type: String, trim: true },
        line2: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        country: { type: String, default: 'Pakistan' },
        zipCode: { type: String, trim: true },
      },
      default: {},
    },
     address: {
    type: String,
    default: '',
  },

    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
      default: 'Prefer not to say',
    },

    dob: {
      type: Date,
      // Optional — remove required if users can skip it
    },

    phone: {
      type: String,
      trim: true,
      default: '',
      match: [
        /^\+?[\d\s-]{10,15}$/,
        'Please provide a valid phone number',
      ],
    },

    // Optional: if you want to track when user was created/updated
    // (timestamps: true already adds createdAt & updatedAt)
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Optional: virtual for full address string (if you need it in frontend)
userSchema.virtual('fullAddress').get(function () {
  const addr = this.address;
  if (!addr || !addr.city) return '';
  return [
    addr.line1,
    addr.line2,
    addr.city,
    addr.state,
    addr.country,
    addr.zipCode,
  ]
    .filter(Boolean)
    .join(', ');
});

const PresUser =
  mongoose.models.PresUser || mongoose.model('PresUser', userSchema);

export default PresUser;