// ==================== Navigation Menu Toggle ====================
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const navbar = document.getElementById('navbar');

  // Safety guards
  if (!hamburger || !navMenu) return;

  // Accessibility attributes for hamburger
  hamburger.setAttribute('role', 'button');
  hamburger.setAttribute('aria-controls', 'navMenu');
  hamburger.setAttribute('aria-expanded', 'false');

  // Toggle mobile menu
  hamburger.addEventListener('click', () => {
      const isActive = hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
  });

  // Close menu when clicking on a nav link
  navLinks.forEach(link => {
      link.addEventListener('click', () => {
          hamburger.classList.remove('active');
          navMenu.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
      });
  });

  // ==================== Navbar Scroll Effect (light debounce) ====================
  let lastKnownScrollY = 0;
  let ticking = false;

  function onScroll() {
      lastKnownScrollY = window.scrollY;
      if (!ticking) {
          window.requestAnimationFrame(() => {
              if (lastKnownScrollY > 50) {
                  navbar.classList.add('scrolled');
              } else {
                  navbar.classList.remove('scrolled');
              }
              ticking = false;
          });
          ticking = true;
      }
  }
  window.addEventListener('scroll', onScroll);

  // ==================== Active Navigation Link ====================
  const sections = document.querySelectorAll('section[id]');

  function setActiveNav() {
      const scrollY = window.pageYOffset;
      sections.forEach(section => {
          const sectionHeight = section.offsetHeight;
          const sectionTop = section.offsetTop - 120; // tuned offset
          const sectionId = section.getAttribute('id');
          const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
          if (!navLink) return;
          if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
              navLink.classList.add('active');
          } else {
              navLink.classList.remove('active');
          }
      });
  }
  window.addEventListener('scroll', setActiveNav);
  setActiveNav(); // initialize on load

  // ==================== Typing Animation ====================
  const typedTextElement = document.querySelector('.typed-text');
  const texts = [
      'Software Engineer',
      'Backend Developer',
      'Java Spring Boot Developer',
      '.NET Core Developer',
      'Problem Solver'
  ];

  if (typedTextElement) {
      let textIndex = 0;
      let charIndex = 0;
      let isDeleting = false;

      function type() {
          const currentText = texts[textIndex];
          if (isDeleting) {
              charIndex = Math.max(0, charIndex - 1);
              typedTextElement.textContent = currentText.substring(0, charIndex);
          } else {
              charIndex = Math.min(currentText.length, charIndex + 1);
              typedTextElement.textContent = currentText.substring(0, charIndex);
          }

          let delay = isDeleting ? 50 : 150;

          if (!isDeleting && charIndex === currentText.length) {
              isDeleting = true;
              delay = 2000; // pause at end
          } else if (isDeleting && charIndex === 0) {
              isDeleting = false;
              textIndex = (textIndex + 1) % texts.length;
              delay = 500; // small pause before typing new text
          }

          setTimeout(type, delay);
      }

      // start animation
      setTimeout(type, 500);
  }

  // ==================== Smooth Scrolling (works with fixed header) ====================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
          // Allow external links, mailto, tel to behave normally
          const href = this.getAttribute('href');
          if (!href || !href.startsWith('#') || href === '#') return;

          const target = document.querySelector(href);
          if (!target) return;

          e.preventDefault();

          const headerOffset = 70;
          const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - headerOffset;

          window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
          });

          // If nav open on mobile, close it
          if (navMenu.classList.contains('active')) {
              navMenu.classList.remove('active');
              hamburger.classList.remove('active');
              hamburger.setAttribute('aria-expanded', 'false');
          }
      });
  });

  // ==================== Scroll to Top Button ====================
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
      // show/hide
      window.addEventListener('scroll', () => {
          if (window.scrollY > 400) {
              scrollTopBtn.classList.add('show');
          } else {
              scrollTopBtn.classList.remove('show');
          }
      });

      // click to top
      scrollTopBtn.addEventListener('click', () => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
      });

      // keyboard accessibility
      scrollTopBtn.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
          }
      });
  }

  // ==================== Stats Count Up (IntersectionObserver) ====================
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length > 0) {
      const observer = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
              if (!entry.isIntersecting) return;
              const el = entry.target;
              const target = parseInt(el.getAttribute('data-target'), 10) || 0;
              const duration = 1200;
              const start = performance.now();

              function animate(now) {
                  const elapsed = now - start;
                  const progress = Math.min(elapsed / duration, 1);
                  el.textContent = Math.floor(progress * target);
                  if (progress < 1) {
                      requestAnimationFrame(animate);
                  } else {
                      el.textContent = target; // ensure exact end value
                  }
              }
              requestAnimationFrame(animate);
              obs.unobserve(el);
          });
      }, { threshold: 0.6 });

      statNumbers.forEach(el => observer.observe(el));
  }

  // ==================== Optional: Basic AOS emulate (small) ====================
  // If you don't import AOS library, this small observer adds class to `[data-aos]` elements when visible.
  const aosElements = document.querySelectorAll('[data-aos]');
  if (aosElements.length) {
      const aosObserver = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  entry.target.classList.add('aos-animate');
                  obs.unobserve(entry.target);
              }
          });
      }, { threshold: 0.2 });

      aosElements.forEach(el => aosObserver.observe(el));
  }
});
