'use client'
import React, { useState } from 'react'

export default function Contact() {
    const [inputs, setInputs] = useState({});
    const [message, setMessage] = useState("");
  
    const handleInput = (e) => {
      setInputs((state) => {
        return {
          ...state,
          [e.target.name]: e.target.value
        }
      })
    }
  
    const handleSubmit = (e) => {
      e.preventDefault();
      fetch(process.env.NEXT_PUBLIC_API_URL + '/contact', {
        method: 'POST',
        body: JSON.stringify(inputs)
      })
        .then((res) => res.json())
        .then((res) => {
          setMessage(res.message);
          setInputs({});
          setTimeout(() => {
            setMessage("")
          }, 2000)
        })
    }
  
    return (
      <main className="container mx-auto px-4 py-6">
        {message && message !== 'Info has been sent' && (
          <div className="bg-yellow-100 border-t-4 border-yellow-500 rounded-b text-yellow-900 px-4 py-3 mt-5 mx-auto w-full max-w-lg" role="alert">
            <div className="flex">
              <div>
                <p className="font-bold">Alert!</p>
                <p className="text-sm">{message}</p>
              </div>
            </div>
          </div>
        )}

        {message && message === 'Info has been sent' && (
          <div className="bg-blue-100 border-t-4 border-blue-500 rounded-b text-blue-900 px-4 py-3 mt-5 mx-auto w-full max-w-lg" role="alert">
            <div className="flex">
              <div>
                <p className="font-bold">Success</p>
                <p className="text-sm">{message}</p>
              </div>
            </div>
          </div>
        )}
        <h2 className="text-4xl font-bold mb-4 text-center">Contact Us</h2>
        <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Name:</label>
            <input onChange={handleInput} type="text" id="name" name='name' value={inputs.name ?? ""} className="border rounded w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email:</label>
            <input onChange={handleInput} type="email" id="email" name='email' value={inputs.email ?? ""} className="border rounded w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-gray-700 font-bold mb-2">Message:</label>
            <textarea onChange={handleInput} id="message" name='message' value={inputs.message ?? ""} className="border rounded w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" rows="4"></textarea>
          </div>
          <button type='submit' className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full transition duration-300 ease-in-out">Submit</button>
        </form>
  
        
      </main>
    )
}





