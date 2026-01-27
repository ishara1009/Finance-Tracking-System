import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { updateProfile, changePassword } from '../../api/api';
import './Profile.css';

const Profile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    phone_number: '',
    profile_picture: ''
  });
  
  // Password form state
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        phone_number: user.phone_number || '',
        profile_picture: user.profile_picture || ''
      });
      setPreviewImage(user.profile_picture || null);
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
    setMessage('');
    setError('');
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
    setPasswordMessage('');
    setPasswordError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setProfileData({ ...profileData, profile_picture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await updateProfile(profileData);
      setMessage(response.data.message);
      setUser(response.data.user);
      
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage('');
    setPasswordError('');

    // Validate passwords match
    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordError('New passwords do not match');
      return;
    }

    // Validate password length
    if (passwordData.new_password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      
      setPasswordMessage(response.data.message);
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      
      setTimeout(() => {
        setPasswordMessage('');
      }, 3000);
    } catch (err) {
      setPasswordError(err.response?.data?.error || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <button onClick={() => navigate('/dashboard')} className="back-button">
            ← Back to Dashboard
          </button>
          <h1>Profile Settings</h1>
        </div>

        <div className="profile-content">
          {/* Profile Information Section */}
          <div className="profile-section">
            <h2>Profile Information</h2>
            
            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleProfileSubmit}>
              <div className="profile-picture-section">
                <div className="profile-picture-preview">
                  {previewImage ? (
                    <img src={previewImage} alt="Profile" />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                </div>
                <div className="upload-section">
                  <label htmlFor="profile-picture" className="upload-button">
                    Choose Photo
                  </label>
                  <input
                    type="file"
                    id="profile-picture"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                  <p className="upload-hint">Max size: 5MB</p>
                </div>
              </div>

              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="disabled-input"
                />
                <p className="input-hint">Email cannot be changed</p>
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={profileData.phone_number}
                  onChange={handleProfileChange}
                  placeholder="Enter phone number"
                />
              </div>

              <button type="submit" className="save-button" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Change Password Section */}
          <div className="profile-section">
            <h2>Change Password</h2>
            
            {passwordMessage && <div className="success-message">{passwordMessage}</div>}
            {passwordError && <div className="error-message">{passwordError}</div>}
            
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="current_password"
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirm_password"
                  value={passwordData.confirm_password}
                  onChange={handlePasswordChange}
                  required
                  minLength="6"
                />
              </div>

              <button type="submit" className="save-button" disabled={loading}>
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
