'use client'
import React, { useState } from 'react'

// export const metadata = {
//   title: "Blog | Contact",
//   description: "Contact page",
// };

export default function page() {
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
      <h2 className="text-4xl font-bold mb-4">Contact Message</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-lg my-4">
        <div className="flex items-center mb-4">
          <label for="name" className="w-1/4">Name:</label>
          <input onChange={handleInput} type="text" id="name" name='name' value={inputs.name ?? ""} className="border rounded px-2 py-1 w-3/4" />
        </div>
        <div className="flex items-center mb-4">
          <label for="email" className="w-1/4">Email:</label>
          <input onChange={handleInput} type="email" id="email" name='email' value={inputs.email ?? ""} className="border rounded px-2 py-1 w-3/4" />
        </div>
        <div className="flex items-center mb-4">
          <label for="message" className="w-1/4">Message:</label>
          <textarea onChange={handleInput} id="message" name='message' value={inputs.message ?? ""} className="border rounded px-2 py-1 w-3/4" rows="4"></textarea>
        </div>
        <button type='submit' className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Submit</button>
      </form>

      {message && <div className="bg-yellow-100 border-t-4 border-yellow-500 rounded-b text-yellow-900 px-4 py-3 mx-5" role="alert">
        <div className="flex">
          <div>
            <p className="font-bold">Alert!</p>
            <p className="text-sm">{message}</p>
          </div>
        </div>
      </div>}



    </main>
  )
}
