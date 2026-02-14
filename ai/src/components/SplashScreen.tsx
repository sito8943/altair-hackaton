import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { brandColors, brandGradients, brandShadows } from "../theme";

const SplashScreen = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const acknowledged =
      window.localStorage.getItem("health-risk-intro-ack") === "true";
    if (acknowledged) {
      navigate("/intake/demographics", { replace: true });
    }
    setMounted(true);
  }, [navigate]);

  const handleBegin = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("health-risk-intro-ack", "true");
    }
    navigate("/intake/demographics");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background:
          "radial-gradient(circle at 70% 20%, #f0f7ff 0%, #e9f1f9 100%)",
        color: "#1a3353",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: brandGradients.halo,
          filter: "blur(80px)",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 4 },
            borderRadius: 8,
            background: "none",
            backgroundColor: "none",
            backdropFilter: "blur(20px)",
            border: "none",
            boxShadow: "none",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(50px)",
            transition: "all 700ms ease",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={8}
            alignItems="center"
          >
            <Stack
              spacing={4}
              flex={1.2}
              sx={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(30px)",
                transition: "all 700ms ease 120ms",
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    bgcolor: brandColors.primary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: brandShadows.emblem,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ color: "white", fontWeight: 800 }}
                  >
                    HR
                  </Typography>
                </Box>
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  sx={{ letterSpacing: 0.5, color: brandColors.primary }}
                >
                  Health Risk Command Center
                </Typography>
              </Stack>

              <Stack spacing={2}>
                <Typography
                  variant="overline"
                  sx={{
                    letterSpacing: 3,
                    color: brandColors.accent,
                    fontWeight: 700,
                  }}
                >
                  Predict & Prevent
                </Typography>
                <Typography
                  variant="h2"
                  fontWeight={800}
                  sx={{
                    lineHeight: 1.1,
                    fontSize: { xs: "2.5rem", md: "3.5rem" },
                    color: "#042444",
                  }}
                >
                  Proactive intelligence you can trust,
                  <Box
                    component="span"
                    sx={{ color: brandColors.accent, display: "block" }}
                  >
                    when you need it most.
                  </Box>
                </Typography>
              </Stack>

              <Divider
                sx={{
                  width: "60px",
                  borderBottomWidth: 4,
                  borderColor: brandColors.accent,
                  borderRadius: 2,
                }}
              />

              <Typography
                variant="body1"
                sx={{
                  color: "#546e7a",
                  fontSize: "1.1rem",
                  lineHeight: 1.6,
                  maxWidth: 500,
                }}
              >
                We pre-load our analytics engine and longitudinal monitoring
                modules so your care team can act before risk escalates.
              </Typography>

              <Button
                variant="contained"
                size="large"
                onClick={handleBegin}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  py: 2,
                  px: 4,
                  borderRadius: 3,
                  fontSize: "1.1rem",
                  textTransform: "none",
                  fontWeight: 700,
                  backgroundColor: brandColors.primary,
                  boxShadow: brandShadows.cta,
                  "&:hover": { backgroundColor: brandColors.primaryDark },
                  alignSelf: "flex-start",
                }}
              >
                Launch Intake
              </Button>
            </Stack>

            <Box
              flex={0.8}
              sx={{
                position: "relative",
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
                alignItems: "center",
                animation: "float 6s ease-in-out infinite",
                /* "@keyframes float": {
                  "0%, 100%": { transform: "translateY(0)" },
                  "50%": { transform: "translateY(-20px)" },
                }, */
                opacity: mounted ? 1 : 0,
                transition: "opacity 800ms ease 200ms",
              }}
            >
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80"
                alt="Medical Intelligence"
                sx={{
                  width: "100%",
                  height: "auto",
                  filter: "drop-shadow(0 30px 50px rgba(15,76,129,0.15))",
                }}
              />
            </Box>
          </Stack>
        </Paper>

        <Typography
          variant="caption"
          sx={{
            mt: 4,
            display: "block",
            textAlign: "center",
            color: "#94a3b8",
          }}
        >
          Your progress is automatically saved. Clinical Intake System v2.4
        </Typography>
      </Container>
    </Box>
  );
};

export default SplashScreen;
