import React, { useState, useEffect, useRef } from 'react'; // <-- ADDED useRef
// import { useNavigate } from 'react-router-dom'; // No longer needed
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  CardActions,
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

// --- A SIMPLE, RELIABLE CLEANING FUNCTION (SAFETY NET) ---
const finalCleanup = (text) => {
  if (!text) return '';
  return text.trim().replace(/^(\*\*|##|\*)\s*/, '').replace(/\s*(\*\*)$/, '');
};

// --- MUI COMPONENT MAPPING FOR REACT-MARKDOWN ---
const markdownComponents = {
  h1: ({node, ...props}) => <Typography variant="h3" component="h1" gutterBottom {...props} />,
  h2: ({node, ...props}) => <Typography variant="h4" component="h2" gutterBottom {...props} />,
  h3: ({node, ...props}) => <Typography variant="h5" component="h3" gutterBottom {...props} />,
  h4: ({node, ...props}) => <Typography variant="h6" component="h4" gutterBottom {...props} />,
  p: ({node, ...props}) => <Typography variant="body1" paragraph {...props} />,
  strong: ({node, ...props}) => <Typography component="span" sx={{ fontWeight: 'bold' }} {...props} />,
};

// =============================================================================
// BlogPostItem Component
// =============================================================================
function BlogPostItem({ post, onStartEditing, onDelete, currentUser }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);

  const cleanedContent = finalCleanup(post.content);
  const TRUNCATE_LENGTH = 450;

  // =======================================================================
  // START OF NEW CODE for auto-collapse functionality
  // =======================================================================

  // useRef is used to hold the timer ID. Unlike state, updating it won't cause a re-render.
  const collapseTimer = useRef(null);

  // This function is called when the user's mouse pointer enters the card.
  const handleMouseEnter = () => {
    // If there's an active timer waiting to collapse the post, we clear it.
    // This stops the post from collapsing if the user moves their mouse away and then back on.
    if (collapseTimer.current) {
      clearTimeout(collapseTimer.current);
    }
  };

  // This function is called when the user's mouse pointer leaves the card.
  const handleMouseLeave = () => {
    // We only want to start the collapse timer if the post is currently expanded.
    if (isExpanded) {
      // Set a 5-second timer. When it completes, it will set isExpanded to false.
      collapseTimer.current = setTimeout(() => {
        setIsExpanded(false);
      }, 5000); // 5000 milliseconds = 5 seconds
    }
  };

  // This useEffect hook is for cleanup.
  useEffect(() => {
    // The function returned by useEffect runs when the component is unmounted.
    // This is crucial to prevent memory leaks if the post is deleted while the timer is running.
    return () => {
      clearTimeout(collapseTimer.current);
    };
  }, []); // The empty dependency array [] means this effect runs only once on mount.

  // =======================================================================
  // END OF NEW CODE for auto-collapse functionality
  // =======================================================================

  useEffect(() => {
    if (cleanedContent.length > TRUNCATE_LENGTH) {
      setShowReadMore(true);
    } else {
      setShowReadMore(false);
    }
  }, [cleanedContent, TRUNCATE_LENGTH]);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const contentStyles = {
    my: 2,
    ...(showReadMore && !isExpanded && {
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: 3,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }),
  };

  const itemVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.01 }
  };

  return (
    // We attach the new mouse event handlers to the outermost div of the component.
    <motion.div
      variants={itemVariants}
      initial="rest"
      whileHover="hover"
      animate="rest"
      transition={{ duration: 0.3 }}
      style={{ width: '100%' }}
      onMouseEnter={handleMouseEnter} // <-- ATTACHED MOUSE ENTER HANDLER
      onMouseLeave={handleMouseLeave} // <-- ATTACHED MOUSE LEAVE HANDLER
    >
      <Card elevation={3} sx={{ width: '100%' }}>
        {post.imageUrl && (
          <CardMedia
            component="img"
            image={post.imageUrl}
            alt={post.title}
            sx={{
              width: '100%',
              height: 350,
              objectFit: 'cover',
            }}
          />
        )}
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
            {post.title}
          </Typography>
          <Typography variant="caption" color="text.secondary" gutterBottom>
            By {post.authorEmail || 'Anonymous'}
          </Typography>
          <Box sx={contentStyles}>
            <ReactMarkdown components={markdownComponents}>
              {showReadMore && !isExpanded
                ? cleanedContent.substring(0, TRUNCATE_LENGTH) + '...'
                : cleanedContent}
            </ReactMarkdown>
          </Box>
        </CardContent>
        <CardActions sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', p: 2 }}>
          {showReadMore && (
            <Button size="small" variant="contained" onClick={handleToggleExpand}>
              {isExpanded ? 'See Less' : 'Read More'}
            </Button>
          )}
          {currentUser && currentUser.uid === post.userId && (
            <Box sx={{ ml: 1 }}>
              <IconButton size="small" onClick={() => onStartEditing(post)} color="primary"><EditIcon /></IconButton>
              <IconButton size="small" onClick={() => onDelete(post.id)} color="error"><DeleteIcon /></IconButton>
            </Box>
          )}
        </CardActions>
      </Card>
    </motion.div>
  );
}


// =============================================================================
// MAIN BLOG COMPONENT (No logical changes were needed here)
// =============================================================================
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

  // --- HANDLER FUNCTIONS ---
  const handleOpenDialog = () => {
    if (!currentUser) { openLoginModal(); return; }
    if (editingPost) {
      setConfirmation({
        open: true,
        title: 'Discard Unsaved Changes?',
        content: 'You are currently editing a post. Closing it now will discard any changes. Are you sure you want to proceed?',
        onConfirm: () => { setEditingPost(null); setIsDialogOpen(true); },
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

  const handleRemoveNewImage = () => { setNewPost(prev => ({ ...prev, imageUrl: '' })); };
  const handleRemoveEditingImage = () => { setEditingPost(prev => ({ ...prev, imageUrl: '' })); };

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
      alert("Failed to add post. Please try again.");
    }
  };

  const handleDeletePost = async (postId) => {
    setConfirmation({
        open: true,
        title: 'Delete Post?',
        content: 'This action is permanent and cannot be undone. Are you sure you want to delete this post?',
        onConfirm: async () => {
            try {
                await deletePost(postId);
            } catch (error) {
                alert("Failed to delete post. Please try again.");
            }
        },
    });
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
      alert("Failed to update post. Please try again.");
    }
  };

  const handleCancel = () => { setIsDialogOpen(false); setEditingPost(null); };
  const handleCloseConfirmation = () => { setConfirmation({ ...confirmation, open: false }); };
  const handleConfirmAction = () => { confirmation.onConfirm(); handleCloseConfirmation(); };

  const handleStartEditing = (post) => {
    if (isDialogOpen) {
      setConfirmation({
        open: true,
        title: 'Discard Unsaved Changes?',
        content: 'You have an open "Add New Post" window. Closing it now will discard any unsaved content. Are you sure you want to proceed?',
        onConfirm: () => { setIsDialogOpen(false); setEditingPost({ ...post }); },
      });
    } else {
      setEditingPost({ ...post });
    }
  };

  const handleGenerateContent = async () => {
    if (newPost.title.trim() === '') {
      alert('Please provide a title to generate content.');
      return;
    }
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generateBlog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newPost.title }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate content');
      }
      const data = await response.json();
      
      const cleanedContent = finalCleanup(data.content);
      setNewPost(prev => ({ ...prev, content: cleanedContent }));

    } catch (error) {
      alert(`There was an error generating the blog content: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // --- COMPONENT JSX ---
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ color: 'white', fontWeight: 'bold' }}>
          My Blog
        </Typography>
        <Button variant="contained" color="secondary" startIcon={<AddCircleIcon />} onClick={handleOpenDialog}>
          Add New Post
        </Button>
      </Box>

      {/* Dialogs for Adding/Editing */}
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
          {newPost.imageUrl && newPost.imageUrl.length > 0 && (
            <Box sx={{ position: 'relative', mt: 2, textAlign: 'center' }}>
              <img src={newPost.imageUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }} />
              <IconButton aria-label="remove image" onClick={handleRemoveNewImage} size="small" sx={{ position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(255, 255, 255, 0.8)', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' }, }}>
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
      <Dialog open={!!editingPost} onClose={handleCancel} fullWidth maxWidth="sm">
        {editingPost && (
          <>
            <DialogTitle>Edit Post</DialogTitle>
            <DialogContent>
              {editingPost.imageUrl && editingPost.imageUrl.length > 0 && (
                <Box sx={{ position: 'relative', mb: 2 }}>
                  <CardMedia component="img" height="200" image={editingPost.imageUrl} alt="Current" sx={{ borderRadius: '4px' }} />
                  <IconButton aria-label="remove image" onClick={handleRemoveEditingImage} sx={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' }, }}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
              <TextField autoFocus margin="dense" name="title" label="Blog Title" type="text" fullWidth variant="standard" value={editingPost.title} onChange={handleEditingChange} />
              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, mt: 2 }}>
                <TextField margin="dense" name="imageUrl" label="Image URL or Upload" type="text" fullWidth variant="standard" value={editingPost.imageUrl} onChange={handleEditingChange} sx={{ flexGrow: 1 }} />
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
        <DialogContent><DialogContentText>{confirmation.content}</DialogContentText></DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmation}>Cancel</Button>
          <Button onClick={handleConfirmAction} color="primary" variant="contained" autoFocus>Confirm</Button>
        </DialogActions>
      </Dialog>
      
      {/* Blog Post List */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress color="secondary" />
        </Box>
      ) : (
        <Grid container spacing={5} direction="column">
          {posts.map((post) => (
            <Grid item xs={12} key={post.id}>
              <BlogPostItem
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