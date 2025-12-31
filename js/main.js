(() => {
    const body = document.body;
    const root = document.documentElement;
  
    // ---------- Visual Viewport height calculation ----------
    function updateViewportHeight() {
      if (window.visualViewport) {
        const vh = window.visualViewport.height;
        root.style.setProperty('--viewport-height', `${vh}px`);
      } else {
        // Fallback for browsers that don't support visualViewport
        root.style.setProperty('--viewport-height', `${window.innerHeight}px`);
      }
    }
  
    // Update on load
    updateViewportHeight();
  
    // Update on visualViewport resize (handles mobile keyboard, etc.)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateViewportHeight);
      window.visualViewport.addEventListener('scroll', updateViewportHeight);
    }
  
    // Fallback for window resize
    window.addEventListener('resize', updateViewportHeight);
  
    // ---------- Active nav highlight ----------
    const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
    const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  
    navLinks.forEach(a => {
      const href = (a.getAttribute("href") || "").toLowerCase();
      const isIndex = (path === "" || path === "index.html") && (href === "index.html");
      const isMatch = href === path || isIndex;
      if (isMatch) {
        a.classList.add("active");
        a.setAttribute("aria-current", "page");
      }
    });
  
    // ---------- Mobile hamburger menu ----------
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.getElementById("site-nav");
  
    function setNavOpen(open) {
      body.classList.toggle("nav-open", open);
      if (toggle) toggle.setAttribute("aria-expanded", String(open));
    }
  
    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const open = !body.classList.contains("nav-open");
        setNavOpen(open);
      });
  
      // close when click a link
      nav.addEventListener("click", (e) => {
        const target = e.target;
        if (target && target.tagName === "A") setNavOpen(false);
      });
  
      // close on ESC
      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") setNavOpen(false);
      });
  
      // close on resize back to desktop
      window.addEventListener("resize", () => {
        if (window.innerWidth > 900) setNavOpen(false);
      });
    }
  
    // ---------- Image fallback (keep <img src="assets/..."> requirement) ----------
    const imgs = Array.from(document.querySelectorAll("img"));
    imgs.forEach(img => {
      img.addEventListener("error", () => {
        const frame = img.closest(".media");
        if (frame) frame.classList.add("fallback");
        img.style.display = "none";
      });
    });
  
    // ---------- Anchor smooth scroll enhancement (optional offset safety) ----------
    // If user clicks a hash link, browser scroll-behavior + scroll-margin-top handles it.
    // This is just extra safety for programmatic hash.
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) el.classList.add("scroll-target");
    }
  
    // ---------- Contact form validation ----------
    const form = document.querySelector("form[data-validate='contact']");
    if (form) {
      const status = document.querySelector(".form-status");

      form.addEventListener("submit", (e) => {
        e.preventDefault();

        // native validation
        if (!form.checkValidity()) {
          form.reportValidity();
          if (status) {
            status.classList.add("show");
            status.textContent = "Please complete all required fields correctly before submitting.";
          }
          return;
        }

        if (status) {
          status.classList.add("show");
          status.textContent = "Thanks! Your information has been received. We'll contact you via email as soon as possible.";
        }
        form.reset();
      });
    }

  })();