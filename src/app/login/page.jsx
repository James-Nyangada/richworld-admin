'use client'
import { useState } from "react";
import {useRouter} from "next/navigation";
import { GalleryVerticalEnd } from "lucide-react";
import axios from "axios";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";


// SignupForm Component
function SignupForm({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [step, setStep] = useState("form");
  const [verificationCode, setVerificationCode] = useState("");
  const [userId, setUserId] = useState(null);

  const API = process.env.NEXT_PUBLIC_API_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }
    try {
      
      const response = await axios.post(`${API}/api/auth/register`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      setUserId(response.data.user._id);
      setStep("verify");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleVerification = async () => {
    setError("");
    try {
      await axios.post(`${API}/api/auth/verify-email`, {
        userId,
        code: verificationCode
      });
      alert("Email verified successfully. You may now log in.");
      onSwitchToLogin();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const resendCode = async () => {
    setError("");
    try {
      await axios.post(`${API}/api/auth/resend-code`, { userId });
      alert("Verification code resent.");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  if (step === "verify") {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Verify Your Email</h1>
          <p className="text-muted-foreground text-sm">Enter the code sent to your email address</p>
        </div>
        <InputOTP
        className={"text-center"}
          maxLength={6}
          value={verificationCode}
          onChange={(val) => setVerificationCode(val)}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <Button className="w-full mt-4 cursor-pointer" onClick={handleVerification}>Verify Email</Button>
        <Button className="w-full mt-2 cursor-pointer" onClick={resendCode}>Resend Code</Button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <div className="text-center text-sm">
          {verificationCode === "" ? (
            <>Enter your one-time password.</>
          ) : (
            <>You entered: {verificationCode}</>
          )}
        </div>
      </div>
    );
  }



  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Sign Up</h1>
        <p className="text-muted-foreground text-sm">Create your account to get started</p>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium">
              First Name
            </label>
            <input
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              placeholder="John"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium">
              Last Name
            </label>
            <input
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              placeholder="Doe"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Work/Personal Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            placeholder="name@example.com"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          />
        </div>
        <button
          type="submit"
          className="bg-[#fb7105] cursor-pointer text-primary-foreground hover:bg-primary/90 inline-flex h-10 w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          Sign Up
        </button>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <button 
            onClick={onSwitchToLogin} 
            className="text-[#fb7105] cursor-pointer underline underline-offset-4 hover:text-primary/90"
          >
            Log in
          </button>
        </div>
      </div>
    </form>
  );
}

// LoginForm Component
function LoginForm({ onSwitchToSignup }) {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL;

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(`${API}/api/auth/login`, credentials);
      Cookies.set("token", response.data.token, {
        path: "/",
        sameSite: "strict",
        secure: false, // true in production w/ HTTPS
      });
      Cookies.set("role", response.data.user.role, {
        path: "/",
        sameSite: "strict",
        secure: false,
      });
      Cookies.set("user", JSON.stringify({
        firstName: response.data.user.firstName,
        lastName: response.data.user.lastName,
        email: response.data.user.email
      }), {
        path: "/",
        sameSite: "strict",
        secure: false,
      });
      
      alert("Login successful");
      const role = response.data.user.role;
      if (role === "super-admin") {
        router.push("/super-admin/dashboard");
      } else if (role === "admin") {
        router.push("/admin/dashboard");
      } else if (role === "user") {
        router.push("/user/dashboard");
      }
      else {
        router.push("/unauthorized");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };


  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-muted-foreground text-sm">Enter your credentials to access your account</p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={credentials.email} onChange={handleChange}
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            placeholder="name@example.com"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <a href="#" className="text-primary underline underline-offset-4 hover:text-primary/90 text-sm">
              Forgot password?
            </a>
          </div>
          <input
            id="password"
            type="password"
            value={credentials.password} onChange={handleChange}
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
         type="submit"
          className="bg-[#fb7105] cursor-pointer text-primary-foreground hover:bg-primary/90 inline-flex h-10 w-full items-center cursor-pointer justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          Log In
        </button>
        <div className="text-center text-sm">
          Don't have an account?{" "}
          <button 
            onClick={onSwitchToSignup} 
            className="text-[#fb7105] cursor-pointer underline underline-offset-4 hover:text-primary/90"
          >
            Sign up
          </button>
        </div>
      </div>
    </form>
  );
}

// Main Page Component with Form Switching
export default function LoginPage() {
  const [isLoginForm, setIsLoginForm] = useState(true);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Wow Radio
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {isLoginForm ? (
              <LoginForm onSwitchToSignup={() => setIsLoginForm(false)} />
            ) : (
              <SignupForm onSwitchToLogin={() => setIsLoginForm(true)} />
            )}
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/images/login.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}