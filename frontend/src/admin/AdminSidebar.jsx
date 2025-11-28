import React, { useState, useEffect } from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Divider, Collapse } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import InfoIcon from '@mui/icons-material/Info';
import MapIcon from '@mui/icons-material/Map';
import GavelIcon from '@mui/icons-material/Gavel';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CelebrationIcon from '@mui/icons-material/Celebration';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import LanguageIcon from '@mui/icons-material/Language';
import TourIcon from '@mui/icons-material/Tour';
import AssignmentIcon from '@mui/icons-material/Assignment'; // Icon for Takrar
import ListAltIcon from '@mui/icons-material/ListAlt';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import NatureIcon from '@mui/icons-material/Nature'; // For programs
import BusinessIcon from '@mui/icons-material/Business';
import SchoolIcon from '@mui/icons-material/School';
import SportsIcon from '@mui/icons-material/Sports';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import RecyclingIcon from '@mui/icons-material/Recycling';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import WaterIcon from '@mui/icons-material/Water';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import WorkIcon from '@mui/icons-material/Work';
import EventIcon from '@mui/icons-material/Event';
import StarIcon from '@mui/icons-material/Star';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import ArticleIcon from '@mui/icons-material/Article';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import HomeIcon from '@mui/icons-material/Home';
import ImageIcon from '@mui/icons-material/Image';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import ChatIcon from '@mui/icons-material/Chat';
import { logout } from '@/services/auth';

const AdminSidebar = ({ drawerWidth }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openGrampanchayat, setOpenGrampanchayat] = useState(true);
  const [openNirdeshika, setOpenNirdeshika] = useState(true);
  const [openPrograms, setOpenPrograms] = useState(true);
  const [openYojana, setOpenYojana] = useState(true);
  const [openHome, setOpenHome] = useState(true);
  const [openExtra, setOpenExtra] = useState(true);

  const handleGrampanchayatClick = () => {
    setOpenGrampanchayat(!openGrampanchayat);
  };

  const handleProgramsClick = () => {
    setOpenPrograms(!openPrograms);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };
  
  // Restore persisted open states
  useEffect(() => {
    const persisted = JSON.parse(localStorage.getItem('adminSidebarOpenStates') || '{}');
    if (typeof persisted.openGrampanchayat === 'boolean') setOpenGrampanchayat(persisted.openGrampanchayat);
    if (typeof persisted.openNirdeshika === 'boolean') setOpenNirdeshika(persisted.openNirdeshika);
    if (typeof persisted.openPrograms === 'boolean') setOpenPrograms(persisted.openPrograms);
    if (typeof persisted.openYojana === 'boolean') setOpenYojana(persisted.openYojana);
    if (typeof persisted.openHome === 'boolean') setOpenHome(persisted.openHome);
    if (typeof persisted.openExtra === 'boolean') setOpenExtra(persisted.openExtra);
  }, []);

  // Persist open states
  useEffect(() => {
    const state = { openGrampanchayat, openNirdeshika, openPrograms, openYojana, openHome, openExtra };
    localStorage.setItem('adminSidebarOpenStates', JSON.stringify(state));
  }, [openGrampanchayat, openNirdeshika, openPrograms, openYojana, openHome, openExtra]);

  const isActive = (path) => location.pathname.startsWith(path);
  
  const menuItems = [
    { text: 'माहिती', icon: <InfoIcon />, path: '/admin/manage/info' },
    { text: 'नकाशा', icon: <MapIcon />, path: '/admin/manage/map' },
    { text: 'सदस्य', icon: <PeopleIcon />, path: '/admin/manage/members' },
    { text: 'ग्रामसभेचे निर्णय', icon: <GavelIcon />, path: '/admin/manage/decisions' },
    { text: 'पुरस्कार', icon: <EmojiEventsIcon />, path: '/admin/manage/awards' },
    { text: 'सण/उत्सव', icon: <CelebrationIcon />, path: '/admin/manage/festivals' },
    { text: 'सुविधा', icon: <HomeWorkIcon />, path: '/admin/manage/facilities' },
    { text: 'ई-सेवा', icon: <LanguageIcon />, path: '/admin/manage/eseva' },
    { text: 'पर्यटन सथळे', icon: <TourIcon />, path: '/admin/manage/tourism' },
  ];

  const programItems = [
    { text: 'स्वच्छ गाव', icon: <NatureIcon />, path: '/admin/program/svachh-gaav' },
    { text: 'विकल-ते-पिकेल', icon: <BusinessIcon />, path: '/admin/program/vikel-te-pikel' },
    { text: 'माझे-कुटुंब माझी-जबाबदारी', icon: <FamilyRestroomIcon />, path: '/admin/program/maajhe-kutumb' },
    { text: 'तंटामुक्त गाव', icon: <GavelIcon />, path: '/admin/program/tantamukt-gaav' },
    { text: 'जलयुक्त शिवार', icon: <WaterIcon />, path: '/admin/program/jalyukt-shivar' },
    { text: 'तुषारगावड', icon: <WaterDropIcon />, path: '/admin/program/tushargaavad' },
    { text: 'रोती पूरक व्यवसाय', icon: <WorkIcon />, path: '/admin/program/roti-poorak' },
    { text: 'गादोली', icon: <EventIcon />, path: '/admin/program/gadoli' },
    { text: 'मतदार नोंदणी', icon: <HowToVoteIcon />, path: '/admin/program/matdaar-nondani' },
    { text: 'सर्व शिक्षा अभियान', icon: <SchoolIcon />, path: '/admin/program/sarva-shiksha' },
    { text: 'क्रीडा स्पर्धा', icon: <SportsIcon />, path: '/admin/program/kreeda-spardha' },
    { text: 'आरोग्य शिबिर', icon: <HealthAndSafetyIcon />, path: '/admin/program/aarogya-shibir' },
    { text: 'कचऱ्याचे नियोजन', icon: <RecyclingIcon />, path: '/admin/program/kachryache-niyojan' },
    { text: 'बायोगॅस निर्मिती', icon: <AgricultureIcon />, path: '/admin/program/biogas-nirmiti' },
    { text: 'सेंद्रिय खत निर्मिती', icon: <AgricultureIcon />, path: '/admin/program/sendriya-khat' },
  ];

  const yojanaItems = [
    { text: 'राज्य सरकार योजना', icon: <AssignmentIcon />, path: '/admin/yojana/state' },
    { text: 'केंद्र सरकार योजना', icon: <AssignmentIcon />, path: '/admin/yojana/central' },
  ];

  const homePageItems = [
    { text: 'नेव्हबार', icon: <DashboardIcon />, path: '/admin/home/navbar' },
    { text: 'वेलकम सेक्शन', icon: <HomeIcon />, path: '/admin/home/welcome' },
    { text: 'फोटो सेक्शन', icon: <ImageIcon />, path: '/admin/home/photos' },
    { text: 'राज्य गीत', icon: <MusicNoteIcon />, path: '/admin/home/rajya-geet' },
    { text: 'संदेश', icon: <ChatIcon />, path: '/admin/home/messages' },
    { text: 'सदस्य', icon: <PeopleIcon />, path: '/admin/home/members' },
    { text: 'ग्रामपंचायत माहिती', icon: <InfoIcon />, path: '/admin/home/info' },
    { text: 'डिजिटल घोषवाक्य', icon: <ArticleIcon />, path: '/admin/home/digital-slogans' },
    { text: 'शासकीय लोगो', icon: <LanguageIcon />, path: '/admin/home/gov-logos' },
    { text: 'फूटर', icon: <ArticleIcon />, path: '/admin/home/footer' },
  ];

  const extraItems = [
    { text: 'प्रगत शेतकरी', icon: <StarIcon />, path: '/admin/extra/pragat-shetkari' },
    { text: 'ई-शिक्षण', icon: <SchoolOutlinedIcon />, path: '/admin/extra/e-shikshan' },
    { text: 'बातम्या', icon: <ArticleIcon />, path: '/admin/extra/batmya' },
    { text: 'संपर्क', icon: <ContactMailIcon />, path: '/admin/extra/sampark' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', display: 'flex', flexDirection: 'column' },
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Admin Panel
        </Typography>
      </Toolbar>
      <Divider />
      <Box sx={{ overflow: 'auto', p: 0, flex: 1,
        ['& .MuiListItemButton']: { borderRadius: 1, mx: 1, my: 0.25 },
        ['& .MuiListItemButton:hover']: { backgroundColor: 'action.hover' },
        ['& .MuiListItemButton.Mui-selected']: { backgroundColor: 'action.selected' },
        ['& .MuiListItemIcon-root']: { minWidth: 36 },
      }}>
        <List>
          <ListItem disablePadding component={Link} to="/admin/panel">
            <ListItemButton selected={isActive('/admin/panel')}>
              <ListItemIcon><DashboardIcon /></ListItemIcon>
              <ListItemText primary="डॅशबोर्ड" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding component={Link} to="/admin/profile">
            <ListItemButton selected={isActive('/admin/profile')}>
              <ListItemIcon><AccountBalanceIcon /></ListItemIcon>
              <ListItemText primary="ग्रामपंचायत प्रोफाइल" />
            </ListItemButton>
          </ListItem>

          <ListItemButton onClick={handleGrampanchayatClick}>
            <ListItemIcon><DescriptionIcon /></ListItemIcon>
            <ListItemText primary="ग्रामपंचायत व्यवस्थापन" />
            {openGrampanchayat ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openGrampanchayat} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {menuItems.map((item) => (
                 <ListItem key={item.text} disablePadding component={Link} to={item.path}>
                    <ListItemButton sx={{ pl: 4 }} selected={isActive(item.path)}>
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.text} />
                    </ListItemButton>
                 </ListItem>
              ))}
            </List>
          </Collapse>

          {/* होम पेज Section */}
          <ListItemButton onClick={() => setOpenHome(!openHome)}>
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary="होम पेज" />
            {openHome ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openHome} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {homePageItems.map((item) => (
                <ListItem key={item.path} disablePadding component={Link} to={item.path}>
                  <ListItemButton sx={{ pl: 4 }} selected={isActive(item.path)}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>

          {/* निर्देशिका Section */}
          <ListItemButton onClick={() => setOpenNirdeshika(!openNirdeshika)}>
            <ListItemIcon><DescriptionIcon /></ListItemIcon>
            <ListItemText primary="निर्देशिका" />
            {openNirdeshika ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openNirdeshika} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem disablePadding component={Link} to="/admin/manage-nirdeshika/janaganana">
                <ListItemButton sx={{ pl: 4 }} selected={isActive('/admin/manage-nirdeshika/janaganana')}>
                  <ListItemIcon><ListAltIcon /></ListItemIcon>
                  <ListItemText primary="जनगणना" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding component={Link} to="/admin/manage-nirdeshika/contacts">
                <ListItemButton sx={{ pl: 4 }} selected={isActive('/admin/manage-nirdeshika/contacts')}>
                  <ListItemIcon><ContactPhoneIcon /></ListItemIcon>
                  <ListItemText primary="दूरध्वनी क्रमांक" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding component={Link} to="/admin/manage-nirdeshika/helpline">
                <ListItemButton sx={{ pl: 4 }} selected={isActive('/admin/manage-nirdeshika/helpline')}>
                  <ListItemIcon><HelpOutlineIcon /></ListItemIcon>
                  <ListItemText primary="हेल्पलाईन" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding component={Link} to="/admin/manage-nirdeshika/hospitals">
                <ListItemButton sx={{ pl: 4 }} selected={isActive('/admin/manage-nirdeshika/hospitals')}>
                  <ListItemIcon><LocalHospitalIcon /></ListItemIcon>
                  <ListItemText primary="रुग्णालय" />
                </ListItemButton>
              </ListItem>
            </List>
          </Collapse>

          {/* कार्यक्रम Section */}
          <ListItemButton onClick={handleProgramsClick}>
            <ListItemIcon><NatureIcon /></ListItemIcon>
            <ListItemText primary="कार्यक्रम व्यवस्थापन" />
            {openPrograms ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openPrograms} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {programItems.map((item) => (
                <ListItem key={item.text} disablePadding component={Link} to={item.path}>
                  <ListItemButton sx={{ pl: 4 }} selected={isActive(item.path)}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>

          {/* योजना Section */}
          <ListItemButton onClick={() => setOpenYojana(!openYojana)}>
            <ListItemIcon><AssignmentIcon /></ListItemIcon>
            <ListItemText primary="योजना" />
            {openYojana ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openYojana} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {yojanaItems.map((item) => (
                <ListItem key={item.text} disablePadding component={Link} to={item.path}>
                  <ListItemButton sx={{ pl: 4 }} selected={isActive(item.path)}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>

          {/* इतर Section */}
          <ListItemButton onClick={() => setOpenExtra(!openExtra)}>
            <ListItemIcon><DescriptionIcon /></ListItemIcon>
            <ListItemText primary="इतर" />
            {openExtra ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openExtra} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {extraItems.map((item) => (
                <ListItem key={item.text} disablePadding component={Link} to={item.path}>
                  <ListItemButton sx={{ pl: 4 }} selected={isActive(item.path)}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>
          
          {/* ✅ ADDED: New link for Complaint Management */}
          <ListItem disablePadding component={Link} to="/admin/manage/complaints">
            <ListItemButton selected={isActive('/admin/manage/complaints')}>
              <ListItemIcon><AssignmentIcon /></ListItemIcon>
              <ListItemText primary="तक्रार व्यवस्थापन" />
            </ListItemButton>
          </ListItem>

        </List>
      </Box>
      <Box sx={{}}
      >
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="लॉग आउट" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default AdminSidebar;
