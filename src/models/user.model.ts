import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  id: string;
  fullName: string;
  phone: string;
  gender: string;
  email: string;
  password: string;
  role: string;
  designation: string;
  ieeeMemberId: string;
  isVerified: boolean;
  institutionCompany: string;
  ieeeIdCardUrl: string;
  cvUrl: string;
  isIeeeCSMember: boolean;
  isPaid: boolean;
  isPaymentVerified: boolean;
  paymentScreenshotUrl: string;
  paymentRequestSent: boolean;
  paymentRequestSentAt: Date;
  finalEmailSent: boolean;
  finalEmailSentAt: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  id: {
    type: String,
    unique: false,
    sparse: true,
  },
  fullName: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
  },
  gender: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    require: true,
  },
  password: {
    type: String,
  },
  designation: {
    type: String,
    require: true,
  },
  role: {
    type: String,
  },
  isPaymentVerified: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  ieeeMemberId: {
    type: String,
    required: true,
  },
  institutionCompany: {
    type: String,
    required: false,
  },
  ieeeIdCardUrl: {
    type: String,
    required: false,
  },
  cvUrl: {
    type: String,
    required: false,
  },
  isIeeeCSMember: {
    type: Boolean,
    default: false,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  paymentScreenshotUrl: {
    type: String,
    required: false,
  },
  paymentRequestSent: {
    type: Boolean,
    default: false,
  },
  paymentRequestSentAt: {
    type: Date,
    required: false,
  },
  finalEmailSent: {
    type: Boolean,
    default: false,
  },
  finalEmailSentAt: {
    type: Date,
    required: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const userModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default userModel;
