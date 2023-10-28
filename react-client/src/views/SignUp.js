// SignupForm.js
import React, { useState } from 'react';
import "../index.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Clear the error message for the field being changed
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setErrors({
        username: formData.username ? '' : 'Username is required',
        email: formData.email ? '' : 'Email is required',
        password: formData.password ? '' : 'Password is required',
        confirmPassword: formData.confirmPassword ? '' : 'Confirm Password is required',
      });
      return; // Don't submit the form if there are errors
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors({
        ...errors,
        confirmPassword: 'Passwords do not match',
      });
      return;
    }

    // If all fields are filled and passwords match, you can proceed with your logic
    // For example, you can use formData.username, formData.email, formData.password

    // Clear the form data after submission (optional)
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
      <form className="w-96 bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 text-dark text-center">Sign Up</h2>
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-900 text-sm font-semibold mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-600"
          />
          <p className="text-red-500 text-sm mt-1">{errors.username}</p>
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-900 text-sm font-semibold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-600"
          />
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-900 text-sm font-semibold mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-600"
          />
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        </div>
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-gray-900 text-sm font-semibold mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-600"
          />
          <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
        </div>
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
