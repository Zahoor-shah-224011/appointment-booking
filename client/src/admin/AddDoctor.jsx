// src/admin/AddDoctor.jsx
import React, { useState } from 'react';
import { useAdmin } from '../context/adimContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddDoctor = () => {
  const navigate = useNavigate();
  const { axios } = useAdmin();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialty: '',        // ← changed from speciality to match backend
    degree: '',
    experience: '',
    fees: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    about: '',
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (!image) {
      toast.error('Doctor profile image is required');
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();

      // Append all fields – keys must match backend req.body
      data.append('name', formData.name.trim());
      data.append('email', formData.email.trim());
      data.append('password', formData.password.trim());
      data.append('specialty', formData.specialty.trim());   // ← backend expects "specialty"
      data.append('degree', formData.degree.trim());
      data.append('experience', Number(formData.experience));
      data.append('fees', Number(formData.fees));
      data.append('about', formData.about.trim());

      // Address as JSON string
      const address = {
        line1: formData.address1.trim(),
        line2: formData.address2.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
      };
      data.append('address', JSON.stringify(address));

      // Image file
      data.append('image', image);

      // Debug: log FormData entries (remove in production)
      for (let pair of data.entries()) {
        console.log(pair[0], pair[1]);
      }

      const { data: res } = await axios.post('/api/admin/add-doctor', data, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.success) {
     toast.success("Doctor added successfully 🎉");
setTimeout(() => navigate("/admin/doctors"), 1500);
      } else {
        toast.error(res.message || 'Failed to add doctor');
      }
    } catch (error) {
      console.error('Add doctor error:', error);
      const message = error.response?.data?.message || 'Something went wrong';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" lg:p-4 md:ml-15">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 md:ml-2">Add Doctor</h1>

      <div className="bg-white rounded-2xl shadow-lg p-5 ml-0 lg:p-5 max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload */}
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-gray-200 shadow-md">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                  Doctor Photo
                </div>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Doctor Photo *
              </label>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Doctor Photo *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                required
              />
            </div>
          </div>

          {/* Form Fields - 2 columns */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Specialty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specialty *</label>
              <input
                type="text"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Degree */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Degree *</label>
              <input
                type="text"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience (years) *</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Fees */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fees ($) *</label>
              <input
                type="number"
                name="fees"
                value={formData.fees}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Address Line 1 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1 *</label>
              <input
                type="text"
                name="address1"
                value={formData.address1}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Address Line 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
              <input
                type="text"
                name="address2"
                value={formData.address2}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* About (full width) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">About Doctor *</label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-5">
            <button
              type="submit"
              disabled={loading}
              className={`px-12 py-2 md:py-4 rounded-full text-lg font-semibold transition-all ${
                loading
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {loading ? 'Adding...' : 'Add Doctor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctor;