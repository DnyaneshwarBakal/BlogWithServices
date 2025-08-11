import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Paper,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useLoginModal } from '../context/LoginModalContext';

// --- Icons ---
import BusinessIcon from '@mui/icons-material/Business';
import CodeIcon from '@mui/icons-material/Code';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BuildIcon from '@mui/icons-material/Build';
import CampaignIcon from '@mui/icons-material/Campaign';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import GavelIcon from '@mui/icons-material/Gavel';
import HandshakeIcon from '@mui/icons-material/Handshake';
import GroupsIcon from '@mui/icons-material/Groups';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PublicIcon from '@mui/icons-material/Public';
import EmailIcon from '@mui/icons-material/Email';

// --- Data ---
const services = [
  { icon: <CodeIcon color="primary" />, name: 'Web Development' },
  { icon: <PhoneAndroidIcon color="primary" />, name: 'Mobile App Development' },
  { icon: <DesignServicesIcon color="primary" />, name: 'UI/UX Design' },
  { icon: <CloudQueueIcon color="primary" />, name: 'Cloud Services' },
  { icon: <SettingsApplicationsIcon color="primary" />, name: 'CRM & ERP Support' },
  { icon: <ShoppingCartIcon color="primary" />, name: 'E-Commerce Solutions' },
  { icon: <BuildIcon color="primary" />, name: 'Custom Software Development' },
  { icon: <CampaignIcon color="primary" />, name: 'Digital Marketing' },
];

const coreValues = [
  { icon: <EmojiObjectsIcon sx={{ color: '#FFC107' }} />, primary: 'Innovation', secondary: 'Continuously evolving to deliver modern solutions.' },
  { icon: <VerifiedUserIcon sx={{ color: '#4CAF50' }} />, primary: 'Quality', secondary: 'Committed to excellence in every project.' },
  { icon: <GavelIcon sx={{ color: '#9E9E9E' }} />, primary: 'Integrity', secondary: 'Building trust through honesty and transparency.' },
  { icon: <HandshakeIcon sx={{ color: '#F44336' }} />, primary: 'Customer Success', secondary: 'Putting clients at the heart of everything we do.' },
  { icon: <GroupsIcon sx={{ color: '#2196F3' }} />, primary: 'Collaboration', secondary: 'Working together to achieve shared goals.' },
  { icon: <AutorenewIcon sx={{ color: '#FF5722' }} />, primary: 'Adaptability', secondary: 'Staying flexible to meet changing business needs.' },
];

const whyChooseUs = [
    { icon: <WorkspacePremiumIcon color="action" />, text: 'Skilled professionals with deep technical and creative knowledge.' },
    { icon: <CheckCircleOutlineIcon color="action" />, text: 'Focused on delivering measurable results for our clients.' },
    { icon: <PublicIcon color="action" />, text: 'Successfully delivering diverse projects and serving businesses across multiple countries.' }
];

function About() {
  const { currentUser } = useAuth();
  const { openLoginModal } = useLoginModal();
  const navigate = useNavigate();

  const handleContactClick = () => {
    if (currentUser) {
      navigate('/contact');
    } else {
      openLoginModal();
    }
  };

  const Section = ({ title, children }) => (
    <Box sx={{ my: 6 }}>
      <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
        {title}
      </Typography>
      <Divider sx={{ mb: 4, width: '100px', mx: 'auto' }} />
      {children}
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          About Us
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '750px', mx: 'auto' }}>
          Founded in 2023, we are a Pune-based technology solutions company. We empower businesses with innovative, scalable, and reliable digital solutions that drive growth, efficiency, and customer satisfaction.
        </Typography>
      </Box>

      {/* Vision & Mission */}
      <Grid container spacing={4} sx={{ mb: 6 }} alignItems="stretch">
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, height: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <VisibilityIcon color="primary" sx={{ fontSize: 40, mb: 2, alignSelf: 'center' }} />
            <Typography variant="h5" component="h2" gutterBottom>Our Vision</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic', mb: 2 }}>
              "To be the most trusted and innovative technology partner, empowering businesses worldwide to achieve lasting success through creativity, excellence, and digital transformation."
            </Typography>
            <Typography variant="body2" color="text.secondary">
              We envision a future where technology is not a challenge but an enabler—where every business, regardless of size, can harness the power of innovation to grow, compete, and make a positive impact.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, height: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <RocketLaunchIcon color="primary" sx={{ fontSize: 40, mb: 2, alignSelf: 'center' }} />
            <Typography variant="h5" component="h2" gutterBottom>Our Mission</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic', mb: 2 }}>
             "To deliver exceptional, secure, and scalable IT solutions that empower businesses to thrive, while building lasting partnerships founded on trust, transparency, and measurable results."
            </Typography>
            <Typography variant="body2" color="text.secondary">
              We aim to bridge the gap between technology and business growth by providing end-to-end digital solutions that are innovative, reliable, and tailored to our clients’ unique needs.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Our Services */}
      <Section title="Our Services">
        <Grid container spacing={3}>
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ textAlign: 'center', p: 2, height: '100%' }} elevation={2}>
                <ListItemIcon sx={{ justifyContent: 'center', fontSize: '2.5rem' }}>{service.icon}</ListItemIcon>
                <Typography variant="h6" component="div">{service.name}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Section>
      
      {/* Core Values */}
      <Section title="Our Core Values">
        <Grid container spacing={3}>
          {coreValues.map((value, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', height: '100%' }}>
                <ListItemIcon sx={{ mr: 2, fontSize: '2.5rem' }}>{value.icon}</ListItemIcon>
                <Box>
                  <Typography variant="h6">{value.primary}</Typography>
                  <Typography variant="body2" color="text.secondary">{value.secondary}</Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Section>

      {/* Why Choose Us */}
      <Section title="Why Choose Us?">
        <List>
          {whyChooseUs.map((item, index) => (
            <ListItem key={index}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Section>

      {/* Call to Action */}
      <Paper elevation={4} sx={{ p: 4, textAlign: 'center', bgcolor: 'primary.main', color: 'primary.contrastText', borderRadius: 2 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Let’s Build Something Great Together
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Your business deserves the right technology partner. Let’s collaborate to bring your vision to life.
        </Typography>
        <Button onClick={handleContactClick} variant="contained" color="secondary" size="large" startIcon={<EmailIcon />}>
          Contact Us
        </Button>
      </Paper>
    </Container>
  );
}

export default About;