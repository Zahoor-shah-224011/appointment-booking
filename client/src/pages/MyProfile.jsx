// src/pages/MyProfile.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAdmin } from "../context/adimContext";
import { assets } from "../assets/assets";



import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from "react-router-dom";











const MyProfile = () => {
  const { axios, updateUser } = useAdmin();

  const [userData, setUserData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
const [saving, setSaving] = useState(false);
 const navigate = useNavigate();
  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get("/api/user/profile", {
          withCredentials: true,
        });

        if (data.success) {
          const user = data.user;

          if (user.dob) {
            const date = new Date(user.dob);
            user.birthday = date.toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });
          }

          setUserData(user);
          setOriginalData(user);
          setImagePreview(user.image);
        }
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [axios]);

  // Image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save profile
  const handleSave = async () => {

  if (saving) return; // prevent double call

  try {
    setSaving(true);

    const formData = new FormData();

    formData.append("name", userData.name || "");
    formData.append("email", userData.email || "");
    formData.append("phone", userData.phone || "");
    formData.append("address", userData.address || "");
    formData.append("gender", userData.gender || "");
    formData.append("birthday", userData.birthday || "");

    if (imageFile) {
      formData.append("image", imageFile);
    }

    const { data } = await axios.put("/api/user/profile", formData, {
      withCredentials: true
    });

    if (data.success) {
      toast.success("Profile updated");

      setUserData(data.user);
      setOriginalData(data.user);
      setImagePreview(data.user.image);
      setImageFile(null);
      setIsEditing(false);

      updateUser(data.user);

    } else {
      toast.error(data.message);
    }

  } catch (error) {
    toast.error(error.response?.data?.message || "Update failed");
  } finally {
    setSaving(false);
  }
};
  // Cancel editing
  const handleCancel = () => {
    setUserData(originalData);
    setImagePreview(originalData.image);
    setImageFile(null);
    setIsEditing(false);
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!userData) return <div>No profile data</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-7">
       <button
                                      onClick={() => {
                                        navigate('/');
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                      }}
                                        className="inline-flex items-center ml-2 mt-0 justify-center gap-2 text-primary font-medium hover:text-primary-dull transition-all duration-300 self-start md:self-auto transition group-hover:translate-x-1"
                                    >
                                     <div className="group inline-flex items-center mb-4 cursor-pointer">
                                    <IoArrowBack className="w-7 h-7 transition-transform duration-200  group-hover:-translate-x-1" />
                                    <span className="ml-1"> </span>
                                  </div>
                                     
                                    </button>
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">

          <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">

            {/* Profile Image */}
            <div className="relative">

              <img
                src={imagePreview || assets.profile_pic}
                alt="profile"
                className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-xl"
              />

              {isEditing && (
                <label
                  htmlFor="profile-image"
                  className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer"
                >
                  ✎
                </label>
              )}

              <input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={!isEditing}
              />
            </div>

            {/* Info Section */}
            <div className="flex-1 w-full">

              {/* Name */}
              <div className="mb-6">
                <label className="text-gray-600">Name</label>

                {isEditing ? (
                  <input
                    name="name"
                    value={userData.name}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                ) : (
                  <h1 className="text-3xl font-bold">{userData.name}</h1>
                )}
              </div>

              {/* Contact Info */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-4">Contact Information</h2>

                <div className="space-y-4">

                  <div>
                    <label>Email</label>

                    {isEditing ? (
                      <input
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                      />
                    ) : (
                      <p className="text-blue-600">{userData.email}</p>
                    )}
                  </div>

                  <div>
                    <label>Phone</label>

                    {isEditing ? (
                      <input
                        name="phone"
                        value={userData.phone || ""}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                      />
                    ) : (
                      <p>{userData.phone || "Not provided"}</p>
                    )}
                  </div>

                  <div>
                    <label>Address</label>

                    {isEditing ? (
                      <textarea
                        name="address"
                        value={userData.address || ""}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                      />
                    ) : (
                      <p>{userData.address || "Not provided"}</p>
                    )}
                  </div>

                </div>
              </div>

              {/* Basic Info */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-4">Basic Information</h2>

                <div className="space-y-4">

                  <div>
                    <label>Gender</label>

                    {isEditing ? (
                      <select
                        name="gender"
                        value={userData.gender || ""}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <p>{userData.gender || "Not specified"}</p>
                    )}
                  </div>

                  <div>
                    <label>Birthday</label>

                    {isEditing ? (
                      <input
                        name="birthday"
                        value={userData.birthday || ""}
                        onChange={handleChange}
                        placeholder="DD Month, YYYY"
                        className="w-full border rounded px-3 py-2"
                      />
                    ) : (
                      <p>{userData.birthday || "Not provided"}</p>
                    )}
                  </div>

                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">

                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 border border-blue-600 text-blue-600 rounded-full"
                  >
                    Edit
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleCancel}
                      className="px-6 py-2 border border-gray-400 rounded-full"
                    >
                      Cancel
                    </button>

                   <button
  onClick={handleSave}
  disabled={saving}
  className="px-6 py-2 bg-primary text-white rounded-full"
>
  {saving ? "Saving..." : "Save"}
</button>
                  </>
                )}

              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default MyProfile;