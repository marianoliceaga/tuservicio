import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye, EyeOff, Filter, X, Save, ArrowLeft } from 'lucide-react';

// Mock API functions - replace with actual API calls
const api = {
  async getAds(filters = {}) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockAds.filter(ad => {
      if (filters.category && ad.category !== filters.category) return false;
      if (filters.city && ad.city !== filters.city) return false;
      if (filters.area && ad.area !== filters.area) return false;
      if (filters.urgency && ad.urgency !== filters.urgency) return false;
      if (filters.published !== undefined && ad.published !== filters.published) return false;
      return true;
    });
  },
  
  async createAd(ad) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newAd = { ...ad, id: Date.now(), createdAt: new Date().toISOString() };
    mockAds.push(newAd);
    return newAd;
  },
  
  async updateAd(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockAds.findIndex(ad => ad.id === id);
    if (index !== -1) {
      mockAds[index] = { ...mockAds[index], ...updates };
      return mockAds[index];
    }
    throw new Error('Ad not found');
  },
  
  async deleteAd(id) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockAds.findIndex(ad => ad.id === id);
    if (index !== -1) {
      mockAds.splice(index, 1);
      return true;
    }
    throw new Error('Ad not found');
  }
};

// Mock data
let mockAds = [
  {
    id: 1,
    title: 'Plumber needed urgently',
    description: 'Water leak in basement, need immediate assistance',
    category: 'Problem',
    city: 'New York',
    area: 'Manhattan',
    urgency: 'High',
    published: true,
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    title: 'Looking for electrician',
    description: 'Need to install new electrical outlets in kitchen',
    category: 'Problem',
    city: 'Los Angeles',
    area: 'Hollywood',
    urgency: 'Medium',
    published: true,
    createdAt: '2024-01-14T14:20:00Z'
  },
  {
    id: 3,
    title: 'Garden maintenance service',
    description: 'Weekly garden maintenance for residential property',
    category: 'Problem',
    city: 'Chicago',
    area: 'Downtown',
    urgency: 'Low',
    published: false,
    createdAt: '2024-01-13T09:15:00Z'
  }
];

const categories = {
  Problem: ['Plumbing', 'Electrical', 'Carpentry', 'Gardening', 'Cleaning', 'Other'],
  City: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
  Area: ['Downtown', 'Uptown', 'Suburbs', 'Manhattan', 'Hollywood', 'Midtown'],
  Urgency: ['Low', 'Medium', 'High', 'Critical']
};

const AdForm = ({ ad, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: ad?.title || '',
    description: ad?.description || '',
    category: ad?.category || 'Problem',
    city: ad?.city || '',
    area: ad?.area || '',
    urgency: ad?.urgency || 'Medium',
    published: ad?.published || false
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.city || !formData.area) {
      alert('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await onSave(formData);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {ad ? 'Edit Advertisement' : 'Create New Advertisement'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.keys(categories).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <select
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select City</option>
              {categories.City.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Area *
            </label>
            <select
              value={formData.area}
              onChange={(e) => handleChange('area', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Area</option>
              {categories.Area.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Urgency *
            </label>
            <select
              value={formData.urgency}
              onChange={(e) => handleChange('urgency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.Urgency.map(urgency => (
                <option key={urgency} value={urgency}>{urgency}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="published"
            checked={formData.published}
            onChange={(e) => handleChange('published', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="published" className="ml-2 text-sm font-medium text-gray-700">
            Publish to public site
          </label>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdCard = ({ ad, onEdit, onDelete, onTogglePublish, isBackOffice = false }) => {
  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-800">{ad.title}</h3>
        {isBackOffice && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onTogglePublish(ad.id, !ad.published)}
              className={`p-1 rounded ${ad.published ? 'text-green-600' : 'text-gray-400'}`}
              title={ad.published ? 'Published' : 'Not Published'}
            >
              {ad.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onEdit(ad)}
              className="p-1 text-blue-600 hover:text-blue-800"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(ad.id)}
              className="p-1 text-red-600 hover:text-red-800"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      
      <p className="text-gray-600 mb-4">{ad.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
          {ad.category}
        </span>
        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded">
          {ad.city}
        </span>
        <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-sm rounded">
          {ad.area}
        </span>
        <span className={`px-2 py-1 text-sm rounded ${getUrgencyColor(ad.urgency)}`}>
          {ad.urgency}
        </span>
      </div>
      
      <div className="text-sm text-gray-500">
        Created: {new Date(ad.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

const FilterBar = ({ filters, onFilterChange, isBackOffice = false }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex items-center mb-4">
        <Filter className="w-5 h-5 mr-2 text-gray-600" />
        <h3 className="text-lg font-medium text-gray-800">Filters</h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={filters.category || ''}
            onChange={(e) => onFilterChange('category', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">All Categories</option>
            {Object.keys(categories).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <select
            value={filters.city || ''}
            onChange={(e) => onFilterChange('city', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">All Cities</option>
            {categories.City.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Area
          </label>
          <select
            value={filters.area || ''}
            onChange={(e) => onFilterChange('area', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">All Areas</option>
            {categories.Area.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Urgency
          </label>
          <select
            value={filters.urgency || ''}
            onChange={(e) => onFilterChange('urgency', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">All Urgency</option>
            {categories.Urgency.map(urgency => (
              <option key={urgency} value={urgency}>{urgency}</option>
            ))}
          </select>
        </div>
      </div>
      
      {isBackOffice && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Publication Status
          </label>
          <select
            value={filters.published === undefined ? '' : filters.published.toString()}
            onChange={(e) => onFilterChange('published', e.target.value === '' ? undefined : e.target.value === 'true')}
            className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="">All Ads</option>
            <option value="true">Published Only</option>
            <option value="false">Draft Only</option>
          </select>
        </div>
      )}
    </div>
  );
};

const BackOffice = () => {
  const [ads, setAds] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingAd, setEditingAd] = useState(null);

  useEffect(() => {
    loadAds();
  }, [filters]);

  const loadAds = async () => {
    setLoading(true);
    try {
      const data = await api.getAds(filters);
      setAds(data);
    } catch (error) {
      console.error('Error loading ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleCreateAd = async (adData) => {
    try {
      await api.createAd(adData);
      setShowForm(false);
      loadAds();
    } catch (error) {
      console.error('Error creating ad:', error);
    }
  };

  const handleUpdateAd = async (adData) => {
    try {
      await api.updateAd(editingAd.id, adData);
      setEditingAd(null);
      setShowForm(false);
      loadAds();
    } catch (error) {
      console.error('Error updating ad:', error);
    }
  };

  const handleDeleteAd = async (id) => {
    if (window.confirm('Are you sure you want to delete this advertisement?')) {
      try {
        await api.deleteAd(id);
        loadAds();
      } catch (error) {
        console.error('Error deleting ad:', error);
      }
    }
  };

  const handleTogglePublish = async (id, published) => {
    try {
      await api.updateAd(id, { published });
      loadAds();
    } catch (error) {
      console.error('Error updating ad:', error);
    }
  };

  const handleEdit = (ad) => {
    setEditingAd(ad);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingAd(null);
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-2xl mx-auto">
          <AdForm
            ad={editingAd}
            onSave={editingAd ? handleUpdateAd : handleCreateAd}
            onCancel={handleCancelForm}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Back Office - Advertisement Management</h1>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Ad
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          isBackOffice={true}
        />

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ads.map(ad => (
              <AdCard
                key={ad.id}
                ad={ad}
                onEdit={handleEdit}
                onDelete={handleDeleteAd}
                onTogglePublish={handleTogglePublish}
                isBackOffice={true}
              />
            ))}
          </div>
        )}

        {!loading && ads.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No advertisements found.</p>
          </div>
        )}
      </main>
    </div>
  );
};

const PublicSite = () => {
  const [ads, setAds] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPublicAds();
  }, [filters]);

  const loadPublicAds = async () => {
    setLoading(true);
    try {
      const data = await api.getAds({ ...filters, published: true });
      setAds(data);
    } catch (error) {
      console.error('Error loading ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-4xl font-bold text-gray-800">Public Advertisements</h1>
          <p className="text-gray-600 mt-2">Browse available services and opportunities</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          isBackOffice={false}
        />

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ads.map(ad => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
        )}

        {!loading && ads.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No published advertisements found.</p>
          </div>
        )}
      </main>
    </div>
  );
};

const AdManagementSystem = () => {
  const [currentView, setCurrentView] = useState('public'); // 'public' or 'backoffice'

  return (
    <div>
      <nav className="bg-gray-800 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-xl font-bold">Advertisement System</div>
          <div className="space-x-4">
            <button
              onClick={() => setCurrentView('public')}
              className={`px-4 py-2 rounded ${currentView === 'public' ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-500'}`}
            >
              Public Site
            </button>
            <button
              onClick={() => setCurrentView('backoffice')}
              className={`px-4 py-2 rounded ${currentView === 'backoffice' ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-500'}`}
            >
              Back Office
            </button>
          </div>
        </div>
      </nav>
      
      {currentView === 'public' ? <PublicSite /> : <BackOffice />}
    </div>
  );
};

export default AdManagementSystem;