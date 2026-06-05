import { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

interface UserProfile {
    email: string;
    name: string;
    password: string;
}

const Profile = () => {
    const [userInfo, setUserInfo] = useState<UserProfile>({
        email: '',
        name: '',
        password: '',
    });
    const [editName, setEditName] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Load user info from localStorage on mount
    useEffect(() => {
        const userData = localStorage.getItem('userInfo');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUserInfo(parsedUser);
            setEditName(parsedUser.name || '');
        }
    }, []);

    // Clear message after 3 seconds
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!editName.trim()) {
            newErrors.name = 'Name cannot be empty';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return false;
        }

        setErrors({});
        return true;
    };

    const handleSaveName = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSaving(true);

        try {
            const updatedUser = {
                ...userInfo,
                name: editName.trim(),
            };

            // Update localStorage
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));
            setUserInfo(updatedUser);

            // Also update in users list
            const usersData = localStorage.getItem('users');
            if (usersData) {
                const users = JSON.parse(usersData);
                const userIndex = users.findIndex((u: UserProfile) => u.email === userInfo.email);
                if (userIndex !== -1) {
                    users[userIndex].name = editName.trim();
                    localStorage.setItem('users', JSON.stringify(users));
                }
            }

            setIsEditing(false);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });

            // Dispatch custom event to notify sidebar of change
            window.dispatchEvent(new Event('userProfileUpdated'));
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setEditName(userInfo.name || '');
        setIsEditing(false);
        setErrors({});
    };

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-header">
                    <h1 className="profile-title">Profile Settings</h1>
                    <p className="profile-subtitle">Manage your account information</p>
                </div>

                {/* Success/Error Message */}
                {message && (
                    <div className={`profile-message profile-message-${message.type}`}>
                        {message.type === 'success' ? '✓' : '✕'} {message.text}
                    </div>
                )}

                {/* Email Section */}
                <div className="profile-section">
                    <div className="profile-section-title">Account Email</div>
                    <div className="profile-form-group">
                        <label className="profile-label">Email Address</label>
                        <div className="profile-email-display">
                            <span className="email-value">{userInfo.email}</span>
                            <span className="email-badge">Verified</span>
                        </div>
                        <p className="profile-help-text">Your email address is your unique identifier and cannot be changed.</p>
                    </div>
                </div>

                {/* Name Section */}
                <div className="profile-section">
                    <div className="profile-section-title">Display Name</div>
                    <div className="profile-form-group">
                        <label className="profile-label">Full Name</label>
                        {!isEditing ? (
                            <div className="profile-name-display">
                                <span className="name-value">{userInfo.name || 'Not set'}</span>
                                <Button
                                    className="profile-edit-btn"
                                    onClick={() => {
                                        setEditName(userInfo.name || '');
                                        setIsEditing(true);
                                        setErrors({});
                                    }}
                                >
                                    Edit
                                </Button>
                            </div>
                        ) : (
                            <div className="profile-edit-form">
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={editName}
                                    onChange={e => {
                                        setEditName(e.target.value);
                                        if (errors.name) {
                                            setErrors({ ...errors, name: '' });
                                        }
                                    }}
                                    className={`profile-input ${errors.name ? 'is-invalid' : ''}`}
                                    maxLength={50}
                                />
                                {errors.name && <div className="profile-error">{errors.name}</div>}
                                <div className="profile-char-count">
                                    {editName.length}/50 characters
                                </div>
                                <div className="profile-button-group">
                                    <Button
                                        className="profile-save-btn"
                                        onClick={handleSaveName}
                                        disabled={isSaving}
                                    >
                                        {isSaving ? 'Saving...' : 'Save'}
                                    </Button>
                                    <Button
                                        className="profile-cancel-btn"
                                        onClick={handleCancel}
                                        disabled={isSaving}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                        <p className="profile-help-text">
                            Your display name will be shown in the sidebar and throughout the application.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
