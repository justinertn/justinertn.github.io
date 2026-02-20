// ------------------------
// Helpers
// ------------------------
const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

// ------------------------
// DOM READY
// ------------------------
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  const video = document.querySelector(".intro-video");
  const projetsLink = document.querySelector('nav a[href="#projets"]');
  const target = document.getElementById("typewriter");

// ------------------------
// HEADER (shrink + logo visible au scroll)
// ------------------------
const updateHeader = () => {
  if (!header) return;

  const path = window.location.pathname;
  const isHome =
    path === "/" ||
    path === "" ||
    path.endsWith("/index.html") ||
    path.endsWith("index.html");

  // shrink (comme avant)
  header.classList.toggle("shrink", window.scrollY > 50);

  // logo :
  // - accueil : apparaît seulement après scroll
  // - pages projets / à propos : visible direct
  if (isHome) {
    header.classList.toggle("show-logo", window.scrollY > 10);
  } else {
    header.classList.add("show-logo");
  }
};

  // ------------------------
  // INTRO VIDEO FADE-IN
  // ------------------------
  if (video) {
    const show = () => video.classList.add("visible");

    // cas normal
    video.addEventListener("canplaythrough", show);

    // fallback : si l'événement ne part pas, on affiche quand même
    video.addEventListener("loadeddata", show);

    // dernier filet de sécurité
    setTimeout(show, 600);
  }

  // ------------------------
  // SCROLL FLUIDE VERS "Projets"
  // ------------------------
  if (projetsLink) {
    const isHome =
      window.location.pathname.endsWith("index.html") ||
      window.location.pathname === "/" ||
      window.location.pathname === "";

    projetsLink.addEventListener("click", (e) => {
      e.preventDefault();

      if (isHome) {
        const section = document.getElementById("projets");
        if (section) section.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = "/index.html#projets";
      }
    });
  }

  // ------------------------
  // SCROLL PARALLAX COLONNES (comme avant)
  // ------------------------
  const onParallaxScroll = () => {
    if (isMobile()) return;

    const scrollY = window.scrollY;
    const leftCol = document.querySelector(".column-left");
    const rightCol = document.querySelector(".column-right");

    if (leftCol && rightCol) {
      leftCol.style.transform = `translateY(${scrollY * 0.2}px)`;
      rightCol.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
  };

// ------------------------
// HERO fade-out (descente) + réapparition en haut (sans saccade)
// ------------------------
(() => {
  const hero = document.querySelector(".hero-video");
  if (!hero) return;

  let hidden = false;
  let touchStartY = null;

  const hide = () => {
    if (hidden) return;
    hidden = true;
    document.body.classList.add("scrolled");
  };

  const showIfTop = () => {
    // Si on revient tout en haut, on réaffiche
    if (window.scrollY <= 5) {
      hidden = false;
      document.body.classList.remove("scrolled");
    }
  };

  const onWheel = (e) => {
    if (e.deltaY > 0) hide();   // descend
    else showIfTop();           // remonte -> on check si on est en haut
  };

  const onTouchStart = (e) => {
    touchStartY = e.touches && e.touches[0] ? e.touches[0].clientY : null;
  };

  const onTouchMove = (e) => {
    if (touchStartY === null) return;
    const y = e.touches && e.touches[0] ? e.touches[0].clientY : null;
    if (y === null) return;

    // swipe vers le haut => on descend la page
    if (touchStartY - y > 2) hide();
    // swipe vers le bas => on remonte, donc si on arrive en haut on réaffiche
    if (y - touchStartY > 2) showIfTop();
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " " || e.key === "End") hide();
    if (e.key === "ArrowUp" || e.key === "PageUp" || e.key === "Home") showIfTop();
  };

  window.addEventListener("wheel", onWheel, { passive: true });
  window.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchmove", onTouchMove, { passive: true });
  window.addEventListener("keydown", onKeyDown);

  // sécurité : si on recharge en haut, le hero doit être visible
  showIfTop();
})();

// ------------------------
// Scroll listener unique
// ------------------------
window.addEventListener(
  "scroll",
  () => {
    updateHeader();
    onParallaxScroll();
  },
  { passive: true }
);
});

// ------------------------
// SCROLL AUTOMATIQUE SI HASH = #projets
// ------------------------
window.addEventListener("load", () => {
  if (window.location.hash === "#projets") {
    const section = document.querySelector("#projets");
    if (section) {
      setTimeout(() => {
        section.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }
});