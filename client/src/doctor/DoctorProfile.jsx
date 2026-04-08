// src/doctor/DoctorProfile.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAdmin } from "../context/adimContext";
import { assets } from "../assets/assets";

const DoctorProfile = () => {
  const { axios } = useAdmin();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    degree: "",
    specialty: "",
    experience: "",
    about: "",
    fees: "",
    address: "",
    available: false,
  });

  const formatAddress = (addr) => {
    if (!addr) return "";
    if (typeof addr === "string") return addr;

    const parts = [];
    if (addr.line1) parts.push(addr.line1);
    if (addr.line2) parts.push(addr.line2);
    if (addr.city) parts.push(addr.city);
    if (addr.state) parts.push(addr.state);
    if (addr.country) parts.push(addr.country);

    return parts.join(", ");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get("/api/doctor/profile", {
          withCredentials: true,
        });

        if (data.success) {
          const doc = data.doctor;

          setDoctor(doc);
          setImagePreview(doc.image || assets.doctor_placeholder);

          setFormData({
            degree: doc.degree || "",
            specialty: doc.specialty || "",
            experience: doc.experience || "",
            about: doc.about || "",
            fees: doc.fees || "",
            address: formatAddress(doc.address),
            available: doc.available || false,
          });
        } else {
          toast.error("Failed to load profile");
        }
      } catch (error) {
        toast.error("Error loading profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [axios]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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

  const handleSave = async () => {
    setSaving(true);

    try {
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      const { data } = await axios.put(
        "/api/doctor/profile",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success("Profile updated");

        setDoctor(data.doctor);
        setImagePreview(data.doctor.image);
        setImageFile(null);
        setIsEditing(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-xl">Loading profile...</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-xl">Doctor not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">

      <div className="max-w-4xl mx-auto">

        <div className="bg-white rounded-2xl shadow-md p-8">

          {/* Profile Image */}

          <div className="flex flex-col items-center mb-6">

            <div className="relative">

              <img
                src={imagePreview}
                alt={doctor.name}
                className="w-44 h-44 rounded-full bg-primary object-cover border-4 border-white shadow-lg"
              />

              {isEditing && !saving && (
                <label
                  htmlFor="profile-image"
                  className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-blue-700"
                >
                  ✎
                </label>
              )}

            </div>

            {isEditing && !saving && (
              <input
                type="file"
                id="profile-image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            )}

          </div>

          {/* Name */}

          <h1 className="text-3xl font-bold text-center mb-4">
            Dr. {doctor.name}
          </h1>

          {/* Degree Specialty */}

          <div className="flex justify-center items-center gap-3 text-gray-600 mb-6 flex-wrap">

            {isEditing ? (
              <>
                <input
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  className="border rounded px-3 py-1 w-28"
                />

                <input
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  className="border rounded px-3 py-1 w-40"
                />

                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="border rounded px-3 py-1 w-20"
                />
              </>
            ) : (
              <>
                <span className="font-medium">{doctor.degree}</span>
                <span>-</span>
                <span>{doctor.specialty}</span>
                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {doctor.experience} years
                </span>
              </>
            )}

          </div>

          {/* About */}

          <div className="mb-6">

            <h2 className="text-lg font-semibold mb-2">About</h2>

            {isEditing ? (
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                rows={4}
                className="w-full border rounded-lg p-3"
              />
            ) : (
              <p className="text-gray-700">{doctor.about}</p>
            )}

          </div>

          {/* Fees */}

          <div className="flex items-center gap-3 mb-4">

            <span className="font-semibold">Appointment Fee:</span>

            {isEditing ? (
              <input
                name="fees"
                type="number"
                value={formData.fees}
                onChange={handleChange}
                className="border rounded px-3 py-1 w-28"
              />
            ) : (
              <span>${doctor.fees}</span>
            )}

          </div>

          {/* Address */}

          <div className="flex items-center gap-3 mb-4">

            <span className="font-semibold">Address:</span>

            {isEditing ? (
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="border rounded px-3 py-1 flex-1"
              />
            ) : (
              <span>{formatAddress(doctor.address)}</span>
            )}

          </div>

          {/* Available */}

          <div className="flex items-center gap-3 mb-6">

            <span className="font-semibold">Available:</span>

            {isEditing ? (
              <input
                type="checkbox"
                name="available"
                checked={formData.available}
                onChange={handleChange}
                className="w-5 h-5"
              />
            ) : (
              <span>{doctor.available ? "Yes" : "No"}</span>
            )}

          </div>

          {/* Buttons */}

          {isEditing ? (
            <div className="flex gap-4">

              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                {saving ? "Saving..." : "Save"}
              </button>

              <button
                onClick={() => {
                  setIsEditing(false);
                  setImagePreview(doctor.image || assets.doctor_placeholder);
                  setImageFile(null);
                }}
                className="bg-gray-300 px-6 py-2 rounded-lg"
              >
                Cancel
              </button>

            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Edit Profile
            </button>
          )}

        </div>

      </div>
    </div>
  );
};

export default DoctorProfile;