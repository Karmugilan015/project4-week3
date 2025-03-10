import { useEffect, useState, useCallback, useMemo } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "./auth.css";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerAPI } from "../../utils/ApiRequest";
import axios from "axios";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });

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
      const { data } = await axios.post(registerAPI, values);
      if (data.success) {
        delete data.user.password;
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success(data.message, toastOptions);
        navigate("/");
      } else {
        toast.error(data.message, toastOptions);
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.", toastOptions);
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
        <Row>
          <h1 className="text-center">
            <AccountBalanceWalletIcon sx={{ fontSize: 40, color: "white" }} />
          </h1>
          <h1 className="text-center text-white">Welcome to Expense Management System</h1>
          <Col md={{ span: 6, offset: 3 }}>
            <h2 className="text-white text-center mt-5">Registration</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicName" className="mt-3">
                <Form.Label className="text-white">Name</Form.Label>
                <Form.Control type="text" name="name" placeholder="Full name" value={values.name} onChange={handleChange} />
              </Form.Group>
              <Form.Group controlId="formBasicEmail" className="mt-3">
                <Form.Label className="text-white">Email address</Form.Label>
                <Form.Control type="email" name="email" placeholder="Enter email" value={values.email} onChange={handleChange} />
              </Form.Group>
              <Form.Group controlId="formBasicPassword" className="mt-3">
                <Form.Label className="text-white">Password</Form.Label>
                <Form.Control type="password" name="password" placeholder="Password" value={values.password} onChange={handleChange} />
              </Form.Group>

              <div className="login-actions">
                <Link to="/forgotPassword" className="text-white lnk">
                  Forgot Password?
                </Link>

                <Button type="submit" className="btnStyle mt-3" disabled={loading}>
                  {loading ? "Registering..." : "Signup"}
                </Button>

                <p className="mt-3 text-muted">
                  Already have an account? <Link to="/login" className="text-white lnk">Login</Link>
                </p>
              </div>
            </Form>
          </Col>
        </Row>
        <ToastContainer />
      </Container>
    </div>
  );
};

export default Register;
