import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, Avatar } from "@mui/material";
import { db } from '@/services/dataStore';
import { doc, getDoc } from "@/services/dataStore";

const RajyaGeetSection = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const ref = doc(db, 'home', 'rajjyageet');
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setData(snap.data());
        } else {
          setData(null);
        }
      } catch (e) {
        console.error('Error fetching rajyageet', e);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toYouTubeEmbed = (url) => {
    if (!url) return '';
    try {
      if (url.includes('/embed/')) return url;
      const short = url.match(/youtu\.be\/([\w-]{11})/);
      if (short) return `https://www.youtube.com/embed/${short[1]}`;
      const watch = url.match(/[?&]v=([\w-]{11})/);
      if (watch) return `https://www.youtube.com/embed/${watch[1]}`;
      return url;
    } catch {
      return url;
    }
  };

  return (
    <div style={{ padding: "40px 20px" }}>
      {/* Heading */}
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: "bold",
          textAlign: { xs: "center", md: "center" }, // center on mobile, left on desktop
          mb: 4
        }}
      >
        राज्य गीत
      </Typography>

      <Grid container spacing={4} justifyContent="center" alignItems="center">
        {/* Left side - YouTube video */}
        <Grid item xs={12} md={6}>
          <div style={{ position: "relative", paddingTop: "56.25%" /* 16:9 ratio */ }}>
            {loading ? (
              <div style={{ position: "absolute", inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body2">लोड होत आहे...</Typography>
              </div>
            ) : data ? (
              <iframe
                src={toYouTubeEmbed(data.videoUrl || '')}
                title="Rajya Geet"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%"
                }}
              ></iframe>
            ) : (
              <div style={{ position: "absolute", inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body2">डेटा उपलब्ध नाही</Typography>
              </div>
            )}
          </div>
        </Grid>

        {/* Right side - Quote */}
        <Grid item xs={12} md={6}>
          <Card elevation={4} sx={{ p: 2 }}>
            <CardContent>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "15px",
                  flexDirection: { xs: "column", sm: "row" }, // avatar above text on mobile
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                <Avatar
                  src={data?.avatar || "/tukdoji.jpeg"}
                  alt="Rashtrasant Tukdoji Maharaj"
                  sx={{ width: 60, height: 60, marginRight: { xs: 0, sm: 2 }, mb: { xs: 1, sm: 0 } }}
                />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold" }}
                >
                  {loading ? '...' : (data?.name || 'राष्ट्रसंत तुकडोजी महाराज')}
                </Typography>
              </div>

              <Typography
                variant="body1"
                sx={{ fontStyle: "italic", textAlign: { xs: "center", md: "left" }, whiteSpace: 'pre-wrap' }}
              >
                {loading ? '...' : (data?.quote || '“ऐसें गाव होतां आदर्शपूर्ण \nशहाराइनीहि नंदनवन \nसर्वां करील आकर्षण \nसुंदर जीवन तुकड्या म्हणे...”')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default RajyaGeetSection;
