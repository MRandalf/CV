document.addEventListener("DOMContentLoaded", () => {

  /* ---------- 1. Efecto de escritura (nombre y cargo) ---------- */
  function typeText(el, speed = 70, delay = 0) {
    const text = el.dataset.text;
    let i = 0;
    setTimeout(() => {
      const timer = setInterval(() => {
        el.textContent = text.slice(0, ++i);
        if (i >= text.length) {
          clearInterval(timer);
          el.classList.add("done");
        }
      }, speed);
    }, delay);
  }
  typeText(document.getElementById("name"), 90, 300);
  typeText(document.getElementById("role"), 50, 1400);

  /* ---------- 2. Animación al hacer scroll ---------- */
  const reveals = document.querySelectorAll(".reveal");

  const animateBar = (bar) => {
    const level = +bar.dataset.level;
    const fill = bar.querySelector(".track i");
    const label = bar.querySelector("em");
    fill.style.width = level + "%";
    if (label) {
      let n = 0;
      const step = Math.max(1, Math.round(level / 60));
      const t = setInterval(() => {
        n = Math.min(level, n + step);
        label.textContent = n + "%";
        if (n >= level) clearInterval(t);
      }, 20);
    }
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      entry.target.querySelectorAll(".bar").forEach(animateBar);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  reveals.forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 0.1 + "s";
    observer.observe(el);
  });

  /* ---------- 3. Idiomas: cuadros clicables ---------- */
  document.querySelectorAll(".lang").forEach((lang) => {
    const box = lang.querySelector(".squares");
    let level = +lang.dataset.level;

    const render = () => {
      box.innerHTML = "";
      for (let i = 1; i <= 5; i++) {
        const sq = document.createElement("div");
        sq.className = "sq" + (i <= level ? " on" : "");
        sq.title = `Nivel ${i}/5`;
        sq.addEventListener("click", () => {
          level = (i === level) ? i - 1 : i;
          render();
        });
        box.appendChild(sq);
      }
    };
    render();
  });

  /* ---------- 4. Selector de color principal ---------- */
  const picker = document.getElementById("accentPicker");
  const darken = (hex, amt = 0.35) => {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.round((n >> 16) * (1 - amt));
    const g = Math.round(((n >> 8) & 255) * (1 - amt));
    const b = Math.round((n & 255) * (1 - amt));
    return `rgb(${r}, ${g}, ${b})`;
  };
  const applyAccent = (color) => {
    document.documentElement.style.setProperty("--accent", color);
    document.documentElement.style.setProperty("--accent-dark", darken(color));
    try { localStorage.setItem("cv-accent", color); } catch (e) {}
  };
  picker.addEventListener("input", (e) => applyAccent(e.target.value));

  /* ---------- 5. Modo oscuro ---------- */
  const themeBtn = document.getElementById("themeToggle");
  const setTheme = (dark) => {
    document.body.classList.toggle("dark", dark);
    themeBtn.textContent = dark ? "☀️" : "🌙";
    try { localStorage.setItem("cv-dark", dark ? "1" : "0"); } catch (e) {}
  };
  themeBtn.addEventListener("click", () => setTheme(!document.body.classList.contains("dark")));

  // Recuperar preferencias guardadas
  try {
    const savedColor = localStorage.getItem("cv-accent");
    if (savedColor) { picker.value = savedColor; applyAccent(savedColor); }
    if (localStorage.getItem("cv-dark") === "1") setTheme(true);
  } catch (e) {}

  /* ---------- 6. Imprimir / PDF ---------- */
  document.getElementById("printBtn").addEventListener("click", () => window.print());

  /* ---------- 7. Copiar correo ---------- */
  const toast = document.getElementById("toast");
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 1800);
  };
  document.getElementById("copyMail").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("info@loremipsum.com");
      showToast("¡Correo copiado!");
    } catch (e) {
      showToast("No se pudo copiar");
    }
  });

  /* ---------- 8. Efecto 3D suave en la hoja al mover el mouse ---------- */
  const cv = document.getElementById("cv");
  if (window.matchMedia("(hover: hover) and (min-width: 900px)").matches) {
    document.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      cv.style.transform = `perspective(1400px) rotateY(${x * 1.5}deg) rotateX(${-y * 1.5}deg)`;
    });
    document.addEventListener("mouseleave", () => {
      cv.style.transform = "none";
    });
    cv.style.transition = "transform .15s ease-out, background .4s";
  }
});
