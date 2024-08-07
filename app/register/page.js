'use client'
import Link from 'next/link';
import React, { useState } from 'react';
import OTPModal from '../../components/OTPModal';
import bcrypt from 'bcryptjs';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

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
        headers: {
          'Content-Type': 'application/json',
        },
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
    const hashedPassword = bcrypt.hashSync(inputs.password, 10);

    if (isVerifying == true) {
      fetch(process.env.NEXT_PUBLIC_API_URL + '/user', {
        method: 'POST',
        body: JSON.stringify({ ...inputs, password: hashedPassword })
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
    } else {
      setMessage("OTP is required");
      setTimeout(() => {
        setMessage("")
      }, 2000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8 sm:px-6 lg:px-8" style={{ backgroundImage: "url('/img/background.jpg')" }}>
      {message && message !== 'User has been registered' && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-100 border-t-4 border-yellow-500 rounded-b text-yellow-900 px-4 py-3 mt-5 mx-auto w-full max-w-lg" role="alert">
          <div className="flex">
            <div>
              <p className="font-bold">Alert!</p>
              <p className="text-sm">{message}</p>
            </div>
          </div>
        </div>
      )}
      {message && message === 'User has been registered' && (
        <div className="fixed top-0 left-0 right-0 bg-blue-100 border-t-4 border-blue-500 rounded-b text-blue-900 px-4 py-3 mt-5 mx-auto w-full max-w-lg" role="alert">
          <div className="flex">
            <div>
              <p className="font-bold">Success</p>
              <p className="text-sm">{message}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl overflow-hidden">
        <div className="md:flex">
          <div className="hidden md:block md:w-1/2 p-6 lg:p-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-blue mb-4">Join AI Blog</h2>
            <h2 className="text-2xl lg:text-3xl font-bold text-blue mb-4">Get premium benefits:</h2>
            <ul className="list-none mb-4 mb-sm-5 text-sm lg:text-base">
              <li className="flex items-start mb-2">
                <FontAwesomeIcon icon={faCheckCircle} className="text-blue-500 mt-1 mr-2" />
                <span>Learn new LLMs</span>
              </li>
              <li className="flex items-start mb-2">
                <FontAwesomeIcon icon={faCheckCircle} className="text-blue-500 mt-1 mr-2" />
                <span>Easily implement your AI development</span>
              </li>
              <li className="flex items-start mb-0">
                <FontAwesomeIcon icon={faCheckCircle} className="text-blue-500 mt-1 mr-2" />
                <span>AI News</span>
              </li>
            </ul>
            <div className="relative w-full h-48 sm:h-64 md:h-80">
              <Image src="/img/register1.jpg" alt="Illustration" layout="fill" objectFit="contain" />
            </div>
            <div className="mt-4 lg:mt-6 text-center text-blue text-sm lg:text-base">
              Already have an account?
              <Link href="/login" className="text-blue-500 hover:underline"> Login</Link>
            </div>
          </div>
          <div className="hidden md:block border-l border-gray-300"></div>
          <div className="w-full md:w-1/2 p-6 lg:p-8">
            <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Sign Up</h1>
            <button className="w-full bg-white text-black border border-gray-300 rounded-lg py-2 mb-3 sm:mb-4 flex items-center justify-center hover:bg-blue-500 hover:text-white transition duration-300 text-sm sm:text-base">
              <Image src="/img/google.png" alt="Google" width={16} height={16} className="mr-2" />
              Sign up with Google
            </button>
            <button className="w-full bg-white text-black border border-gray-300 rounded-lg py-2 mb-3 sm:mb-4 flex items-center justify-center hover:bg-blue-500 hover:text-white transition duration-300 text-sm sm:text-base">
              <Image src="/img/facebook.png" alt="Facebook" width={16} height={16} className="mr-2" />
              Sign up with Facebook
            </button>
            <div className="flex items-center my-3 sm:my-4">
              <hr className="flex-grow border-gray-300" />
              <span className="mx-2 sm:mx-4 text-gray-400 text-sm">Or</span>
              <hr className="flex-grow border-gray-300" />
            </div>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-gray-700 text-sm sm:text-base">Name</label>
                <input
                  type="text"
                  name="name"
                  onChange={handleInput}
                  value={inputs.name ?? ""}
                  className="mt-1 p-2 border rounded w-full text-sm sm:text-base"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm sm:text-base">Email</label>
                <div className="flex items-center">
                  <input
                    type="email"
                    name="email"
                    onChange={handleInput}
                    value={inputs.email ?? ""}
                    className="mt-1 p-2 border rounded w-full text-sm sm:text-base"
                    placeholder="Enter your email"
                  />
                  <button
                    type="button"
                    className={`ml-2 px-2 sm:px-4 py-2 rounded ${isVerifying ? 'bg-green-500' : 'bg-yellow-300'} text-white text-xs sm:text-sm`}
                    onClick={handleVerifyClick}
                    disabled={isVerifying}
                  >
                    {isVerifying ? 'Verified' : 'Pending'}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 text-sm sm:text-base">Password</label>
                <input
                  type="password"
                  name="password"
                  onChange={handleInput}
                  value={inputs.password ?? ""}
                  className="mt-1 p-2 border rounded w-full text-sm sm:text-base"
                  placeholder="Enter your password"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm sm:text-base">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  onChange={handleInput}
                  value={inputs.confirmPassword ?? ""}
                  className="mt-1 p-2 border rounded w-full text-sm sm:text-base"
                  placeholder="Confirm your password"
                />
              </div>
              <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition duration-300 text-sm sm:text-base">
                Register
              </button>
            </form>
            <div className="mt-4 text-center text-blue text-sm md:hidden">
              Already have an account?
              <Link href="/login" className="text-blue-500 hover:underline"> Login</Link>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && <OTPModal setIsModalOpen={setIsModalOpen} setIsVerifying={setIsVerifying} otp={otp} />}
    </div>
  );
}


