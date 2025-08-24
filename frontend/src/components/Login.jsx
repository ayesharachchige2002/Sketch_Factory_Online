import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: `url('/forest-background.jpg')`, // Add forest background image
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>

      {/* Login card */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 backdrop-blur-md bg-white/10 p-8 rounded-2xl shadow-lg w-96"
      >
        {/* Close button */}
        <div className="flex justify-end mb-2">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-gray-300 hover:text-white text-xl font-bold"
          >
            &times;
          </button>
        </div>

        <h2 className="text-3xl font-bold text-center text-white mb-6">Login</h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        {/* Remember me & Forgot Password */}
        <div className="flex items-center justify-between text-sm text-gray-200 mb-4">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            Remember me
          </label>
         
                      <a
              href="/forgot-password"
              className="hover:underline text-blue-300"
            >
              Forgot Password?
            </a>



        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
        >
          Login
        </button>

        {/* Register */}
        <p className="text-center text-gray-200 mt-4">
          Don’t have an account?{' '}
          <a href="/register" className="text-blue-400 hover:underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
