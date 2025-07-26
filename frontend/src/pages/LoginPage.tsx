import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import videoSrc from "../assets/videos/b11.mp4";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem("token", data.token);
        navigate("/"); // Navigate to landing page after successful login
      } else {
        setError(data.error || "Invalid email or password");
      }
    } catch (err) {
      console.error("Error during login:", err);
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
          Login
        </h2>

        {error && (
          <div className="text-red-400 text-sm mb-4 text-center">{error}</div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 rounded-md bg-black/20 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm text-gray-300 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-3 rounded-md bg-black/20 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 rounded-lg font-semibold hover:opacity-90 transition-all duration-300"
          >
            Log In
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-cyan-400 hover:underline font-semibold"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
