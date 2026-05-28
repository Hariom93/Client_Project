import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { apiCall } from '../services/api';
import { Search, MapPin, Phone, Globe, Star, Plus, X, MessageSquare, Landmark } from 'lucide-react';
import { motion } from 'framer-motion';
import '../styles/businesses.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.05 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
};

const Businesses = () => {
  const { user, showToast } = useAuth();
  const { language, t } = useLanguage();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search/Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');

  // Modals state
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  // Add Listing Form state
  const [name, setName] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [newCity, setNewCity] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [logo, setLogo] = useState('');

  // Add Review state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const fetchListings = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (category) queryParams.append('category', category);
      if (city) queryParams.append('city', city);

      const response = await apiCall(`/api/businesses?${queryParams.toString()}`);
      if (response.success) {
        setListings(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch business directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [search, category, city]);

  const handleAddListing = async (e) => {
    e.preventDefault();
    if (!name || !newCategory || !newCity) {
      showToast('Name, Category, and City are required.', 'error');
      return;
    }

    try {
      const response = await apiCall('/api/businesses', {
        method: 'POST',
        body: JSON.stringify({
          name,
          category: newCategory,
          description,
          address,
          city: newCity,
          phone,
          website,
          logo
        })
      });

      if (response.success) {
        showToast('Business listing added successfully!', 'success');
        setShowAddForm(false);
        // Clear inputs
        setName(''); setNewCategory(''); setDescription(''); setAddress(''); setNewCity(''); setPhone(''); setWebsite(''); setLogo('');
        fetchListings();
      }
    } catch (err) {
      showToast(err.message || 'Failed to create business listing', 'error');
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!comment) {
      showToast('Please add a comment for your review.', 'error');
      return;
    }

    try {
      const response = await apiCall(`/api/businesses/${selectedBusiness._id}/reviews`, {
        method: 'POST',
        body: JSON.stringify({ rating, comment })
      });

      if (response.success) {
        showToast('Review added successfully!', 'success');
        setComment('');
        // Update selected business state
        setSelectedBusiness(response.data);
        fetchListings();
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit review', 'error');
    }
  };

  const getCategoriesList = () => {
    const list = new Set(listings.map(l => l.category));
    return Array.from(list);
  };

  return (
    <div className="container business-page" style={{ padding: '40px 24px' }}>
      <div className="business-header-row">
        <div>
          <h1 className="section-title" style={{ textAlign: 'left', margin: 0 }}>{t('business')} Directory</h1>
          <p className="section-subtitle" style={{ textAlign: 'left', margin: '8px 0 0 0' }}>
            Discover and support businesses owned and run by members of the Gujjar Samaj.
          </p>
        </div>
        {user ? (
          <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
            <Plus size={18} /> Register My Business
          </button>
        ) : (
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Login to register your business</span>
        )}
      </div>

      {/* Filters Panel */}
      <motion.div className="glass-card" style={{ padding: '24px', marginBottom: '30px' }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'end' }}>
          
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Search Business</label>
            <div style={{ position: 'relative' }}>
              <input type="text" className="form-control" placeholder="Search by name/keywords..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: '36px' }} />
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Category</label>
            <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All Categories</option>
              {getCategoriesList().map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">{t('cityFilter')}</label>
            <input type="text" className="form-control" placeholder="e.g. Noida" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>

          <button className="btn btn-secondary" onClick={() => { setSearch(''); setCategory(''); setCity(''); }} style={{ height: '46px' }}>
            Reset Filters
          </button>
        </div>
      </motion.div>

      {/* Business Listings Grid */}
      {loading ? (
        <div className="flex-center" style={{ minHeight: '30vh' }}>
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', color: 'var(--danger)', padding: '20px' }}>{error}</div>
      ) : listings.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '48px' }}>
          <Landmark size={48} style={{ color: 'var(--accent)', margin: '0 auto 16px auto', opacity: 0.5 }} />
          <p>No business listings found matching your criteria.</p>
        </div>
      ) : (
        <motion.div className="grid-3" variants={containerVariants} initial="hidden" animate="visible">
          {listings.map((item) => (
            <motion.div key={item._id} className="glass-card" variants={itemVariants} whileHover={{ y: -4 }} style={{ display: 'flex', flexDirection: 'column', padding: '24px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                {item.logo ? (
                  <img src={item.logo} alt={item.name} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border)' }} />
                ) : (
                  <div style={{ width: '60px', height: '60px', borderRadius: '8px', backgroundColor: 'var(--accent-light)', color: 'var(--accent-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.25rem', border: '1px solid var(--border)' }}>
                    {item.name.charAt(0)}
                  </div>
                )}
                <div>
                  <span className="badge badge-pending" style={{ fontSize: '0.65rem', marginBottom: '4px' }}>{item.category}</span>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>{item.name}</h3>
                </div>
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '16px', flexGrow: 1 }}>
                {item.description ? item.description.slice(0, 100) + '...' : 'No description provided.'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border)', paddingTop: '12px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={14} style={{ color: 'var(--accent)' }} />
                  <span>{item.address ? `${item.address}, ` : ''}{item.city}</span>
                </div>
                {item.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={14} style={{ color: 'var(--accent)' }} />
                    <span>{item.phone}</span>
                  </div>
                )}
                {item.website && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Globe size={14} style={{ color: 'var(--accent)' }} />
                    <a href={`https://${item.website}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>{item.website}</a>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '12px', marginTop: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={16} fill="var(--warning)" color="var(--warning)" />
                  <strong>{item.averageRating || 'New'}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({item.reviews?.length || 0} reviews)</span>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={() => setSelectedBusiness(item)}>
                  Reviews & Rate
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Register Business Form Modal */}
      {showAddForm && (
        <div className="business-modal-overlay">
          <form onSubmit={handleAddListing} className="glass-card animate-fade-up business-modal">
            <button type="button" onClick={() => setShowAddForm(false)} className="business-modal-close">
              <X size={24} />
            </button>

            <h2 style={{ marginBottom: '20px' }}>List Your Business</h2>
            <div className="business-form-grid">
              <div className="form-group">
                <label className="form-label">Business Name *</label>
                <input type="text" className="form-control" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Bhadana Dairy Products" />
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <input type="text" className="form-control" required value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="e.g. Real Estate, Food, Education" />
              </div>

              <div className="form-group">
                <label className="form-label">City *</label>
                <input type="text" className="form-control" required value={newCity} onChange={(e) => setNewCity(e.target.value)} placeholder="e.g. Noida" />
              </div>

              <div className="form-group">
                <label className="form-label">Address</label>
                <input type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="e.g. Shop 12, Sector 15 Market" />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Number</label>
                <input type="text" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. +91 9988776655" />
              </div>

              <div className="form-group">
                <label className="form-label">Website Domain (optional)</label>
                <input type="text" className="form-control" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="e.g. www.mybuilders.com" />
              </div>

              <div className="form-group business-grid-full">
                <label className="form-label">Logo / Image URL</label>
                <input type="text" className="form-control" value={logo} onChange={(e) => setLogo(e.target.value)} placeholder="e.g. https://images.unsplash.com/photo-..." />
              </div>

              <div className="form-group business-grid-full">
                <label className="form-label">Business Description</label>
                <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tell community members about your business offerings..."></textarea>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Submit Listing</button>
          </form>
        </div>
      )}

      {/* Business Details & Review Modal */}
      {selectedBusiness && (
        <div className="business-modal-overlay">
          <div className="glass-card animate-fade-up business-modal business-modal-wide">
            <button onClick={() => setSelectedBusiness(null)} className="business-modal-close">
              <X size={24} />
            </button>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
              {selectedBusiness.logo ? (
                <img src={selectedBusiness.logo} alt={selectedBusiness.name} style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '80px', height: '80px', borderRadius: '8px', backgroundColor: 'var(--accent-light)', color: 'var(--accent-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '2rem' }}>
                  {selectedBusiness.name.charAt(0)}
                </div>
              )}
              <div>
                <span className="badge badge-pending" style={{ marginBottom: '4px' }}>{selectedBusiness.category}</span>
                <h2>{selectedBusiness.name}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', marginTop: '4px' }}>
                  <Star size={16} fill="var(--warning)" color="var(--warning)" />
                  <strong>{selectedBusiness.averageRating}</strong> ({selectedBusiness.reviews?.length || 0} Reviews)
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <strong>Description:</strong>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>{selectedBusiness.description || 'No description provided.'}</p>
              </div>

              {/* Reviews List */}
              <div>
                <strong>Reviews & Ratings ({selectedBusiness.reviews?.length || 0})</strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px', maxHeight: '200px', overflowY: 'auto' }}>
                  {selectedBusiness.reviews && selectedBusiness.reviews.length > 0 ? (
                    selectedBusiness.reviews.map((rev, index) => (
                      <div key={index} style={{ border: '1px solid var(--border)', borderRadius: '6px', padding: '12px', backgroundColor: 'var(--bg-primary)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <strong style={{ fontSize: '0.85rem' }}>{rev.userName}</strong>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: 'var(--warning)', fontSize: '0.8rem' }}>
                            <Star size={12} fill="var(--warning)" color="var(--warning)" /> {rev.rating}
                          </div>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{rev.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No reviews yet. Be the first to review!</p>
                  )}
                </div>
              </div>

              {/* Add Review Form */}
              {user ? (
                <form onSubmit={handleAddReview} style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                  <strong>Write a Review</strong>
                  <div className="form-group" style={{ margin: '12px 0' }}>
                    <label className="form-label">Rating</label>
                    <select className="form-control" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                      <option value="5">⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                      <option value="4">⭐⭐⭐⭐ (4 - Good)</option>
                      <option value="3">⭐⭐⭐ (3 - Average)</option>
                      <option value="2">⭐⭐ (2 - Poor)</option>
                      <option value="1">⭐ (1 - Terrible)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Comment</label>
                    <input type="text" className="form-control" required value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Tell us about your experience..." />
                  </div>
                  <button type="submit" className="btn btn-primary btn-sm" style={{ width: '100%' }}>Submit Review</button>
                </form>
              ) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                  Please login to leave a review.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Businesses;
