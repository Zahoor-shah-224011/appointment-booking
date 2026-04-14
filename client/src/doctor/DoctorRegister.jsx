// src/pages/DoctorRegister.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDoctors } from "../context/DoctorContext";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const DoctorRegister = () => {
  const navigate = useNavigate();
  const { axios, setDoctor } = useDoctors();

  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [errors, setErrors] = useState({});

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

  // Scroll to first error field
  const scrollToFirstError = () => {
    const firstError = document.querySelector('[data-error="true"]');
    if (firstError) {
      firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      firstError.focus({ preventScroll: true });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isLogin) {
      setLoginData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const validateRegister = () => {
    const newErrors = {};
    const { name, email, password, specialty, degree, experience, fees, about, address } = formData;

    if (!name.trim()) newErrors.name = "Full name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Minimum 6 characters";
    if (!specialty.trim()) newErrors.specialty = "Specialty is required";
    if (!degree.trim()) newErrors.degree = "Degree is required";
    if (!experience) newErrors.experience = "Experience is required";
    else if (isNaN(experience) || Number(experience) < 0) newErrors.experience = "Enter a valid number";
    if (!fees) newErrors.fees = "Consultation fee is required";
    else if (isNaN(fees) || Number(fees) <= 0) newErrors.fees = "Fee must be positive";
    if (!about.trim()) newErrors.about = "About section is required";
    if (!address.trim()) newErrors.address = "Address is required";
    if (!imageFile) newErrors.image = "Profile image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateLogin = () => {
    const newErrors = {};
    if (!loginData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(loginData.email)) newErrors.email = "Email is invalid";
    if (!loginData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateRegister()) {
      scrollToFirstError();
      toast.error("Please fill all field with image before submitting");
      return;
    }
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => formDataToSend.append(key, value));
      if (imageFile) formDataToSend.append("image", imageFile);

      const { data } = await axios.post("/api/doctor/register", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (data.success) {
        setDoctor(data.doctor);
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

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateLogin()) {
      scrollToFirstError();
      toast.error("Please fix the errors before submitting");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(
        "/api/doctor/login",
        { email: loginData.email.trim(), password: loginData.password.trim() },
        { withCredentials: true }
      );
      if (data.success) {
        setDoctor(data.doctor);
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

          <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4" noValidate>
            {/* Profile Image (Register only) */}
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
                  data-error={!!errors.image}
                />
                {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
              </div>
            )}

            {/* Register Fields */}
            {!isLogin && (
              <>
                <InputField
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                />
                <InputField
                  name="specialty"
                  placeholder="Specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  error={errors.specialty}
                />
                <InputField
                  name="degree"
                  placeholder="Degree"
                  value={formData.degree}
                  onChange={handleChange}
                  error={errors.degree}
                />
                <InputField
                  name="experience"
                  placeholder="Experience (years)"
                  type="number"
                  value={formData.experience}
                  onChange={handleChange}
                  error={errors.experience}
                />
                <InputField
                  name="fees"
                  placeholder="Consultation Fee ($)"
                  type="number"
                  value={formData.fees}
                  onChange={handleChange}
                  error={errors.fees}
                />
                <div>
                  <textarea
                    name="about"
                    placeholder="About"
                    value={formData.about}
                    onChange={handleChange}
                    rows={3}
                    data-error={!!errors.about}
                    className={`w-full px-4 py-2 border rounded-lg ${
                      errors.about ? "border-red-500" : ""
                    }`}
                  />
                  {errors.about && <p className="text-red-500 text-sm mt-1">{errors.about}</p>}
                </div>
                <InputField
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  error={errors.address}
                />
              </>
            )}

            {/* Email (Both forms) */}
            <InputField
              name="email"
              type="email"
              placeholder="Email"
              value={isLogin ? loginData.email : formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            {/* Password (Both forms) */}
            <InputField
              name="password"
              type="password"
              placeholder="Password"
              value={isLogin ? loginData.password : formData.password}
              onChange={handleChange}
              error={errors.password}
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50"
            >
              {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
            </button>

            {/* Toggle Form */}
            <p className="text-center text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
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

// Reusable input field to reduce repetition
const InputField = ({ name, type = "text", placeholder, value, onChange, error }) => (
  <div>
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      data-error={!!error}
      className={`w-full px-4 py-2 border rounded-lg ${error ? "border-red-500" : ""}`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default DoctorRegister;