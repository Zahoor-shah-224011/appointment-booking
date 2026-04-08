// src/pages/DoctorRegister.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDoctors } from "../context/DoctorContext";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const DoctorRegister = () => {
  const navigate = useNavigate();
  const { axios } = useDoctors();

  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specialty: "",
    degree: "",
    experience: "",
    fees: "",
    about: "",
    address: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (isLogin) {
      setLoginData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // ================= REGISTER =================

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      const { data } = await axios.post(
        "/api/doctor/register",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success("Registration successful");
        navigate("/doctor-dashboard");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= LOGIN =================

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        "/api/doctor/login",
        {
          email: loginData.email.trim(),
          password: loginData.password.trim(),
        },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success("Login successful");
        navigate("/doctor-dashboard");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-4">

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
            {isLogin ? "Doctor Login" : "Doctor Registration"}
          </h1>

          <form
            onSubmit={isLogin ? handleLogin : handleRegister}
            className="space-y-4"
          >

            {/* PROFILE IMAGE ONLY FOR REGISTER */}

            {!isLogin && (
              <div className="flex flex-col items-center mb-4">

                <div className="relative">

                  <img
                    src={imagePreview || assets.profile_pic}
                    alt="Preview"
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                  />

                  <label
                    htmlFor="image"
                    className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full cursor-pointer hover:bg-primary-dark"
                  >
                    +
                  </label>

                </div>

                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

              </div>
            )}

            {/* REGISTER FIELDS */}

            {!isLogin && (
              <>
                <input
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />

                <input
                  name="specialty"
                  placeholder="Specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />

                <input
                  name="degree"
                  placeholder="Degree"
                  value={formData.degree}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />

                <input
                  name="experience"
                  placeholder="Experience"
                  type="number"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />

                <input
                  name="fees"
                  placeholder="Consultation Fee"
                  type="number"
                  value={formData.fees}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                />

                <textarea
                  name="about"
                  placeholder="About"
                  value={formData.about}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg"
                />

                <input
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </>
            )}

            {/* EMAIL */}

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={isLogin ? loginData.email : formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />

            {/* PASSWORD */}

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={isLogin ? loginData.password : formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark"
            >
              {loading
                ? "Please wait..."
                : isLogin
                ? "Login"
                : "Register"}
            </button>

            {/* SWITCH FORM */}

            <p className="text-center text-gray-600">
              {isLogin
                ? "Don't have an account?"
                : "Already have an account?"}

              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary ml-1 hover:underline"
              >
                {isLogin ? "Register" : "Login"}
              </button>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegister;