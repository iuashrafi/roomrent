import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerUser = async (ev) => {
    ev.preventDefault();

    try {
      await axios.post("/api/register", { name, email, password });
      alert("Registration successfull, Now you can login");
    } catch (error) {
      alert("Registration failed, Please try again later");
    }
  };
  return (
    <div className="mt-4  grow flex items-center justify-center">
      <div className="mb-32">
        <h1 className="text-4xl text-center mb-4">Register</h1>
        <form onSubmit={registerUser} className="max-w-md mx-auto">
          <input
            type="text"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            placeholder="John Doe"
          />
          <input
            type="email"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            placeholder="Email address"
          />
          <input
            type="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            placeholder="Password"
          />
          <button type="submit" className="primary">
            Register
          </button>

          <div className="text-center py-2 text-gray-500">
            Already a Member ?
            <Link to="/login" className="underline text-gray-500">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
