"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Phone,
  Building,
  Calendar,
  Shield,
  CreditCard,
  User,
  FileText,
  Download,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

type User = {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  institutionCompany: string;
  designation: string;
  ieeeMemberId: string;
  isVerified: boolean;
  isPaymentVerified: boolean;
  isPaid: boolean;
  createdAt: Date;
  paymentScreenshotUrl?: string;
  finalEmailSent?: boolean;
  finalEmailSentAt?: Date;
  gender?: string;
  cvUrl?: string;
  ieeeIdCardUrl?: string;
  isIeeeCSMember?: boolean;
  paymentRequestSent?: boolean;
  paymentRequestSentAt?: Date;
};

interface UserDetailsDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerifyUser?: (userId: string) => void;
  onVerifyPayment?: (userId: string) => void;
  onSendFinalEmail?: (userId: string) => void;
  isProcessing?: boolean;
}

export function UserDetailsDialog({
  user,
  open,
  onOpenChange,
  onVerifyUser,
  onVerifyPayment,
  onSendFinalEmail,
  isProcessing = false,
}: UserDetailsDialogProps) {
  if (!user) return null;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (user: User) => {
    if (user.isVerified && user.isPaymentVerified) {
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Complete
        </Badge>
      );
    } else if (user.isVerified && !user.isPaymentVerified) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          <Clock className="w-3 h-3 mr-1" />
          Payment Pending
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          <XCircle className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            User Details
          </DialogTitle>
          <DialogDescription>
            Comprehensive information about {user.fullName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <p className="text-sm">{user.fullName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-sm flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {user.email}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                <p className="text-sm flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {user.phone}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Gender</label>
                <p className="text-sm">{user.gender || "Not specified"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Designation</label>
                <p className="text-sm">{user.designation}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Institution/Company</label>
                <p className="text-sm flex items-center gap-1">
                  <Building className="w-3 h-3" />
                  {user.institutionCompany}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* IEEE Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">IEEE Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">IEEE CS Member</label>
                <p className="text-sm">
                  {user.isIeeeCSMember ? (
                    <Badge variant="secondary">Yes</Badge>
                  ) : (
                    <Badge variant="outline">No</Badge>
                  )}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">IEEE Member ID</label>
                <p className="text-sm">
                  {user.ieeeMemberId ? (
                    <Badge variant="secondary">{user.ieeeMemberId}</Badge>
                  ) : (
                    <span className="text-muted-foreground">Not provided</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Registration & Status */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Registration & Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Registration Date</label>
                <p className="text-sm flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(user.createdAt)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Current Status</label>
                <div className="mt-1">{getStatusBadge(user)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Verified</label>
                <p className="text-sm">
                  {user.isVerified ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Yes
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      <XCircle className="w-3 h-3 mr-1" />
                      No
                    </Badge>
                  )}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Payment Verified</label>
                <p className="text-sm">
                  {user.isPaymentVerified ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CreditCard className="w-3 h-3 mr-1" />
                      Yes
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      <XCircle className="w-3 h-3 mr-1" />
                      No
                    </Badge>
                  )}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Email Status */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Email Communications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Payment Request Sent</label>
                <p className="text-sm">
                  {user.paymentRequestSent ? (
                    <div>
                      <Badge className="bg-blue-100 text-blue-800">
                        <Mail className="w-3 h-3 mr-1" />
                        Yes
                      </Badge>
                      {user.paymentRequestSentAt && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(user.paymentRequestSentAt)}
                        </p>
                      )}
                    </div>
                  ) : (
                    <Badge variant="outline">No</Badge>
                  )}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Final Email Sent</label>
                <p className="text-sm">
                  {user.finalEmailSent ? (
                    <div>
                      <Badge className="bg-orange-100 text-orange-800">
                        <Mail className="w-3 h-3 mr-1" />
                        Yes
                      </Badge>
                      {user.finalEmailSentAt && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(user.finalEmailSentAt)}
                        </p>
                      )}
                    </div>
                  ) : (
                    <Badge variant="outline">No</Badge>
                  )}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Documents */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">CV/Resume</label>
                {user.cvUrl ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(user.cvUrl, '_blank')}
                    className="mt-1"
                  >
                    <FileText className="w-3 h-3 mr-1" />
                    View CV
                  </Button>
                ) : (
                  <p className="text-sm text-muted-foreground">Not uploaded</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">IEEE ID Card</label>
                {user.ieeeIdCardUrl ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(user.ieeeIdCardUrl, '_blank')}
                    className="mt-1"
                  >
                    <FileText className="w-3 h-3 mr-1" />
                    View ID Card
                  </Button>
                ) : (
                  <p className="text-sm text-muted-foreground">Not uploaded</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Payment Receipt</label>
                {user.paymentScreenshotUrl ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(user.paymentScreenshotUrl, '_blank')}
                    className="mt-1"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    View Receipt
                  </Button>
                ) : (
                  <p className="text-sm text-muted-foreground">Not uploaded</p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Actions</h3>
            <div className="flex flex-wrap gap-2">
              {!user.isVerified && !user.finalEmailSent && (
                <>
                  <Button
                    size="sm"
                    onClick={() => onVerifyUser?.(user._id)}
                    disabled={isProcessing}
                    className="flex items-center gap-1"
                  >
                    <Shield className="w-3 h-3" />
                    Approve & Send Payment Email
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSendFinalEmail?.(user._id)}
                    disabled={isProcessing}
                    className="flex items-center gap-1"
                  >
                    <Mail className="w-3 h-3" />
                    Send Final Email
                  </Button>
                </>
              )}
              {user.isVerified && !user.isPaymentVerified && (
                <Button
                  size="sm"
                  onClick={() => onVerifyPayment?.(user._id)}
                  disabled={isProcessing}
                  className="flex items-center gap-1"
                >
                  <CreditCard className="w-3 h-3" />
                  Mark Payment as Verified
                </Button>
              )}
              {user.isVerified && user.isPaymentVerified && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  All Actions Complete
                </Badge>
              )}
              {!user.isVerified && user.finalEmailSent && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  Final Email Sent
                </Badge>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 