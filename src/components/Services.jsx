import React from 'react';
import { useNavigate } from 'react-router-dom'; 
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
    CardActions,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useLoginModal } from '../context/LoginModalContext'; 

// --- Services Data (No Changes Here) ---
const servicesData = [
    {
        title: 'Web Development',
        description: 'Custom websites tailored to your business needs.',
        imageUrl: '/webdevelopment.webp',
        rating: 4.8,
        price: '20,000',
    },
    {
        title: 'Mobile App Development',
        description: 'Android & iOS apps built for performance and scalability.',
        imageUrl: 'mobileApp1.jpg',
        rating: 4.9,
        price: '35,000',
    },
    {
        title: 'SEO (Search Engine Optimization)',
        description: 'Boost your visibility and drive organic traffic.',
        imageUrl: 'seoImage.jpg',
        rating: 4.7,
        price: '10,000',
    },
    {
        title: 'ERP Solutions',
        description: 'Streamline your operations with custom ERP systems.',
        imageUrl: 'ErpSolution.jpg',
        rating: 4.6,
        price: '15,000',
    },
    {
        title: 'UI/UX Design',
        description: 'Intuitive and modern interfaces for web & mobile.',
        imageUrl: 'uiImage.webp',
        rating: 4.9,
        price: '3,000',
    },
    {
        title: 'E-Commerce Development',
        description: 'Build scalable online stores with seamless checkout.',
        imageUrl: 'e.png',
        rating: 4.8,
        price: '25,000',
    },
    {
        title: 'Digital Marketing',
        description: 'Grow your brand through targeted online campaigns.',
        imageUrl: 'digitalMarketing.webp',
        rating: 4.5,
        price: '7,000',
    },
    {
        title: 'Cloud Services',
        description: 'Secure and scalable cloud integration & hosting.',
        imageUrl: 'cloudImage.png',
        rating: 4.7,
        price: '12,000',
    },
    {
        title: 'Software Maintenance & Support',
        description: 'Keep your systems updated and bug-free.',
        imageUrl: 'softwareSupport.jpg',
        rating: 5,
        price: '12,500',
    },
];

const headerTextStyles = (theme) => ({
    color: theme.palette.mode === 'light' ? '#1f2937' : 'white',
});

function Services() {
    // --- ADD HOOKS ---
    const { currentUser } = useAuth();
    const { openLoginModal } = useLoginModal();
    const navigate = useNavigate();

    // --- ADD HANDLER FUNCTION ---
    const handleGetInTouch = () => {
        if (currentUser) {
            navigate('/contact');
        } else {
            openLoginModal();
        }
    };

    return (
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
                    <Grid item key={index} xs={12} sm={6} md={4} lg={4}>
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
                                        {service.price ? `₹${service.price}` : service.priceText}
                                    </Typography>
                                </Box>
                                <Typography color="text.secondary" sx={{ mt: 1, flexGrow: 1 }}>
                                    {service.description}
                                </Typography>
                            </CardContent>
                           
                            <CardActions>
                                {/* --- UPDATE BUTTON --- */}
                                <Button 
                                    onClick={handleGetInTouch} // Use onClick handler
                                    variant="contained" 
                                    color="primary"
                                    size="medium"
                                    fullWidth
                                >
                                    Get in Touch
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default Services;