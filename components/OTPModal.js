'use client'
import React, { useState } from 'react';

export default function OTPModal({ setIsModalOpen, setIsVerifying, otp }) {
  const [otpValue, setOtpValue] = useState('');

  const handleClose = () => {
    setIsModalOpen(false);
  }

  const handleVerify = () => {
    if (otp == otpValue){
      setIsVerifying(true);
    }else{
      alert('OTP is wrong')
    }
    handleClose();
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Verify OTP</h2>
        <div className="mb-4">
          <label className="block text-gray-700">OTP</label>
          <input
            type="text"
            value={otpValue}
            onChange={(e) => setOtpValue(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
            placeholder="Enter OTP"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleClose}
            className="bg-gray-300 text-white px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleVerify}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
}
