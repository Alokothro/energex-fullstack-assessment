import React, { useState, useEffect } from 'react';
import { Post } from '../types';
import { postsAPI } from '../services/api';
import PostForm from './PostForm';
import './Posts.css';

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getAll();
      setPosts(response.data);
    } catch (err) {
      setError('Failed to fetch posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
  };

  const handleCloseDetail = () => {
    setSelectedPost(null);
  };

  if (loading) return <div className="loading">Loading posts...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="posts-container">
      <h1>Posts</h1>
      
      <PostForm onPostCreated={handlePostCreated} />
      
      <div className="posts-list">
        {posts.length === 0 ? (
          <p className="no-posts">No posts yet. Be the first to create one!</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post-card" onClick={() => handlePostClick(post)}>
              <h3>{post.title}</h3>
              <p className="post-content">{post.content.substring(0, 150)}...</p>
              <div className="post-meta">
                <span className="post-author">By {post.user?.name || 'Unknown'}</span>
                <span className="post-date">
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedPost && (
        <div className="post-detail-overlay" onClick={handleCloseDetail}>
          <div className="post-detail" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={handleCloseDetail}>×</button>
            <h2>{selectedPost.title}</h2>
            <div className="post-meta">
              <span className="post-author">By {selectedPost.user?.name || 'Unknown'}</span>
              <span className="post-date">
                {new Date(selectedPost.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="post-content-full">{selectedPost.content}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostList;