import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { token } = useParams(); // Get token from URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/auth/reset-password/${token}`, { password });
      setMessage('Password reset successful. Redirecting to login...');
      setTimeout(() => navigate('/'), 3000); // Redirect to login after 3 seconds
    } catch (err) {
      setMessage('Failed to reset password. The link may have expired.');
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
          Reset Password
        </h2>
        <p className="text-center text-gray-300 mb-4">
          Enter your new password below
        </p>

        {/* Password */}
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
        >
          Reset Password
        </button>

        {/* Message */}
        {message && (
          <p className="text-green-300 text-center mt-4">{message}</p>
        )}
      </form>
    </div>
  );
}
