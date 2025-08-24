import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/forgot-password', { email });
      setMessage('Password reset instructions sent to your email.');
      setTimeout(() => navigate('/'), 3000); // Redirect after 3s
    } catch (err) {
      setMessage('Failed to send reset instructions. Please try again.');
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: `url('/forest-background.jpg')`,
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 backdrop-blur-md bg-white/10 p-8 rounded-2xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Forgot Password
        </h2>
        <p className="text-center text-gray-300 mb-4">
          Enter your email to receive reset instructions
        </p>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
        >
          Send Reset Link
        </button>

        {/* Back to Login */}
        <p className="text-center text-gray-300 mt-4">
          Back to{' '}
          <a href="/" className="text-blue-400 hover:underline">
            Login
          </a>
        </p>

        {/* Message */}
        {message && (
          <p className="text-green-300 text-center mt-4">{message}</p>
        )}
      </form>
    </div>
  );
}
