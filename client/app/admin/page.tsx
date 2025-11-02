'use client';

import { useState } from 'react';
import { productAPI, CreateProductData } from '@/lib/api';

export default function AdminPage() {
  const [formData, setFormData] = useState<CreateProductData>({
    name: '',
    description: '',
    category: 'Electronics',
    imageUrl: ''
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await productAPI.create(formData);
      setMessage('Product created successfully!');
      setFormData({
        name: '',
        description: '',
        category: 'Electronics',
        imageUrl: ''
      });
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error creating product');
      console.error(error);
    }
  };

  const handleInputChange = (field: keyof CreateProductData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto card">
        <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
        
        {message && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Product Name
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
              Description
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
              Category
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

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Image URL (optional)
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => handleInputChange('imageUrl', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button type="submit" className="btn-primary w-full bg-green-200 text-black hover:bg-green-900 hover:text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Create Product
          </button>
        </form>
      </div>
    </div>
  );
}