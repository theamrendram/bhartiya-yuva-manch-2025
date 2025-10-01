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
import RegistrationsClosed from "@/components/registrations-closed";
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

            <RegistrationsClosed />

            {/* Only show the form if registrations are open (currently closed) */}
            {/*
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
              ...
            </form>
            */}

            {/* Navigation buttons */}
            {/* <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-8 mt-8 border-t border-neutral-200 dark:border-neutral-800">
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
            </div> */}
          </div>
        </div>
      </div>
    </DotBackground>
  );
}
