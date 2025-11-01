import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaGlobe,
  FaUserCircle,
  FaGoogle,
  FaApple,
  FaImage,
} from "react-icons/fa";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState("/assets/register.jpg");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [loading, setLoading] = useState(false);

  // handle text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "confirmPassword" || name === "password") {
      setPasswordMatch(
        name === "confirmPassword"
          ? value === formData.password
          : formData.confirmPassword === value
      );
    }
  };

  // handle avatar selection + preview
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordMatch) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);

      // Prepare form data (multipart)
      const data = new FormData();
      data.append("firstName", formData.firstName);
      data.append("lastName", formData.lastName);
      data.append("email", formData.email);
      data.append("password", formData.password);
      // if (formData.country) data.append("country", formData.country);
      if (avatar) data.append("avatar", avatar);

      // API call
      const response = await axios.post(
        "http://localhost:5000/api/v1/authuser/register",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Registration successful!");
        navigate("/login");
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 font-inter">
      <div className="flex w-[90%] md:w-[800px] bg-white rounded-2xl shadow-xl overflow-hidden transition-transform duration-300 hover:scale-[1.01]">
        {/* Left side form */}
        <div className="flex-1 p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex gap-3">
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 w-1/2">
                <FaUser className="text-gray-500 mr-2" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  required
                  className="w-full outline-none text-sm bg-transparent"
                />
              </div>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 w-1/2">
                <FaUser className="text-gray-500 mr-2" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  required
                  className="w-full outline-none text-sm bg-transparent"
                />
              </div>
            </div>

            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
              <FaUserCircle className="text-gray-500 mr-2" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                required
                className="w-full outline-none text-sm bg-transparent"
              />
            </div>

            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
              <FaEnvelope className="text-gray-500 mr-2" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="w-full outline-none text-sm bg-transparent"
              />
            </div>

            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
              <FaLock className="text-gray-500 mr-2" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="w-full outline-none text-sm bg-transparent"
              />
            </div>

            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
              <FaLock className="text-gray-500 mr-2" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
                className="w-full outline-none text-sm bg-transparent"
              />
            </div>

            {!passwordMatch && (
              <p className="text-red-500 text-xs -mt-2">
                Passwords do not match!
              </p>
            )}

            {/* <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
              <FaGlobe className="text-gray-500 mr-2" />
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full text-sm outline-none bg-transparent text-gray-700"
              >
                <option value="">Select your country</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="IN">India</option>
                <option value="CA">Canada</option>
                <option value="CN">China</option>
              </select>
            </div> */}

            {/* Avatar upload */}
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
              <FaImage className="text-gray-500 mr-2" />
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleAvatarChange}
                className="text-sm text-gray-700"
              />
            </div>

            <button
              type="submit"
              disabled={!passwordMatch || loading}
              className={`w-full py-2 rounded-lg text-white font-semibold transition-all duration-300 ${
                !passwordMatch || loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {loading ? "Registering..." : "Sign Up"}
            </button>

            <div className="flex items-center justify-center text-gray-500 text-sm my-1">
              <span className="mx-2">OR</span>
            </div>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-blue-600 font-medium hover:underline"
              >
                Sign In
              </a>
            </p>

            <div className="flex flex-col gap-2 mt-2">
              <button
                type="button"
                className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 hover:bg-gray-100 text-sm font-medium"
              >
                <FaGoogle className="text-red-500" />
                Sign Up with Google
              </button>

              <button
                type="button"
                className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 hover:bg-gray-100 text-sm font-medium"
              >
                <FaApple className="text-gray-800" />
                Sign Up with Apple
              </button>
            </div>
          </form>
        </div>

        {/* Right side image preview */}
        <div className="hidden md:flex flex-col flex-1 bg-gray-50 justify-center items-center text-center p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Profile Preview
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            The image you upload will appear here.
          </p>
          <img
            src={preview}
            alt="Avatar Preview"
            className="rounded-lg w-full h-auto object-cover shadow-md"
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
