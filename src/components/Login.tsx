"use client"
import { useAuth } from "@/context/AuthContext";
import { loginUser } from "@/services/auth.service";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [showPassword, setShowPassword] = useState(false);
  const {login,loading,user} = useAuth()

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
    useEffect(() => {
      if (!loading && user) {
        redirect("/dashboard");
      }
    }, [user, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const data  = await loginUser({ email, password });
      login(data)
      redirect('/dashboard')
    }
  };

  return (
    <div className="max-w-sm bg-white mx-auto p-6 space-y-5 rounded-2xl shadow-sm border">
      <h1 className="font-semibold text-center text-gray-800 text-2xl">
        Welcome back
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="flex flex-col space-y-1">
          <label htmlFor="email" className="text-sm text-gray-600">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`bg-gray-50 px-3 py-2.5 rounded-xl outline-none border text-sm transition
              ${
                errors.email
                  ? "border-red-400 focus:ring-2 focus:ring-red-200"
                  : "border-gray-200 focus:ring-2 focus:ring-black/10 focus:border-black"
              }`}
            placeholder="name@example.com"
          />

          {errors.email ? (
            <p className="text-xs text-red-500">{errors.email}</p>
          ) : (
            <p className="text-xs text-gray-400">
              We&apos;ll never share your email.
            </p>
          )}
        </div>

        <div className="flex flex-col space-y-1">
          <label htmlFor="password" className="text-sm text-gray-600">
            Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-gray-50 px-3 py-2.5 rounded-xl outline-none border text-sm transition
                ${
                  errors.password
                    ? "border-red-400 focus:ring-2 focus:ring-red-200"
                    : "border-gray-200 focus:ring-2 focus:ring-black/10 focus:border-black"
                }`}
              placeholder="••••••••"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-xs text-gray-500 hover:text-gray-700"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {errors.password ? (
            <p className="text-xs text-red-500">{errors.password}</p>
          ) : (
            <p className="text-xs text-gray-400">
              Must be at least 8 characters.
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2.5 rounded-xl text-sm font-medium hover:bg-gray-900 transition active:scale-[0.98]"
        >
          Login
        </button>
      </form>
    </div>
  );
}
