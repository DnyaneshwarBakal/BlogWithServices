import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';

// A unique key for localStorage
const LOCAL_STORAGE_KEY = 'react-blog-posts';

function Blog() {
  const [posts, setPosts] = useState(() => {
    const storedPosts = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedPosts ? JSON.parse(storedPosts) : [];
  });
  const [newPostContent, setNewPostContent] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingPostContent, setEditingPostContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  const handleAddPost = () => {
    if (newPostContent.trim() === '') {
      alert('Blog post cannot be empty.');
      return;
    }
    const newPost = {
      id: Date.now(),
      content: newPostContent,
      timestamp: new Date().toISOString(),
    };
    setPosts([newPost, ...posts]);
    setNewPostContent('');
  };

  const handleDeletePost = (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter((post) => post.id !== postId));
    }
  };

  const handleStartEditing = (post) => {
    setEditingPostId(post.id);
    setEditingPostContent(post.content);
  };

  const handleCancelEditing = () => {
    setEditingPostId(null);
    setEditingPostContent('');
  };

  const handleUpdatePost = () => {
    if (editingPostContent.trim() === '') {
      alert('Blog post cannot be empty.');
      return;
    }
    setPosts(
      posts.map((post) =>
        post.id === editingPostId
          ? { ...post, content: editingPostContent }
          : post
      )
    );
    handleCancelEditing();
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((post) =>
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [posts, searchTerm]);

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        background: (theme) =>
          theme.palette.mode === 'light'
            ? 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)'
            : 'linear-gradient(-45deg, #023, #023e8a, #0077b6, #0096c7)',
        backgroundSize: '400% 400%',
        animation: 'gradientAnimation 15s ease infinite',
      }}
    >
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center"
          sx={{ color: (theme) => theme.palette.mode === 'light' ? '#1f2937' : 'white', fontWeight: 'bold' }}>
          My Blog
        </Typography>

        <Card sx={{ mb: 4, p: 2 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>Create a New Post</Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              label="What's on your mind?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            />
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircleIcon />}
              onClick={handleAddPost}
            >
              Add Post
            </Button>
          </CardActions>
        </Card>

        <Card sx={{ mb: 4, p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Search Posts"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Card>

        <Grid container spacing={4}>
          {filteredPosts.map((post) => (
            <Grid item xs={12} key={post.id}>
              <Card>
                <CardContent>
                  {editingPostId === post.id ? (
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      variant="outlined"
                      value={editingPostContent}
                      onChange={(e) => setEditingPostContent(e.target.value)}
                    />
                  ) : (
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {post.content}
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>
                    Posted on {new Date(post.timestamp).toLocaleString()}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  {editingPostId === post.id ? (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        onClick={handleUpdatePost}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handleCancelEditing}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <IconButton onClick={() => handleStartEditing(post)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeletePost(post.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredPosts.length === 0 && (
          <Typography align="center" sx={{ mt: 4, color: 'white' }}>
            {posts.length > 0 ? 'No posts match your search.' : 'No blog posts yet. Add one above!'}
          </Typography>
        )}
      </Container>
    </Box>
  );
}

export default Blog;