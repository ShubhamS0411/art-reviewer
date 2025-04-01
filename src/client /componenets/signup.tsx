import { useState} from "react";
import axios from "axios";
import React from "react";
import { Helmet } from "react-helmet";

export default function Signup() {
   const [account, setAccount] = useState<{account_type: string, email: string, username: string, password: string}>({account_type: "Creator", email: "", username: "", password: ""});
   const [error,setError] = useState<{username: string, password: string, email: string}>({username: "", password: "", email: ""});
   const [message, setMessage] = useState<string>("");
   const characters: string[] = ['!','@','#','$','%','^','&','*','(',')','_','+','='];
   const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:4000';
  


   const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const sanitizedEmail = account.email.toLowerCase().trim();
    const sanitizedPassword = account.password.trim();
    const sanitizedUsername = account.username.trim();
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

    setError((prev)=>({...prev,email: "", username: "", password: ""}));
 
    if(!sanitizedEmail.includes("@gmail.com")) {
        setError((prev) => ({ ...prev, email: "Please enter a valid email" }));
        return;
    }

    if(characters.some((char)=>{return sanitizedUsername.includes(char)})) {
        setError((prev) => ({ ...prev, username: "Username cannot have special characters" }));
        return;
    }

    if(!regexPassword.test(sanitizedPassword)) {
        setError((prev) => ({ ...prev, password: "Please enter a strong password" }));
        return;
    }
    try{
    const response = await axios.post(`${API_URL}/api/signup`,
    {account_type: account.account_type, email: account.email, username: account.username, password: account.password}, 
    {headers: {
        'Content-Type': 'application/json',

    }});
    if(response.status === 201) {
        setMessage(response.data.message);
        
    }
}
    catch(error: any){ {
        const errorMessage = error.response?.data?.message || "Error signing up";
        setMessage(errorMessage);
        
    }
   }
   setAccount({account_type: "Creator", email: "", username: "", password: ""});
};

  
    return (
        <>
        <Helmet>
        <meta name="Sign Up" content="Sign Up Your Account"/>
        <meta name="description" content="Sign Up Your Account"/>
        <meta name="keywords" content="Sign Up Your Account"/>
        </Helmet>
        
        <main className="flex justify-center items-center h-screen bg-gray-100">
    <form onSubmit={handleSubmit} area-label="Register Your Account" className="flex flex-col border border-gray-300 p-6 rounded-lg shadow-md bg-white w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sign Up Your Account</h1>

        <label htmlFor="account_type" className="text-gray-700 font-medium mb-2">Account Type</label>
        <select 
            name="account_type" 
            required 
            className="border border-gray-300 rounded-md p-4 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            value={account.account_type}
            onChange={(event) => setAccount({...account, account_type: event.target.value})}
        >
            <option value="creator" >Creator</option>
            <option value="Reviewer">Reviewer</option>
        </select>
        
        <label htmlFor="email" className="text-gray-700 font-medium mb-2">Email</label>
        <input 
            type="text" 
            placeholder="Enter your email"
            className="border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={account.email}
            onChange={(event) => setAccount((prev)=>({...prev, email: event.target.value}))}
            required
        />
        {error.email && <span className="text-red-500 py-2 -mt-5 text-sm block">{error.email}</span>}
        
        <label htmlFor="username" className="text-gray-700 font-medium mb-2">Username</label>
        <input 
            type="text" 
            placeholder="Enter your username"
            className="border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={account.username}
            onChange={(event) => setAccount((prev)=>({...prev, username: event.target.value}))}
            required
        />
        {error.username && <span className="text-red-500 py-2 -mt-5 text-sm block">{error.username}</span>}
        <label htmlFor="password" className="text-gray-700 font-medium mb-2">Password</label>
        <input 
            type="password" 
            placeholder="Enter your password"
            className="border border-gray-300 rounded-md px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={account.password}
            onChange={(event) => setAccount((prev)=>({...prev, password: event.target.value}))}
            required
        />
        {error.password && <span className="text-red-500 py-2 -mt-5 text-sm block">{error.password}</span>}
        <button 
            type="submit"
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
            Signup
        </button>
        {message && <span className="text-green-500  py-2 text-sm block">{message}</span>}
    </form>
</main>
</>
    );
}






