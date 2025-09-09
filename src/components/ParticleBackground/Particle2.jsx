// src/components/ParticleBackground/Particle2.jsx
import React from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const Particle2 = React.memo(() => {
  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  return (
    <Particles
      id="particles-login"
      init={particlesInit}
      options={{
        fullScreen: {
          enable: true,
          zIndex: -1, // behind everything
        },
        particles: {
          number: {
            value: 60,
            density: { enable: true, value_area: 800 },
          },
          color: { value: "#ffffff" },
          shape: { type: "circle" },
          opacity: { value: 0.5 },
          size: { value: 3, random: true },
          line_linked: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.4,
            width: 1,
          },
          move: {
            enable: true,
            speed: 2,
            direction: "none",
            out_mode: "out",
            bounce: false,
          },
        },
        interactivity: {
          events: {
            onhover: { enable: true, mode: "grab" },
            onclick: { enable: true, mode: "push" }, // ✅ keep click spawn effect
            resize: true,
          },
          modes: {
            grab: { distance: 140, line_linked: { opacity: 1 } },
            push: { particles_nb: 4 }, // ✅ unchanged
            repulse: { distance: 200, duration: 0.4 },
          },
        },
        retina_detect: true,
      }}
    />
  );
});

export default Particle2;
