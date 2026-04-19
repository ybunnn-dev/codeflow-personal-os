"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import SignUpForm from "./signup_form"; 

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);
    
    if (res?.error) {
      setError("Invalid credentials");
    } else {
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="relative min-h-screen w-full flex overflow-hidden bg-gray-50 font-sans">
      <div 
        className={`flex w-full lg:w-1/2 flex-col justify-center items-center transition-all duration-500 absolute left-0 h-full z-20 lg:z-10 bg-gray-50
        ${isSignUp ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <SignUpForm onLoginClick={() => setIsSignUp(false)} />
      </div>
      <div 
        className={`w-full lg:w-1/2 flex flex-col justify-center items-center transition-all duration-500 absolute right-0 h-full z-20 lg:z-10 bg-white lg:bg-transparent
        ${!isSignUp ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <div className="w-full max-w-md space-y-8 bg-white px-8 py-12 rounded-xl">
          <div className="text-left">
            <h2 className="text-3xl font-bold tracking-tight text-text_heavy">Welcome Back</h2>
            <p className="mt-2 text-sm text-text_light">Please enter your details to access your account.</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text_semi">Email address</label>
                <input
                  type="email"
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-text_heavy shadow-sm focus:border-light_brown focus:ring-1 focus:ring-light_brown placeholder:text-gray-400"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text_semi">Password</label>
                <input
                  type="password"
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-text_heavy shadow-sm focus:border-light_brown focus:ring-1 focus:ring-light_brown placeholder:text-gray-400"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-color_red border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-lg bg-text_heavy px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-text_semi focus:ring-2 focus:ring-light_brown transition-all"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <div className="relative mt-8">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500">or</span>
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={() => setIsSignUp(true)}
              className="flex w-full justify-center rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 text-sm font-semibold text-text_semi hover:border-light_brown hover:text-light_brown transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
      <div 
        className={`hidden lg:flex flex-col justify-center items-center bg-light_coffee absolute top-0 w-1/2 h-full z-40 transition-transform duration-700 ease-in-out shadow-2xl overflow-hidden
        ${isSignUp ? "translate-x-full" : "translate-x-0"}`}
      >
        <div className="absolute top-0 left-0 w-64 h-64 bg-mocha rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-light_brown rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="relative z-10 text-center px-12">
          <h1 className="text-5xl font-bold text-text_heavy mb-6">Class Funds</h1>
          
          <div className="relative h-16 w-full"> 
             <p className={`text-xl text-text_semi transition-opacity duration-300 absolute w-full top-0 ${isSignUp ? "opacity-0" : "opacity-100"}`}>
               Manage your class finances with transparency and ease.
             </p>
             <p className={`text-xl text-text_semi transition-opacity duration-300 absolute w-full top-0 ${isSignUp ? "opacity-100" : "opacity-0"}`}>
               Already a member? <br/> Slide back to login.
             </p>
          </div>
          
          <button 
             onClick={() => setIsSignUp(!isSignUp)}
             className="mt-8 px-8 py-2 border-2 border-text_heavy text-text_heavy rounded-full font-semibold hover:bg-text_heavy hover:text-white transition-colors"
          >
            {isSignUp ? "Go to Login" : "Create Account"}
          </button>
        </div>
      </div>

    </div>
  );
}