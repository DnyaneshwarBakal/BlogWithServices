import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,  
  CardContent,
  IconButton,
  CardActions,
  Chip,
} from '@mui/material';

// --- Icons ---
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

// --- Team Data ---
const teamData = [
  {
    name: 'Dnyaneshwar Bakal',
    title: 'Founder & CEO',
    experience: '12+ Years',
    description: 'Leading our team with a vision for innovation and a passion for technology that drives client success.',
    imageUrl: 'mauli1.jpeg',  
    socials: { linkedin: '#', twitter: '#' },
  },
  {
    name: 'Vaibhav Sonwane',
    title: 'Backend Developer',
    experience: '5+ Years',
    description: 'A dedicated backend developer focused on building robust, scalable, and secure applications.',
    imageUrl: 'wBaba.jpeg',   
    socials: { linkedin: '#', github: '#' },
  },
  {
    name: 'Kunal Pandharkar',
    title: 'Full-Stack Developer',
    experience: '6+ Years',
    description: 'Designing and developing robust, scalable, and user-friendly web applications, delivering seamless front-end and back-end integration to meet and exceed client expectations.',
    imageUrl: 'kp4.jpeg',
    socials: { linkedin: '#', twitter: '#' },
  },
  {
    name: 'Sayaji Patil',
    title: 'Lead Frontend Developer',
    experience: '7+ Years',
    description: 'Bringing designs to life with pixel-perfect, responsive, and efficient code for a seamless user interface.',
    imageUrl: 'sonuMama.jpeg',
    socials: { linkedin: '#', github: '#' },
  },
  {
    name: 'Shital Sonwane',
    title: 'UI/UX Designer',
    experience: '8+ Years',
    description: 'Design is not just what it looks like; it’s how it works.” Crafting intuitive and beautiful user experiences.',
    //Ensuring projects are delivered on time, within budget, while exceeding client expectations.
    imageUrl: 'shital.jpg',
    socials: { linkedin: '#', twitter: '#' },
  },
  {
    name: 'Krishna Sonwane',
    title: 'Digital Marketing Specialist',
    experience: '4+ Years',
    description: 'Driving business growth through strategic online campaigns and data-driven insights.',
    imageUrl: 'krish.jpg',
    socials: { linkedin: '#', twitter: '#' },
  },
];


function Team() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Meet Our Team
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto' }}>
          The driving force behind our success. A group of passionate, dedicated, and skilled professionals committed to delivering excellence.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 4,
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
        }}
      >
        {teamData.map((member, index) => (
          <Grid item key={index} sx={{ display: 'flex' }}>
            <Card
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '16px',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: (theme) => theme.shadows[12],
                },
                bgcolor: 'background.paper',
                boxShadow: (theme) => theme.shadows[6],
              }}
            >
               
              <CardMedia
                component="img"
                height="250" // You can adjust this height
                image={member.imageUrl}
                alt={member.name}
              />
              
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', textAlign: 'center', p: 3 }}>
                
                <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                  {member.name}
                </Typography>
                <Typography variant="body1" color="primary.main" gutterBottom sx={{ fontWeight: '500' }}>
                  {member.title}
                </Typography>
                
                <Chip
                  icon={<WorkspacePremiumIcon />}
                  label={member.experience}
                  variant="outlined"
                  color="secondary"
                  size="small"
                  sx={{ mt: 1.5, mx: 'auto' }}
                />

                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, flexGrow: 1 }}>
                  {member.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                {member.socials.linkedin && ( <IconButton href={member.socials.linkedin} target="_blank"><LinkedInIcon /></IconButton> )}
                {member.socials.twitter && ( <IconButton href={member.socials.twitter} target="_blank"><TwitterIcon /></IconButton> )}
                {member.socials.github && ( <IconButton href={member.socials.github} target="_blank"><GitHubIcon /></IconButton> )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Box>
    </Container>
  );
}

export default Team;