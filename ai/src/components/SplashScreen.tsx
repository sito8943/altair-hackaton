import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

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
  }, [navigate]);

  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(animationFrame);
  }, []);

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
        background: "linear-gradient(135deg, #e9f5ff 0%, #f7fbff 70%)",
        color: "#042444",
        position: "relative",
        overflow: "hidden",
        "&::after": {
          content: '""',
          position: "absolute",
          width: { xs: 320, md: 520 },
          height: { xs: 320, md: 520 },
          borderRadius: "50%",
          background: "rgba(15,76,129,0.15)",
          top: { xs: "-160px", md: "-180px" },
          right: { xs: "-100px", md: "-120px" },
        },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{ position: "relative", zIndex: 1, py: { xs: 4, md: 6 }, px: { xs: 3, md: 4 } }}
      >
        <Stack spacing={8}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(-20px)",
              transition: "all 600ms ease",
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                backgroundColor: "#0f4c81",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
              }}
            >
              HR
            </Box>
            <Typography variant="h6" fontWeight={700}>
              Health Risk Command Center
            </Typography>
          </Stack>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={6}
            alignItems="center"
            sx={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(30px)",
              transition: "all 700ms ease 120ms",
            }}
          >
            <Stack spacing={3} flex={1} textAlign={{ xs: "center", md: "left" }}>
              <Typography
                variant="overline"
                sx={{ letterSpacing: 4, color: "#00a7ff" }}
              >
                Predict & Prevent
              </Typography>
              <Typography variant="h3" fontWeight={700} lineHeight={1.2}>
                Proactive intelligence you can trust,
                <Typography component="span" color="primary">
                  {" "}
                  when you need it most.
                </Typography>
              </Typography>
              <Typography variant="body1" color="text.secondary">
                We pre-load our analytics engine and longitudinal monitoring
                modules so your care team can act before risk escalates. Begin
                the intake whenever you are ready—your progress is automatically
                saved.
              </Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent={{ xs: "center", md: "flex-start" }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleBegin}
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  Launch Intake
                </Button>
              </Stack>
            </Stack>
            <Box
              flex={1}
              sx={{
                width: "100%",
                maxWidth: 480,
                position: "relative",
                borderRadius: 6,
                overflow: "hidden",
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateX(0)" : "translateX(40px)",
                transition: "all 700ms ease 220ms",
                mx: { xs: "auto", md: 0 },
                '&::after': {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(135deg, rgba(233,245,255,0.2), rgba(15,76,129,0.35))",
                },
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1511174511562-5f7f18b874f8?auto=format&fit=crop&w=1000&q=80"
                alt="Clinician ready to assist"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  filter: "saturate(1.05) brightness(1.05)",
                }}
              />
            </Box>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default SplashScreen;
