import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  DialogContentText,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useAuth } from '../context/AuthContext';
import { useBlog } from '../context/BlogContext';
import { useLoginModal } from '../context/LoginModalContext';

// --- BlogPostCard Component (No Changes) ---
function BlogPostCard({ post, onStartEditing, onDelete, currentUser }) {
  const navigate = useNavigate();
  const cardVariants = {
    rest: { scale: 1, boxShadow: '0px 5px 15px rgba(0,0,0,0.1)' },
    hover: { scale: 1.03, boxShadow: '0px 10px 30px rgba(0,0,0,0.2)' }
  };
  const imageVariants = {
    rest: { filter: 'blur(0px) brightness(1)' },
    hover: { filter: 'blur(2px) brightness(0.8)' }
  };
  return (
    <motion.div
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      animate="rest"
      style={{ width: '100%', height: '100%', display: 'flex' }}
    >
      <Card sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        {post.imageUrl && (
          <motion.div variants={imageVariants} transition={{ duration: 0.3 }}>
            <CardMedia component="img" height="200" image={post.imageUrl} alt={post.title} />
          </motion.div>
        )}
        <CardContent sx={{ flexGrow: 1, overflow: 'hidden' }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            {post.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{
            wordWrap: 'break-word', 
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {post.content}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 0 }}>
          <Button size="small" variant="contained" onClick={() => navigate(`/blog/${post.id}`)}>
            Read More
          </Button>
          <div>
            {currentUser && currentUser.uid === post.userId && (
              <>
                <IconButton size="small" onClick={() => onStartEditing(post)} color="primary"><EditIcon /></IconButton>
                <IconButton size="small" onClick={() => onDelete(post.id)} color="error"><DeleteIcon /></IconButton>
              </>
            )}
          </div>
        </CardActions>
      </Card>
    </motion.div>
  );
}


// --- Main Blog Component ---
function Blog() {
  const { currentUser } = useAuth();
  const { openLoginModal } = useLoginModal();
  const { posts, loading, addPost, updatePost, deletePost } = useBlog();
  
  const [newPost, setNewPost] = useState({ title: '', content: '', imageUrl: '' });
  const [editingPost, setEditingPost] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [confirmation, setConfirmation] = useState({
    open: false,
    title: '',
    content: '',
    onConfirm: () => {},
  });

  const handleOpenDialog = () => {
    if (!currentUser) {
      openLoginModal();
      return;
    }
    if (editingPost) {
      setConfirmation({
        open: true,
        title: 'Discard Unsaved Changes?',
        content: 'You are currently editing a post. Closing it now will discard any changes. Are you sure you want to proceed?',
        onConfirm: () => {
          setEditingPost(null);
          setIsDialogOpen(true);
        },
      });
    } else {
      setIsDialogOpen(true);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditingChange = (e) => {
    const { name, value } = e.target;
    setEditingPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setNewPost(prev => ({ ...prev, imageUrl: reader.result })); };
      reader.readAsDataURL(file);
    }
  };

  const handleEditingImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setEditingPost(prev => ({ ...prev, imageUrl: reader.result })); };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveNewImage = () => {
    setNewPost(prev => ({ ...prev, imageUrl: '' }));
  };

  const handleRemoveEditingImage = () => {
    setEditingPost(prev => ({ ...prev, imageUrl: '' }));
  };
  
  const handleAddPost = async () => {
    if (newPost.title.trim() === '' || newPost.content.trim() === '') {
      alert('Title and Content cannot be empty.');
      return;
    }
    const postToAdd = { ...newPost, userId: currentUser.uid, authorEmail: currentUser.email };
    try {
      await addPost(postToAdd);
      setNewPost({ title: '', content: '', imageUrl: '' });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding post: ", error);
      alert("Failed to add post. Please try again.");
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(postId);
      } catch (error) {
        console.error("Error deleting post: ", error);
        alert("Failed to delete post. Please try again.");
      }
    }
  };

  const handleUpdatePost = async () => {
    if (!editingPost || editingPost.title.trim() === '' || editingPost.content.trim() === '') {
      alert('Title and Content cannot be empty.');
      return;
    }
    try {
      await updatePost(editingPost);
      setEditingPost(null);
    } catch (error) {
      console.error("Error updating post: ", error);
      alert("Failed to update post. Please try again.");
    }
  };
  
  const handleCancel = () => {
    setIsDialogOpen(false);
    setEditingPost(null);
  };

  const handleCloseConfirmation = () => {
    setConfirmation({ ...confirmation, open: false });
  };

  const handleConfirmAction = () => {
    confirmation.onConfirm();
    handleCloseConfirmation();
  };

  const handleStartEditing = (post) => {
    if (isDialogOpen) {
      setConfirmation({
        open: true,
        title: 'Discard Unsaved Changes?',
        content: 'You have an open "Add New Post" window. Closing it now will discard any unsaved content. Are you sure you want to proceed?',
        onConfirm: () => {
          setIsDialogOpen(false);
          setEditingPost({ ...post });
        },
      });
    } else {
      setEditingPost({ ...post });
    }
  };

  // ==========================================================
  //
  // THIS IS THE FUNCTION YOU ARE ASKING ABOUT
  // It is located inside the Blog component.
  // It is already correctly written and does not need changes.
  //
  // ==========================================================
  // In Blog.jsx

const handleGenerateContent = async () => {
  if (newPost.title.trim() === '') {
    alert('Please provide a title to generate content.');
    return;
  }
  setIsGenerating(true);
  try {
    // CHANGE THIS URL to your new endpoint
    const response = await fetch('/api/generateBlog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: newPost.title }),
    });

    if (!response.ok) {
      // Improved error handling
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate content');
    }

    const data = await response.json();
    setNewPost(prev => ({ ...prev, content: data.content }));

  } catch (error) {
    console.error('Error generating content:', error);
    alert(`There was an error generating the blog content: ${error.message}`);
  } finally {
    setIsGenerating(false);
  }
};

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ color: 'white', fontWeight: 'bold' }}>
          My Blog
        </Typography>
        <Button variant="contained" color="secondary" startIcon={<AddCircleIcon />} onClick={handleOpenDialog}>
          Add New Blog
        </Button>
      </Box>

      {/* --- "ADD NEW POST" DIALOG (UPDATED) --- */}
      <Dialog open={isDialogOpen} onClose={handleCancel} fullWidth maxWidth="sm">
          <DialogTitle>Create a New Post</DialogTitle>
          <DialogContent>
            <TextField autoFocus margin="dense" name="title" label="Blog Title" type="text" fullWidth variant="standard" value={newPost.title} onChange={handleInputChange} />
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, mt: 2 }}>
              <TextField margin="dense" name="imageUrl" label="Image URL or Upload" type="text" fullWidth variant="standard" value={newPost.imageUrl} onChange={handleInputChange} sx={{ flexGrow: 1 }} />
              <IconButton color="primary" aria-label="upload picture" component="label">
                <input hidden accept="image/*" type="file" onChange={handleImageChange} />
                <UploadFileIcon />
              </IconButton>
            </Box>
            
            {/* --- FIX: Stricter condition to prevent rendering empty images --- */}
            {newPost.imageUrl && newPost.imageUrl.length > 0 && (
              <Box sx={{ position: 'relative', mt: 2, textAlign: 'center' }}>
                <img src={newPost.imageUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }} />
                <IconButton
                  aria-label="remove image"
                  onClick={handleRemoveNewImage}
                  size="small"
                  sx={{
                    position: 'absolute', top: 4, right: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
                  }}
                >
                  <DeleteIcon color="error" />
                </IconButton>
              </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mt: 2 }}>
              <TextField margin="dense" name="content" label="What's on your mind?" type="text" fullWidth multiline rows={4} variant="standard" value={newPost.content} onChange={handleInputChange}/>
              <Box sx={{ mt: 2, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Button onClick={handleGenerateContent} variant="outlined" startIcon={<AutoAwesomeIcon />} disabled={!newPost.title || isGenerating} sx={{ height: '56px' }}> Generate </Button>
                {isGenerating && <CircularProgress size={24} sx={{ position: 'absolute' }} />}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleAddPost} variant="contained">Publish</Button>
          </DialogActions>
      </Dialog>

      {/* --- "EDIT POST" DIALOG (UPDATED) --- */}
      <Dialog open={!!editingPost} onClose={handleCancel} fullWidth maxWidth="sm">
        {editingPost && (
          <>
            <DialogTitle>Edit Post</DialogTitle>
            <DialogContent>
              
              {/* --- FIX: Stricter condition to prevent rendering empty images --- */}
              {editingPost.imageUrl && editingPost.imageUrl.length > 0 && ( 
                <Box sx={{ position: 'relative', mb: 2 }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={editingPost.imageUrl}
                    alt="Current"
                    sx={{ borderRadius: '4px' }}
                  />
                  <IconButton
                    aria-label="remove image"
                    onClick={handleRemoveEditingImage}
                    sx={{
                      position: 'absolute', top: 8, right: 8,
                      backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white',
                      '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}

              <TextField autoFocus margin="dense" name="title" label="Blog Title" type="text" fullWidth variant="standard" value={editingPost.title} onChange={handleEditingChange} />
              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, mt: 2 }}>
                <TextField 
                  margin="dense" 
                  name="imageUrl" 
                  label="Image URL or Upload" 
                  type="text" 
                  fullWidth 
                  variant="standard" 
                  value={editingPost.imageUrl} 
                  onChange={handleEditingChange} 
                  sx={{ flexGrow: 1 }} 
                />
                <IconButton color="primary" aria-label="upload picture" component="label">
                  <input hidden accept="image/*" type="file" onChange={handleEditingImageChange} />
                  <UploadFileIcon />
                </IconButton>
              </Box>
              <TextField margin="dense" name="content" label="Content" type="text" fullWidth multiline rows={10} variant="standard" value={editingPost.content} onChange={handleEditingChange} sx={{ mt: 2 }}/>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button onClick={handleUpdatePost} variant="contained" startIcon={<SaveIcon />}>Save Changes</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Dialog open={confirmation.open} onClose={handleCloseConfirmation}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <WarningAmberIcon color="warning" sx={{ mr: 1 }} />
          {confirmation.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{confirmation.content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmation}>Cancel</Button>
          <Button onClick={handleConfirmAction} color="primary" variant="contained" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Grid and Loading display is unchanged */}
      {loading ? ( <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}><CircularProgress color="secondary" /></Box>) : (
        <Grid container spacing={4}>
          {posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id} sx={{ display: 'flex', alignItems: 'stretch' }}>
              <BlogPostCard
                post={post}
                currentUser={currentUser}
                onStartEditing={handleStartEditing}
                onDelete={handleDeletePost}
              />
            </Grid>
          ))}
        </Grid>
      )}
      
      {!loading && posts.length === 0 && (
        <Typography align="center" sx={{ mt: 8, color: 'white', textShadow: '1px 1px 2px black' }}>
          No blog posts yet. Create one!
        </Typography>
      )}
    </Container>
  );
}

export default Blog;