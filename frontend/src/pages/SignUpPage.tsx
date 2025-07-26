import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import videoSrc from "../assets/videos/b11.mp4";

const SignUpPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Signup successful:", data);
        navigate("/login"); // Redirect to login after successful sign-up
      } else {
        console.error("Signup failed:", data);
        setError(data.error || "Signup failed.");
      }
    } catch (err) {
      console.error("Error during signup:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black text-white">
      <div className="absolute inset-0 z-0">
        <video autoPlay muted loop className="w-full h-full object-cover">
          <source src={videoSrc} type="video/mp4" />
        </video>
      </div>

      <div className="relative z-10 w-full max-w-md p-8 bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl mt-12 mx-4 border border-purple-500/30">
        <h2 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-gradient-x">
          Create Account
        </h2>

        {error && (
          <div className="text-red-400 text-sm mb-4 text-center">{error}</div>
        )}

        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-300 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-md bg-black/20 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter your full name"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-300 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-md bg-black/20 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-300 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-md bg-black/20 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Enter a strong password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 rounded-lg text-white font-semibold hover:opacity-90 transition-all duration-300"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center mt-6 text-sm">
          <p className="text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-cyan-400 hover:underline font-semibold"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
