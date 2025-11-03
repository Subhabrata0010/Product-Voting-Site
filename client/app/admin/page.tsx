/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { productAPI, adminAPI, CreateProductData } from '@/lib/api';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { useAuth } from '@/context/auth';
import ImageUpload from '@/components/Imageupload';

export default function AdminPage() {
  const { authUser, IsLoading, setAuthUser } = useAuth();
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  
  const [loginData, setLoginData] = useState({
    name: '',
    username: '',
    email: '',
    contact: '',
    password: '',
    profileURL: ''
  });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');

  const [formData, setFormData] = useState<CreateProductData>({
    name: '',
    description: '',
    category: 'Electronics',
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (!IsLoading && authUser && authUser?.isAdmin) {
      setShowLoginForm(false);
    }
  }, [authUser, IsLoading]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginMessage('');

    try {
      const res = await adminAPI.login(loginData.email, loginData.password);
      if (res.data.success) {
        setAuthUser(res.data.admin);
        setLoginMessage('Login successful!');
        setShowLoginForm(false);
      }
    } catch (error: any) {
      setLoginMessage(error.response?.data?.message || 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginMessage('');

    try {
      const res = await adminAPI.signup({
        name: loginData.name,
        username: loginData.username,
        email: loginData.email,
        contact: loginData.contact,
        password: loginData.password,
        profileURL: loginData.profileURL
      });
      if (res.data.success) {
        setLoginMessage('Registration successful! Please login.');
        setIsRegisterMode(false);
        setLoginData({...loginData, password: ''});
      }
    } catch (error: any) {
      setLoginMessage(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await adminAPI.logout();
      setAuthUser(null);
      setShowLoginForm(true);
      setIsRegisterMode(false);
      setLoginData({ 
        name: '', 
        username: '',
        email: '', 
        contact: '',
        password: '',
        profileURL: ''
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      let imageUrl = '';

      if (selectedImage) {
        setUploadingImage(true);
        const cloudinaryResponse = await uploadToCloudinary(selectedImage);
        imageUrl = cloudinaryResponse.url;
        setUploadingImage(false);
      }

      await productAPI.create({
        ...formData,
        imageUrl: imageUrl || undefined,
      });

      setMessage('Product created successfully!');
      setFormData({
        name: '',
        description: '',
        category: 'Books',
      });
      setSelectedImage(null);

      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Error creating product');
      console.error(error);
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  const handleInputChange = (field: keyof CreateProductData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (showLoginForm) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6 text-center">
            {isRegisterMode ? 'Admin Registration' : 'Admin Login'}
          </h1>

          {loginMessage && (
            <div className={`p-4 rounded-lg mb-6 ${
              loginMessage.includes('failed') || loginMessage.includes('Error')
                ? 'bg-red-100 text-red-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {loginMessage}
            </div>
          )}

          <form onSubmit={isRegisterMode ? handleRegister : handleLogin} className="space-y-4">
            {isRegisterMode && (
              <>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={loginData.name}
                    onChange={(e) => setLoginData({...loginData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    value={loginData.username}
                    onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    placeholder="Choose a username"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Contact *
                  </label>
                  <input
                    type="tel"
                    value={loginData.contact}
                    onChange={(e) => setLoginData({...loginData, contact: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    placeholder="Enter your contact number"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Profile URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={loginData.profileURL}
                    onChange={(e) => setLoginData({...loginData, profileURL: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Profile image URL"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email *
              </label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Password *
              </label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                placeholder="Enter your password"
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginLoading ? (isRegisterMode ? 'Registering...' : 'Logging in...') : (isRegisterMode ? 'Register' : 'Login')}
            </button>

            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(!isRegisterMode);
                  setLoginMessage('');
                }}
                className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
              >
                {isRegisterMode 
                  ? 'Already have an account? Login here' 
                  : 'New admin? Register here'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          {message && (
            <div className={`p-4 rounded-lg mb-6 ${
              message.includes('Error') ? 'bg-red-200 text-red-800 font-semibold' : 'bg-green-200 text-green-800 font-semibold'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <ImageUpload
              onImageSelect={setSelectedImage}
              label="Product Image (Optional)"
            />

            {uploadingImage && (
              <div className="text-blue-600 text-sm font-medium">
                Uploading image...
              </div>
            )}

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>Electronics</option>
                <option>Clothing</option>
                <option>Food</option>
                <option>Books</option>
                <option>Home</option>
                <option>Sports</option>
                <option>Other</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Product...' : uploadingImage ? 'Uploading Image...' : 'Create Product'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}