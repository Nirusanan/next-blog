'use client'
import Link from 'next/link';
import React, { useState } from 'react';
import OTPModal from '../../components/OTPModal';

export default function Register() {
  const [inputs, setInputs] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState("");

  const handleInput = (e) => {
    setInputs((state) => {
      return {
        ...state,
        [e.target.name]: e.target.value
      }
    })
  }

  const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
    setOtp(otp);
    return otp;
  };

  const handleVerifyClick = async () => {
    const otp = await generateOtp();
    
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/send-otp', {
        method: 'POST',
        body: JSON.stringify({ email: inputs.email, otp }),
      });
      const data = await response.json();
      if (response.ok) {
        setIsModalOpen(true);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Failed to send OTP. Please try again.');
    }
  };



  const handleSubmit = (e) => {
    e.preventDefault();

    if (inputs.password !== inputs.confirmPassword) {
      setMessage('Passwords do not match');
      setTimeout(() => {
        setMessage("")
      }, 2000)
      return;
    }

    if (isVerifying == true) {
      fetch(process.env.NEXT_PUBLIC_API_URL + '/user', {
        method: 'POST',
        body: JSON.stringify(inputs)
      })
        .then((res) => res.json())
        .then((res) => {
          setMessage(res.message);
          setInputs({});
          setIsVerifying(false);
          setTimeout(() => {
            setMessage("")
          }, 2000)
        })
    }else{
      setMessage("OTP is required");
      setTimeout(() => {
        setMessage("")
      }, 2000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {message && message !== 'User has been registered' && (
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 bg-yellow-100 border-t-4 border-yellow-500 rounded-b text-yellow-900 px-4 py-3 mt-5 w-full max-w-lg" role="alert">
          <div className="flex">
            <div>
              <p className="font-bold">Alert!</p>
              <p className="text-sm">{message}</p>
            </div>
          </div>
        </div>
      )}
      {message && message === 'User has been registered' && (
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 bg-blue-100 border-t-4 border-blue-500 rounded-b text-blue-900 px-4 py-3 mt-5 w-full max-w-lg" role="alert">
          <div className="flex">
            <div>
              <p className="font-bold">Success</p>
              <p className="text-sm">{message}</p>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              onChange={handleInput}
              value={inputs.name ?? ""}
              className="mt-1 p-2 border rounded w-full"
              placeholder="Enter your name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <div className="flex items-center">
              <input
                type="email"
                name="email"
                onChange={handleInput}
                value={inputs.email ?? ""}
                className="mt-1 p-2 border rounded w-full"
                placeholder="Enter your email"
              />
              <button
                type="button"
                className={`ml-2 px-4 py-2 rounded ${isVerifying ? 'bg-green-500' : 'bg-yellow-300'} text-white`}
                onClick={handleVerifyClick}
                disabled={isVerifying}
              >
                {isVerifying ? 'Verified' : 'Pending'}
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              onChange={handleInput}
              value={inputs.password ?? ""}
              className="mt-1 p-2 border rounded w-full"
              placeholder="Enter your password"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              onChange={handleInput}
              value={inputs.confirmPassword ?? ""}
              className="mt-1 p-2 border rounded w-full"
              placeholder="Confirm your password"
            />
          </div>
          <button className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-700">Register</button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-500 hover:underline">Login</Link>
        </p>
      </div>

      {isModalOpen && <OTPModal setIsModalOpen={setIsModalOpen} setIsVerifying={setIsVerifying} otp={otp}/>}

     
    </div>
  );
}


