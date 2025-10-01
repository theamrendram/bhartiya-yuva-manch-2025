"use client";

import { User } from "@/types/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CalendarDays,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  FileCheck,
  LogOut,
  Loader2,
  Upload,
  CheckCircle,
  AlertCircle,
  X,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react";
import Image from "next/image";
import axios from "axios";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 }
};

// Custom hooks
const useUserData = (session: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = useCallback(async () => {
    if (!session?.user?.id) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`/api/user`);
      console.log(response);
      setUser(response.data);
    } catch (error) {
      const message = axios.isAxiosError(error) 
        ? error.response?.data?.message || "Failed to load user data"
        : "An unexpected error occurred";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return { user, isLoading, error, refetch: fetchUserData };
};

const useFileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const validateFile = useCallback((file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 5MB";
    }
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      return "Only JPEG and PNG files are allowed";
    }
    return null;
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const error = validateFile(selectedFile);
    if (error) {
      setUploadError(error);
      toast.error(error);
      return;
    }

    setFile(selectedFile);
    setUploadError(null);
  }, [validateFile]);

  const uploadFile = useCallback(async (email: string, onSuccess?: () => void) => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("paymentScreenshot", file);
    formData.append("email", email);

    setIsUploading(true);
    try {
      await axios.post("/api/upload-payment-screenshot", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Payment screenshot uploaded successfully!");
      setFile(null);
      onSuccess?.();
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Upload failed"
        : "An unexpected error occurred";
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  }, [file]);

  const resetFile = useCallback(() => {
    setFile(null);
    setUploadError(null);
  }, []);

  return {
    file,
    isUploading,
    uploadError,
    handleFileChange,
    uploadFile,
    resetFile
  };
};

// Main component
export function UserProfile({ session }: { session: any }) {
  const { user, isLoading, error, refetch } = useUserData(session);
  const { file, isUploading, uploadError, handleFileChange, uploadFile, resetFile } = useFileUpload();

  const handleLogout = useCallback(async () => {
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out. Please try again.");
    }
  }, []);

  const handleUpload = useCallback(() => {
    if (user?.email) {
      uploadFile(user.email, refetch);
    }
  }, [user?.email, uploadFile, refetch]);

  const userDisplayName = useMemo(() => 
    user?.fullName || 'User',
    [user?.fullName]
  );

  const userInitials = useMemo(() => {
    if (!user?.fullName) return 'U';
    const names = user.fullName.split(' ');
    return names.map(name => name[0]).join('').toUpperCase().slice(0, 2);
  }, [user?.fullName]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen error={error} onRetry={refetch} />;
  }

  if (!user) {
    return <EmptyState />;
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="container mx-auto pt-16 p-4 md:pt-24 sm:p-6 min-h-screen flex flex-col justify-center">
      
      <Card className="w-full max-w-4xl mx-auto relative shadow-2xl rounded-3xl border-none bg-white/80 dark:bg-background/80 backdrop-blur-lg">
        {/* Header with logout button */}
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground rounded-full"
            aria-label="Sign out">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Profile header */}
        <CardHeader className="flex flex-col sm:flex-row items-center gap-6 pb-6 pt-8 px-6 sm:px-8">
          <motion.div
            variants={scaleIn}
            initial="initial"
            animate="animate"
            className="relative">
            <div className="shadow-lg rounded-full border-4 border-primary/20 bg-white/60 dark:bg-background/60 backdrop-blur-md p-1">
              <Avatar className="w-24 h-24 sm:w-28 sm:h-28">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${userDisplayName}&backgroundColor=c0392b,27ae60,f39c12,8e44ad,3498db`}
                  alt={`${userDisplayName} avatar`}
                />
                <AvatarFallback className="text-xl sm:text-2xl font-bold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </div>
            {user.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            )}
          </motion.div>

          <div className="text-center sm:text-left flex-1">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              {userDisplayName}
            </CardTitle>
            <p className="text-muted-foreground text-base sm:text-lg font-medium mb-3">
              {user.designation} at {user.institutionCompany}
            </p>
            <StatusBadges user={user} />
          </div>
        </CardHeader>

        <CardContent className="px-6 sm:px-8 pb-8">
          {/* Contact Information */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}>
            <InfoSection title="Contact Information">
              <InfoGrid>
                <InfoItem icon={<Mail />} label="Email" value={user.email} copyable />
                <InfoItem icon={<Phone />} label="Phone" value={user.phone} copyable />
                <InfoItem 
                  icon={<CalendarDays />} 
                  label="Gender" 
                  value={user.gender} 
                />
              </InfoGrid>
            </InfoSection>
          </motion.div>

          {/* Professional Information */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.3 }}>
            <InfoSection title="Professional Information">
              <InfoGrid>
                <InfoItem
                  icon={<Briefcase />}
                  label="Institution/Company"
                  value={user.institutionCompany}
                />
                {user.ieeeMemberId && (
                  <InfoItem
                    icon={<CreditCard />}
                    label="IEEE Member ID"
                    value={user.ieeeMemberId}
                    copyable
                  />
                )}
              </InfoGrid>
            </InfoSection>
          </motion.div>

          {/* Documents and Payment */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.4 }}>
            <InfoSection title="Documents & Payment">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {user.ieeeMemberId && (
                  <DocumentCard
                    title="IEEE ID Card"
                    imageUrl={user.ieeeIdCardUrl}
                    status={user.ieeeIdCardUrl ? "uploaded" : "pending"}
                  />
                )}
                {user.paymentScreenshotUrl && (
                  <DocumentCard
                    title="Payment Receipt"
                    imageUrl={user.paymentScreenshotUrl}
                    status={"uploaded"}
                  />
                )}
                {!user.paymentScreenshotUrl && (
                  <PaymentCard
                    user={user}
                    file={file}
                    isUploading={isUploading}
                    uploadError={uploadError}
                    onFileChange={handleFileChange}
                    onUpload={handleUpload}
                    onResetFile={resetFile}
                  />
                )}
              </div>
            </InfoSection>
          </motion.div>
        </CardContent>
      </Card>

      {/* Contact support */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.6 }}
        className="text-center mt-8">
        <p className="text-muted-foreground">
          Need help with registration?{" "}
          <a
            href="mailto:dssywlc@gmail.com"
            className="text-primary font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded">
            Contact Support
          </a>
        </p>
      </motion.div>
    </motion.div>
  );
}

// Sub-components
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
        <p className="text-lg font-medium text-muted-foreground">Loading your profile...</p>
      </motion.div>
    </div>
  );
}

function ErrorScreen({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={onRetry} className="w-full">
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-6 text-center">
          <FileCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No profile found</h2>
          <p className="text-muted-foreground">Please contact support for assistance.</p>
        </CardContent>
      </Card>
    </div>
  );
}

function StatusBadges({ user }: { user: User }) {
  return (
    <div className="flex flex-wrap justify-center sm:justify-start gap-2">
      <Badge variant="secondary" className="text-xs px-3 py-1">
        {user.role}
      </Badge>
      {user.ieeeMemberId && (
        <Badge variant="secondary" className="text-xs px-3 py-1">
          IEEE Member
        </Badge>
      )}
      <Badge 
        variant={user.isVerified ? "default" : "secondary"} 
        className={`text-xs px-3 py-1 flex items-center gap-1 ${
          user.isVerified ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : ""
        }`}>
        {user.isVerified ? (
          <>
            <CheckCircle className="w-3 h-3" />
            Verified
          </>
        ) : (
          <>
            <Loader2 className="w-3 h-3 animate-spin" />
            Pending Verification
          </>
        )}
      </Badge>
      {user.isPaymentVerified && (
        <Badge variant="default" className="text-xs px-3 py-1 flex items-center gap-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          <CheckCircle className="w-3 h-3" />
          Payment Verified
        </Badge>
      )}
    </div>
  );
}

function InfoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 text-foreground">{title}</h3>
      {children}
    </div>
  );
}

function InfoGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {children}
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
  copyable = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  copyable?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!copyable || !value) return;
    
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(`${label} copied to clipboard`);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  }, [copyable, value, label]);

  return (
    <motion.div
      variants={scaleIn}
      className="flex items-center gap-3 bg-muted/30 rounded-xl p-2 border border-border hover:shadow-md transition-all group">
      <span className="flex-shrink-0 text-primary">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
          {label}
        </p>
        <p className="font-medium text-foreground break-words">{value}</p>
      </div>
      {copyable && value && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-2"
          aria-label={`Copy ${label}`}>
          {copied ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      )}
    </motion.div>
  );
}

function DocumentCard({
  title,
  imageUrl,
  status,
}: {
  title: string;
  imageUrl?: string;
  status: "uploaded" | "pending";
}) {
  const [showImage, setShowImage] = useState(false);

  return (
    <div className="bg-muted/30 rounded-xl p-4 border border-border">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium">{title}</h4>
        <Badge variant={status === "uploaded" ? "default" : "secondary"}>
          {status === "uploaded" ? "Uploaded" : "Pending"}
        </Badge>
      </div>
      
      {imageUrl ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowImage(!showImage)}
              className="text-xs">
              {showImage ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
              {showImage ? "Hide" : "View"}
            </Button>
          </div>
          <AnimatePresence>
            {showImage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={title}
                  width={300}
                  height={200}
                  className="rounded-lg object-cover w-full aspect-[3/2] border"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-8">
          <FileCheck className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">No document uploaded</p>
        </div>
      )}
    </div>
  );
}

function PaymentCard({
  user,
  file,
  isUploading,
  uploadError,
  onFileChange,
  onUpload,
  onResetFile,
}: {
  user: User;
  file: File | null;
  isUploading: boolean;
  uploadError: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
  onResetFile: () => void;
}) {
  const [showPaymentImage, setShowPaymentImage] = useState(false);

  const getPaymentStatus = () => {
    if (user.isPaid && user.isPaymentVerified) return "completed";
    if (user.paymentRequestSent) return "pending";
    return "waiting";
  };

  const status = getPaymentStatus();

  return (
    <div className="bg-muted/30 rounded-xl p-4 border border-border">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium">Payment Details</h4>
        <Badge variant={status === "completed" ? "default" : "secondary"}>
          {status === "completed" && "Completed"}
          {status === "pending" && "Pending"}
          {status === "waiting" && "Waiting"}
        </Badge>
      </div>

      {status === "completed" && user.paymentScreenshotUrl && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPaymentImage(!showPaymentImage)}
              className="text-xs">
              {showPaymentImage ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
              {showPaymentImage ? "Hide" : "View"} Receipt
            </Button>
          </div>
          <AnimatePresence>
            {showPaymentImage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden">
                <Image
                  src={user.paymentScreenshotUrl}
                  alt="Payment receipt"
                  width={300}
                  height={200}
                  className="rounded-lg object-cover w-full aspect-[3/2] border"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {status === "pending" && (
        <div className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Payment link has been sent to your email. Please make payment and upload the receipt here.
            </AlertDescription>
          </Alert>
          
          <FileUploadArea
            file={file}
            error={uploadError}
            onChange={onFileChange}
            onReset={onResetFile}
          />
          
          <Button
            onClick={onUpload}
            disabled={!file || isUploading}
            className="w-full">
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Receipt
              </>
            )}
          </Button>
        </div>
      )}

      {status === "waiting" && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            After verification of your documents, you will receive a payment link via email.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

function FileUploadArea({
  file,
  error,
  onChange,
  onReset,
}: {
  file: File | null;
  error: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="payment-upload" className="block">
        <div className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          error ? "border-destructive bg-destructive/10" : "border-primary/40 bg-primary/5 hover:bg-primary/10"
        }`}>
          <Input
            id="payment-upload"
            type="file"
            accept={ACCEPTED_FILE_TYPES.join(',')}
            onChange={onChange}
            className="hidden"
            aria-label="Upload payment receipt"
          />
          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {file ? file.name : "Choose payment receipt"}
            </p>
            <p className="text-xs text-muted-foreground">
              JPEG or PNG, max 5MB
            </p>
          </div>
        </div>
      </Label>
      
      {file && (
        <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
          <span className="text-sm truncate">{file.name}</span>
          <Button variant="ghost" size="sm" onClick={onReset}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}