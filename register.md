"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  User,
  Mail,
  Phone,
  Users,
  Shield,
  Building,
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DotBackground } from "@/components/ui/dot-background";
import axios from   "axios";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
const steps = ["Personal Info", "Membership Info", "Account Info"];

const registrationSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(8, "Enter a valid phone number"),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Gender is required",
  }),
  isIeeeCSMember: z.boolean(),
  membershipId: z.string().min(1, "IEEE Membership ID is required"),
  idCard: z.any().optional().refine((file) => file instanceof File, {
    message: "ID Card is required",
  }),
  cv: z.any().optional().refine((file) => file instanceof File, {
    message: "CV is required",
  }),
  password: z.string().min(6, "Password must be at least 6 characters"),
  institution: z.string().min(2, "Institution is required"),
  designation: z.string().min(2, "Designation is required"),
});

export default function RegisterPage() {
  const [step, setStep] = React.useState(0);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      gender: "male",
      isIeeeCSMember: false,
      membershipId: "",
      idCard: undefined,
      cv: undefined,
      password: "",
      institution: "",
      designation: "",
    },
    mode: "onTouched",
  });

  const isIeeeCSMember = watch("isIeeeCSMember");
  const idCard = watch("idCard");
  const cv = watch("cv");

  async function onSubmit(data: any) {
    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("gender", data.gender);
      formData.append("password", data.password);
      formData.append("designation", data.designation);
      formData.append("institutionCompany", data.institution);
      formData.append("isIeeeCSMember", String(data.isIeeeCSMember));
      formData.append("ieeeMemberId", data.membershipId);
      if (data.idCard) {
        formData.append("idCard", data.idCard);
      }
      if (data.cv) {
        formData.append("cv", data.cv);
      }

      const response = await axios.post("/api/register", formData);
      if (response.status === 201) {
        toast.success("Registration successful");
        
        // Auto-login after successful registration
        const loginResult = await signIn("credentials", {
          redirect: false,
          email: data.email,
          password: data.password,
        });
        if (loginResult && !loginResult.error) {
          router.push("/profile"); 
        } else {
          toast.error("Auto-login failed. Please sign in manually.");
        }
      } else {
        toast.error("Registration failed");
      }
    } catch (error) {
      toast.error("Registration failed");
      console.error("Error during registration:", error);
    }
  }

  const getStepIcon = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return <User className="w-4 h-4" />;
      case 1:
        return <Users className="w-4 h-4" />;
      case 2:
        return <Shield className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  // Step navigation logic
  function nextStep() {
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }
  function prevStep() {
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setStep((s) => Math.max(s - 1, 0));
  }

  return (
    <DotBackground>
      <div className="min-h-screen flex items-center pt-20 md:pt-24 justify-center relative overflow-hidden w-full">
        <div className="relative z-10 w-full flex justify-center">
          {/* Main container */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 relative border border-neutral-200 dark:border-neutral-800 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl transition-colors duration-300 mx-2 sm:mx-4">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-2 tracking-tight">
                Register
              </h1>
            </div>

            {/* Progress indicator */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-row items-center justify-between mb-4 gap-4">
                {steps.map((label, i) => (
                  <div
                    key={label}
                    className="flex flex-col items-center relative flex-1 min-w-[60px]">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 z-10 border-2 shadow-md ${
                        i <= step
                          ? "bg-blue-600 dark:bg-blue-700 text-white border-blue-500 dark:border-blue-400 shadow-blue-100 dark:shadow-blue-900"
                          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 border-neutral-300 dark:border-neutral-700"
                      }`}>
                      {i < step ? (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        getStepIcon(i)
                      )}
                    </div>
                    <span
                      className={`text-xs mt-2 font-semibold tracking-wide ${
                        i <= step
                          ? "text-blue-700 dark:text-blue-300"
                          : "text-neutral-400 dark:text-neutral-500"
                      }`}>
                      {label}
                    </span>
                    {i < steps.length - 1 && (
                      <div className="absolute top-4 sm:top-5 left-1/2 w-full h-0.5 bg-neutral-200 dark:bg-neutral-800 -z-10">
                        <div
                          className={`h-full bg-blue-200 dark:bg-blue-800 transition-all duration-500 rounded-full ${
                            i < step ? "w-full" : "w-0"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <form 
              onSubmit={handleSubmit(onSubmit, (formErrors) => {
                // Find the first error message
                const firstError = Object.values(formErrors)[0];
                if (firstError && typeof firstError.message === 'string') {
                  toast.error(firstError.message);
                } else if (firstError) {
                  toast.error('Please fill in all required fields correctly.');
                }
              })}
              onKeyDown={e => {
                if (e.key === 'Enter' && step !== steps.length - 1) {
                  e.preventDefault();
                }
              }}
              className="space-y-6"
            >
              {step === 0 && (
                <div className="space-y-5 animate-in slide-in-from-right duration-300">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 dark:text-blue-100 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <Input
                        {...register("fullName")}
                        placeholder="Enter your full name"
                        className="w-full pl-12 pr-4 py-3 border-2 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 focus:outline-none transition-colors duration-200 shadow-sm"
                        required
                      />
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 dark:text-blue-300 w-5 h-5" />
                    </div>
                    {errors.fullName && (
                      <p className="text-xs text-red-500 mt-1">
                        {String(errors.fullName.message)}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 dark:text-blue-100 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Input
                        {...register("email")}
                        type="email"
                        placeholder="Enter your email"
                        className="w-full pl-12 pr-4 py-3 border-2 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 focus:outline-none transition-colors duration-200 shadow-sm"
                        required
                      />
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 dark:text-blue-300 w-5 h-5" />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">
                        {String(errors.email.message)}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 dark:text-blue-100 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Input
                        {...register("phone")}
                        placeholder="Enter your phone number"
                        className="w-full pl-12 pr-4 py-3 border-2 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 focus:outline-none transition-colors duration-200 shadow-sm"
                        required
                      />
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 dark:text-blue-300 w-5 h-5" />
                    </div>
                    {errors.phone && (
                      <p className="text-xs text-red-500 mt-1">
                        {String(errors.phone.message)}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 dark:text-blue-100 mb-2">
                      Gender *
                    </label>
                    <select
                      {...register("gender")}
                      className="w-full px-4 py-3 border-2 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 focus:outline-none transition-colors duration-200 shadow-sm"
                      required>
                      <option value="">Select your gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && (
                      <p className="text-xs text-red-500 mt-1">
                        {String(errors.gender.message)}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-6 animate-in slide-in-from-right duration-300">
                  <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl p-6 transition-colors duration-300">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <input
                          type="checkbox"
                          id="isIeeeCSMember"
                          {...register("isIeeeCSMember")}
                          className="hidden"
                        />
                        <div
                          onClick={() => setValue("isIeeeCSMember", !isIeeeCSMember)}
                          className={`w-5 h-5 border-2 rounded cursor-pointer transition-all duration-200 flex items-center justify-center ${
                            isIeeeCSMember
                              ? "bg-blue-600 dark:bg-blue-700 border-blue-500 dark:border-blue-400"
                              : "border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:border-blue-400 dark:hover:border-blue-700"
                          }`}>
                          {isIeeeCSMember && (
                            <Check className="w-3 h-3 text-blue-700 dark:text-blue-200 m-0.5" />
                          )}
                        </div>
                      </div>
                      <label
                        className="text-neutral-800 dark:text-blue-100 font-medium cursor-pointer"
                        htmlFor="isIeeeCSMember">
                        I am an IEEE CS Chapter Member
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 dark:text-blue-100 mb-2">
                      IEEE Membership ID *
                    </label>
                    <Input
                      {...register("membershipId", { required: true })}
                      placeholder="Enter your IEEE membership ID"
                      className="w-full px-4 py-3 border-2 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 focus:outline-none transition-colors duration-200 shadow-sm"
                      required
                    />
                    {errors.membershipId && (
                      <p className="text-xs text-red-500 mt-1">
                        {String(errors.membershipId.message)}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 dark:text-blue-100 mb-2">
                      Upload ID Card *
                    </label>
                    <Controller
                      control={control}
                      name="idCard"
                      render={({ field: { onChange } }) => (
                        <div className="relative border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-xl p-6 text-center hover:border-blue-400 dark:hover:border-blue-700 transition-colors duration-200 cursor-pointer group bg-white dark:bg-neutral-800">
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              onChange(file);
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            required
                          />
                          <div className="space-y-2">
                            <div className="w-12 h-12 mx-auto bg-neutral-100 dark:bg-neutral-900 rounded-full flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-950 transition-colors duration-200">
                              <svg
                                className="w-6 h-6 text-blue-500 dark:text-blue-300 group-hover:text-blue-700 dark:group-hover:text-blue-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-neutral-800 dark:text-blue-100 font-medium">
                                {idCard
                                  ? idCard.name
                                  : "Choose file or drag & drop"}
                              </p>
                              <p className="text-blue-700 dark:text-blue-300 text-sm">
                                PNG, JPG or PDF (max 5MB)
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    />
                    {errors.idCard &&
                      typeof errors.idCard.message === "string" && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.idCard.message}
                        </p>
                      )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 dark:text-blue-100 mb-2">
                      Upload CV *
                    </label>
                    <Controller
                      control={control}
                      name="cv"
                      render={({ field: { onChange } }) => (
                        <div className="relative border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-xl p-6 text-center hover:border-blue-400 dark:hover:border-blue-700 transition-colors duration-200 cursor-pointer group bg-white dark:bg-neutral-800">
                          <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              onChange(file);
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className="space-y-2">
                            <div className="w-12 h-12 mx-auto bg-neutral-100 dark:bg-neutral-900 rounded-full flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-950 transition-colors duration-200">
                              <svg
                                className="w-6 h-6 text-blue-500 dark:text-blue-300 group-hover:text-blue-700 dark:group-hover:text-blue-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-neutral-800 dark:text-blue-100 font-medium">
                                {cv
                                  ? cv.name
                                  : "Choose PDF file or drag & drop"}
                              </p>
                              <p className="text-blue-700 dark:text-blue-300 text-sm">
                                PDF only (max 3 pages, 5MB)
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    />
                    {errors.cv &&
                      typeof errors.cv.message === "string" && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.cv.message}
                        </p>
                      )}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5 animate-in slide-in-from-right duration-300">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 dark:text-blue-100 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <Input
                        {...register("password")}
                        type="password"
                        placeholder="Create a strong password"
                        className="w-full pl-12 pr-4 py-3 border-2 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 focus:outline-none transition-colors duration-200 shadow-sm"
                        required
                      />
                      <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 dark:text-blue-300 w-5 h-5" />
                    </div>
                    {errors.password && (
                      <p className="text-xs text-red-500 mt-1">
                        {String(errors.password.message)}
                      </p>
                    )}
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      Minimum 8 characters recommended
                    </p>
                  </div>

                  <div> 
                    <label className="block text-sm font-semibold text-neutral-800 dark:text-blue-100 mb-2">
                      Institution/Company *
                    </label>
                    <div className="relative">
                      <Input
                        {...register("institution")}
                        placeholder="Your institution or company"
                        className="w-full pl-12 pr-4 py-3 border-2 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 focus:outline-none transition-colors duration-200 shadow-sm"
                        required
                      />
                      <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 dark:text-blue-300 w-5 h-5" />
                    </div>
                    {errors.institution && (
                      <p className="text-xs text-red-500 mt-1">
                        {String(errors.institution.message)}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 dark:text-blue-100 mb-2">
                      Designation *
                    </label>
                    <Input
                      {...register("designation")}
                      placeholder="Your role or designation"
                      className="w-full px-4 py-3 border-2 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 focus:outline-none transition-colors duration-200 shadow-sm"
                      required
                    />
                    {errors.designation && (
                      <p className="text-xs text-red-500 mt-1">
                        {String(errors.designation.message)}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-8 mt-8 border-t border-neutral-200 dark:border-neutral-800">
                {step > 0 ? (
                  <Button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center justify-center space-x-2 px-6 py-3 text-blue-700 dark:text-blue-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-xl transition-all duration-200 font-medium border border-neutral-200 dark:border-neutral-700 shadow-sm w-full sm:w-auto">
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </Button>
                ) : (
                  <div className="hidden sm:block w-full sm:w-auto"></div>
                )}

                {step < steps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center justify-center space-x-2 px-8 py-3 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-xl transition-all duration-200 font-medium shadow-lg shadow-blue-100 dark:shadow-blue-900 hover:shadow-xl hover:shadow-blue-200 dark:hover:shadow-blue-800 border border-blue-500 dark:border-blue-400 z-50 w-full sm:w-auto">
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center justify-center space-x-2 px-8 py-3 bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800 text-white rounded-xl transition-all duration-200 font-medium shadow-lg shadow-green-100 dark:shadow-green-900 hover:shadow-xl hover:shadow-green-200 dark:hover:shadow-green-800 border border-green-500 dark:border-green-400 w-full sm:w-auto">
                    {isSubmitting ? (
                      <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    <span>{isSubmitting ? 'Submitting...' : 'Complete Registration'}</span>
                  </Button>
                )}
              </div>
            </form>

            {/* Footer text */}
            <p className="text-center text-blue-700/80 dark:text-blue-200/80 text-sm mt-6">
              Already have an account?{" "}
              <Link href={"/login"} className="text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-white font-medium underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </DotBackground>
  );
}
