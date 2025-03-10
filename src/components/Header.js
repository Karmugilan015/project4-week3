import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import "./style.css";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
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
        color: { value: "#fff" },
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
    <>
      <div className="particle-container">
        <Particles id="tsparticles" init={particlesInit} options={particleOptions} />
      </div>

      <Navbar className="navbarCSS" collapseOnSelect expand="lg">
        <Navbar.Brand href="/" className="text-white navTitle">
          Personal Finance Manager
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          className="custom-toggler"
        />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav>
            {user ? (
              <Button variant="primary" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Button variant="primary" onClick={() => navigate("/login")}>
                Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default Header;
