 import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Rating,
    Button,
    CardActions, // 1. Import CardActions
} from '@mui/material';

// --- Services Data (No Changes Here) ---
const servicesData = [
    {
        title: 'Web Development',
        description: 'Custom websites tailored to your business needs.',
        imageUrl: '/webdevelopment.webp',
        rating: 4.8,
        priceText: 'Custom Quote',
    },
    {
        title: 'Mobile App Development',
        description: 'Android & iOS apps built for performance and scalability.',
        imageUrl: 'mobileApp1.jpg',
        rating: 4.9,
        priceText: 'Custom Quote',
    },
    {
        title: 'SEO (Search Engine Optimization)',
        description: 'Boost your visibility and drive organic traffic.',
        imageUrl: 'seoImage.jpg',
        rating: 4.7,
        price: 500,
    },
    {
        title: 'ERP Solutions',
        description: 'Streamline your operations with custom ERP systems.',
        imageUrl: 'ErpSolution.jpg',
        rating: 4.6,
        priceText: 'Custom Quote',
    },
    {
        title: 'UI/UX Design',
        description: 'Intuitive and modern interfaces for web & mobile.',
        imageUrl: 'uiImage.webp',
        rating: 4.9,
        price: 300,
    },
    {
        title: 'E-Commerce Development',
        description: 'Build scalable online stores with seamless checkout.',
        imageUrl: 'e.png',
        rating: 4.8,
        priceText: 'Custom Quote',
    },
    {
        title: 'Digital Marketing',
        description: 'Grow your brand through targeted online campaigns.',
        imageUrl: 'digitalMarketing.webp',
        rating: 4.5,
        price: 450,
    },
    {
        title: 'Cloud Services',
        description: 'Secure and scalable cloud integration & hosting.',
        imageUrl: 'cloudImage.png',
        rating: 4.7,
        price: 100,
    },
    {
        title: 'Software Maintenance & Support',
        description: 'Keep your systems updated and bug-free.',
        imageUrl: 'softwareSupport.jpg',
        rating: 5,
        price: 80,
    },
];

// Styles for the header text to ensure it's readable on both gradients
const headerTextStyles = (theme) => ({
    color: theme.palette.mode === 'light' ? '#1f2937' : 'white',
});

function Services() {
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
            <Container maxWidth="xl" sx={{ py: 6 }}>
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="h3" component="h1" gutterBottom sx={headerTextStyles}>
                        Our Services
                    </Typography>
                    <Typography variant="h6" sx={(theme) => ({ ...headerTextStyles(theme), opacity: 0.8 })}>
                        We offer a comprehensive suite of technology services to help your business grow.
                    </Typography>
                </Box>

                <Grid container spacing={4} justifyContent="center">
                    {servicesData.map((service, index) => (
                        <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: 2,
                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
                                    },
                                    bgcolor: 'background.paper',
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={service.imageUrl}
                                    alt={service.title}
                                    sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
                                />
                                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                    <Typography gutterBottom variant="h5" component="h2" color="text.primary">
                                        {service.title}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 1 }}>
                                        <Rating name="read-only" value={service.rating} precision={0.1} readOnly />
                                        <Typography variant="h6" component="p" color="primary.main">
                                            {service.price ? `$${service.price}` : service.priceText}
                                        </Typography>
                                    </Box>
                                    <Typography color="text.secondary" sx={{ mt: 1, flexGrow: 1 }}>
                                        {service.description}
                                    </Typography>
                                </CardContent>
                                {/* 
                                ======================================================================
                                == THE IMPROVEMENT: Wrap the Button in a <CardActions> component. ==
                                ======================================================================
                                */}
                                <CardActions>
                                    <Button 
                                        component={RouterLink} 
                                        to="/contact" 
                                        variant="contained" 
                                        color="primary" // Changed to primary for better contrast
                                        size="medium"
                                        fullWidth // Make the button span the full width of the card actions area
                                    >
                                        Get in Touch
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}

export default Services;