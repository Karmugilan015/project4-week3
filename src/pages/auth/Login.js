import { useEffect, useState, useCallback, useMemo } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginAPI } from "../../utils/ApiRequest";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({ email: "", password: "" });

  useEffect(() => {
    if (localStorage.getItem("user")) navigate("/");
  }, [navigate]);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const { data } = await axios.post(loginAPI, values);
      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success(data.message, toastOptions);
        navigate("/");
      } else {
        toast.error(data.message, toastOptions);
      }
    } catch (error) {
      toast.error("Login failed. Please try again.", toastOptions);
    } finally {
      setLoading(false);
    }
  };

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particleOptions = useMemo(
    () => ({
      background: { color: { value: "#000" } },
      fpsLimit: 60,
      particles: {
        number: { value: 200, density: { enable: true, value_area: 800 } },
        color: { value: "#ffcc00" },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: { enable: true, minimumValue: 1 } },
        move: { enable: true, speed: 2 },
        life: {
          duration: { sync: false, value: 3 },
          delay: { random: { enable: true, minimumValue: 0.5 }, value: 1 },
        },
      },
      detectRetina: true,
    }),
    []
  );

  return (
    <div className="particle-container">
      <Particles id="tsparticles" init={particlesInit} options={particleOptions} />

      <Container className="mt-5 form-container">
        {/* Add your form elements here */}
      </Container>
      </div>
    );
  };
  
  export default Login;