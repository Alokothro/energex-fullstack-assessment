import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { postsAPI } from '../services/api';
import { Post } from '../types';
import './Posts.css';

interface PostFormProps {
  onPostCreated: (post: Post) => void;
}

const PostForm: React.FC<PostFormProps> = ({ onPostCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await postsAPI.create({ title, content });
      onPostCreated(response.data);
      setTitle('');
      setContent('');
      setIsExpanded(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="post-form-container">
        <p className="login-prompt">Please login to create posts</p>
      </div>
    );
  }

  return (
    <div className="post-form-container">
      {!isExpanded ? (
        <button className="create-post-button" onClick={() => setIsExpanded(true)}>
          Create New Post
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="post-form">
          <h3>Create New Post</h3>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <input
              type="text"
              placeholder="Post title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="post-title-input"
            />
          </div>
          
          <div className="form-group">
            <textarea
              placeholder="Write your content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={6}
              className="post-content-input"
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Post'}
            </button>
            <button 
              type="button" 
              onClick={() => {
                setIsExpanded(false);
                setTitle('');
                setContent('');
                setError('');
              }}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PostForm;