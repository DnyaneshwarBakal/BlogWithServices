// blog detail page like date


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Card, CardMedia, CardContent, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useBlog } from '../context/BlogContext';

function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPostById } = useBlog();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const foundPost = getPostById(id);
    setPost(foundPost);
  }, [id, getPostById]);

   
  // A helper function to safely format the timestamp from Firestore
  const formatTimestamp = (timestamp) => {
    // Check if the timestamp exists and has the toDate method (it's a Firestore Timestamp)
    if (timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate().toLocaleString();
    }
    // Fallback for older data that might still be a string from localStorage
    if (timestamp && typeof timestamp === 'string') {
        return new Date(timestamp).toLocaleString();
    }
    // If all else fails, return a default string
    return 'Date not available';
  };
   

  if (!post) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography sx={{ color: 'white' }}>Loading post or post not found...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2, color: 'white' }}
      >
        Back to Blog
      </Button>
      <Card>
        {post.imageUrl && (
          <CardMedia
            component="img"
            height="400"
            image={post.imageUrl}
            alt={post.title}
          />
        )}
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            {post.title}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 3 }}>
            {/* Use the new helper function to display the date */}
            Posted on {formatTimestamp(post.timestamp)} by {post.authorEmail || 'Anonymous'}
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', fontSize: '1.1rem', lineHeight: 1.7 }}>
            {post.content}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}

export default BlogDetail;