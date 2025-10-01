export interface User {
  id: string;
  fullName: string;
  phone: string;
  gender: string;
  email: string;
  password: string;
  role: string;
  designation: string;
  ieeeMemberId?: string;
  isVerified: boolean;
  institutionCompany: string;
  ieeeIdCardUrl?: string;
  isPaid: boolean;
  isPaymentVerified: boolean;
  paymentScreenshotUrl?: string;
  paymentRequestSent: boolean;
  paymentRequestSentAt?: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
} 