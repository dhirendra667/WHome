import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { setLogin } from "../redux/state";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5000/api/v1/authuser/login", { email, password });
      dispatch(setLogin({ 
        user: data.user,
        token: data.token }));
      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials!");
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-[url('/assets/login.jpg')] bg-cover bg-center">
      <div className="flex flex-col gap-4 w-[40%] p-10 bg-black/80 rounded-2xl text-white md:w-[60%] sm:w-[80%]">
        <form className="flex flex-col items-center gap-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 bg-transparent border-b border-white/30 text-center placeholder-white focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 bg-transparent border-b border-white/30 text-center placeholder-white focus:outline-none"
          />
          <button
            type="submit"
            className="mt-4 py-2 px-6 bg-[#F8395A] rounded-lg text-lg font-semibold hover:shadow-[0_0_10px_3px_rgba(255,255,255,0.6)] transition duration-300"
          >
            LOG IN
          </button>
        </form>

        <Link to="/register" className="text-center text-white font-semibold hover:underline">
          Don’t have an account? Sign up here
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;


