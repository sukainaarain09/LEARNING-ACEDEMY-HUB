/**
 * ============================================
 * Academy Website - Main JavaScript
 * ============================================
 * Handles: Mobile navigation, scroll reveal,
 *           counter animations, interactive features
 * ============================================
 */

(function () {
  'use strict';

  // ============================================
  // DOM Elements Cache
  // ============================================
  const DOM = {
    header: document.querySelector('.header'),
    hamburger: document.querySelector('.header__hamburger'),
    mobileMenu: document.querySelector('.header__mobile-menu'),
    mobileLinks: document.querySelectorAll('.header__mobile-menu a'),
    navLinks: document.querySelectorAll('.header__nav-links a'),
    revealElements: document.querySelectorAll('.reveal'),
    counterElements: document.querySelectorAll('.counter'),
    courseCards: document.querySelectorAll('.course-card'),
    featureCards: document.querySelectorAll('.feature-card'),
    testimonialCards: document.querySelectorAll('.testimonial-card'),
  };

  // ============================================
  // Mobile Navigation Toggle
  // ============================================
  function initMobileMenu() {
    if (!DOM.hamburger || !DOM.mobileMenu) return;

    DOM.hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = DOM.hamburger.classList.toggle('active');
      DOM.mobileMenu.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      document.body.style.position = isOpen ? 'fixed' : '';
      document.body.style.width = isOpen ? '100%' : '';
    });

    // Close mobile menu on link click
    DOM.mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        DOM.hamburger.classList.remove('active');
        DOM.mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
      });
    });

    // Close on outside click (clicking on the overlay/menu background)
    DOM.mobileMenu.addEventListener('click', function (e) {
      if (e.target === DOM.mobileMenu) {
        DOM.hamburger.classList.remove('active');
        DOM.mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && DOM.mobileMenu.classList.contains('active')) {
        DOM.hamburger.classList.remove('active');
        DOM.mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
      }
    });
  }

  // ============================================
  // Header Scroll Shadow
  // ============================================
  function initHeaderScroll() {
    if (!DOM.header) return;

    let ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          if (window.scrollY > 50) {
            DOM.header.classList.add('scrolled');
          } else {
            DOM.header.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ============================================
  // Active Nav Link Highlighting
  // ============================================
  function initActiveNav() {
    if (DOM.navLinks.length === 0) return;

    const sections = document.querySelectorAll('section[id], .hero[id]');

    function updateActiveLink() {
      const scrollY = window.scrollY + 100;

      sections.forEach(function (section) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          DOM.navLinks.forEach(function (link) {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === '#' + sectionId || href === sectionId + '.html' || href.endsWith('/' + sectionId)) {
              link.classList.add('active');
            }
          });

          // Also update mobile menu links
          DOM.mobileLinks.forEach(function (link) {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === '#' + sectionId || href === sectionId + '.html' || href.endsWith('/' + sectionId)) {
              link.classList.add('active');
            }
          });
        }
      });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink(); // Initial check
  }

  // ============================================
  // Scroll Reveal Animations
  // ============================================
  function initScrollReveal() {
    if (DOM.revealElements.length === 0) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    DOM.revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ============================================
  // Animated Counters (Stats Section)
  // ============================================
  function initCounters() {
    if (DOM.counterElements.length === 0) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseInt(counter.getAttribute('data-target'), 10);
            const suffix = counter.getAttribute('data-suffix') || '';
            const duration = 2000; // Animation duration in ms
            const startTime = performance.now();

            function animateCounter(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);

              // Easing function (ease-out cubic)
              const easedProgress = 1 - Math.pow(1 - progress, 3);
              const currentValue = Math.floor(easedProgress * target);

              if (target > 999) {
                counter.textContent = (currentValue / 1000).toFixed(
                  currentValue % 1000 === 0 ? 0 : 1
                ) + 'K' + suffix;
              } else {
                counter.textContent = currentValue + suffix;
              }

              if (progress < 1) {
                requestAnimationFrame(animateCounter);
              } else {
                // Final value
                if (target > 999) {
                  counter.textContent = (target / 1000).toFixed(target % 1000 === 0 ? 0 : 1) + 'K' + suffix;
                } else {
                  counter.textContent = target + suffix;
                }
              }
            }

            requestAnimationFrame(animateCounter);
            observer.unobserve(counter);
          }
        });
      },
      { threshold: 0.5 }
    );

    DOM.counterElements.forEach(function (counter) {
      observer.observe(counter);
    });
  }

  // ============================================
  // Smooth Scroll for Anchor Links
  // ============================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const headerHeight = DOM.header ? DOM.header.offsetHeight : 0;
          const targetPosition = target.offsetTop - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth',
          });
        }
      });
    });
  }

  // ============================================
  // Card Hover Effect Enhancement (3D tilt)
  // ============================================
  function initCardTilt() {
    const cards = document.querySelectorAll('.course-card, .feature-card, .testimonial-card');

    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 25;
        const rotateY = (centerX - x) / 25;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  // ============================================
  // Floating Card Animation on Scroll
  // ============================================
  function initParallaxElements() {
    const floats = document.querySelectorAll('.float-card');
    if (floats.length === 0) return;

    window.addEventListener('scroll', function () {
      const scrollY = window.scrollY;
      floats.forEach(function (float, index) {
        const speed = index === 0 ? 0.3 : 0.15;
        float.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }, { passive: true });
  }

  // ============================================
  // Courses Data & Rendering
  // ============================================
  const coursesData = [
    { id: 1, title: "Complete Full-Stack Development", category: "Development", level: "Beginner", duration: "40 Hours", instructor: "Sarah Johnson", initials: "SJ", rating: 4.9, price: "$49", image: "💻", description: "Master React, Node.js, databases, and deployment. Build real-world projects from scratch." },
    { id: 2, title: "Data Science & Machine Learning", category: "Development", level: "Intermediate", duration: "60 Hours", instructor: "Michael Chen", initials: "MC", rating: 4.8, price: "$69", image: "📊", description: "Learn Python, ML algorithms, and data visualization. Solve real business problems with data." },
    { id: 3, title: "UI/UX Design Masterclass", category: "Design", level: "Beginner", duration: "35 Hours", instructor: "Emily Rodriguez", initials: "ER", rating: 4.9, price: "$39", image: "🎨", description: "Create stunning user interfaces using Figma, prototyping, and usability testing techniques." },
    { id: 4, title: "Ethical Hacking & Security", category: "Development", level: "Advanced", duration: "50 Hours", instructor: "James Wright", initials: "JW", rating: 4.7, price: "$79", image: "🔐", description: "Learn penetration testing, network security, and vulnerability assessment from industry pros." },
    { id: 5, title: "Business Strategy & Analytics", category: "Business", level: "Intermediate", duration: "45 Hours", instructor: "Lisa Park", initials: "LP", rating: 4.6, price: "$59", image: "📈", description: "Develop strategic thinking and data-driven decision-making skills for modern business." },
    { id: 6, title: "Digital Marketing Fundamentals", category: "Marketing", level: "Beginner", duration: "30 Hours", instructor: "Alex Turner", initials: "AT", rating: 4.8, price: "$34", image: "📱", description: "Master SEO, social media, content marketing, and paid advertising campaigns." },
    { id: 7, title: "Advanced React Architecture", category: "Development", level: "Advanced", duration: "55 Hours", instructor: "Sarah Johnson", initials: "SJ", rating: 4.9, price: "$89", image: "⚛️", description: "Build scalable enterprise applications with advanced React patterns and state management." },
    { id: 8, title: "Brand Identity Design", category: "Design", level: "Intermediate", duration: "40 Hours", instructor: "Maria Santos", initials: "MS", rating: 4.7, price: "$49", image: "✏️", description: "Create compelling brand identities with logo design, typography, and visual systems." },
    { id: 9, title: "Financial Planning & Analysis", category: "Business", level: "Advanced", duration: "50 Hours", instructor: "David Kim", initials: "DK", rating: 4.5, price: "$74", image: "💰", description: "Master financial modeling, forecasting, and analysis for corporate decision-making." },
    { id: 10, title: "Social Media Strategy", category: "Marketing", level: "Beginner", duration: "25 Hours", instructor: "Alex Turner", initials: "AT", rating: 4.6, price: "$29", image: "🔥", description: "Build effective social media strategies that drive engagement and brand growth." },
    { id: 11, title: "Machine Learning with Python", category: "Development", level: "Intermediate", duration: "65 Hours", instructor: "Michael Chen", initials: "MC", rating: 4.8, price: "$79", image: "🧠", description: "Deep dive into ML algorithms, neural networks, and deep learning with TensorFlow." },
    { id: 12, title: "Motion Graphics & Animation", category: "Design", level: "Beginner", duration: "35 Hours", instructor: "Maria Santos", initials: "MS", rating: 4.7, price: "$44", image: "🎬", description: "Create stunning motion graphics and animations for web, film, and social media." },
    { id: 13, title: "Cloud Computing & DevOps", category: "Development", level: "Intermediate", duration: "50 Hours", instructor: "James Wright", initials: "JW", rating: 4.6, price: "$69", image: "☁️", description: "Master AWS, Docker, Kubernetes, and CI/CD pipelines for modern cloud infrastructure." },
    { id: 14, title: "Photography & Visual Storytelling", category: "Design", level: "Beginner", duration: "30 Hours", instructor: "Emma Wilson", initials: "EW", rating: 4.5, price: "$34", image: "📷", description: "Capture compelling stories through photography, lighting, and post-processing techniques." },
    { id: 15, title: "Entrepreneurship & Startup Launch", category: "Business", level: "Beginner", duration: "40 Hours", instructor: "Lisa Park", initials: "LP", rating: 4.7, price: "$49", image: "🚀", description: "Learn to validate ideas, build business models, and launch your startup successfully." },
    { id: 16, title: "Content Marketing Mastery", category: "Marketing", level: "Intermediate", duration: "35 Hours", instructor: "Alex Turner", initials: "AT", rating: 4.8, price: "$44", image: "✍️", description: "Create compelling content strategies that drive organic traffic and convert audiences." },
    { id: 17, title: "Cybersecurity Fundamentals", category: "Development", level: "Beginner", duration: "45 Hours", instructor: "James Wright", initials: "JW", rating: 4.6, price: "$59", image: "🛡️", description: "Understand network security, encryption, and threat assessment for protecting digital assets." },
    { id: 18, title: "Web Animation & Interaction Design", category: "Design", level: "Intermediate", duration: "40 Hours", instructor: "Emma Wilson", initials: "EW", rating: 4.7, price: "$49", image: "🎞️", description: "Design engaging web animations and micro-interactions that delight users and boost engagement." },
    { id: 19, title: "Digital Product Management", category: "Business", level: "Advanced", duration: "55 Hours", instructor: "David Kim", initials: "DK", rating: 4.5, price: "$84", image: "📋", description: "Lead products from ideation to launch with proven frameworks, roadmapping, and stakeholder management." },
    { id: 20, title: "Email Marketing & Automation", category: "Marketing", level: "Beginner", duration: "25 Hours", instructor: "Rachel Green", initials: "RG", rating: 4.6, price: "$29", image: "📧", description: "Build effective email campaigns, automate funnels, and maximize customer lifetime value." },
    { id: 21, title: "Node.js Backend Development", category: "Development", level: "Intermediate", duration: "50 Hours", instructor: "Sarah Johnson", initials: "SJ", rating: 4.8, price: "$74", image: "🌐", description: "Build robust backends with Express.js, MongoDB, and real-time WebSocket architectures." },
    { id: 22, title: "Illustration & Graphic Design", category: "Design", level: "Beginner", duration: "35 Hours", instructor: "Emma Wilson", initials: "EW", rating: 4.5, price: "$39", image: "🖌️", description: "Master digital illustration techniques from sketching to final artwork with industry tools." },
    { id: 23, title: "Google Analytics & Data Insights", category: "Business", level: "Intermediate", duration: "30 Hours", instructor: "Rachel Green", initials: "RG", rating: 4.7, price: "$49", image: "📊", description: "Transform raw data into actionable insights using Google Analytics and visualization dashboards." },
    { id: 24, title: "Paid Advertising & PPC Strategy", category: "Marketing", level: "Advanced", duration: "45 Hours", instructor: "Rachel Green", initials: "RG", rating: 4.6, price: "$64", image: "💡", description: "Master Google Ads, Facebook Ads, and programmatic advertising to maximize ROAS and conversions." }
  ];

  const categoryFilters = document.getElementById('category-filter');
  const levelFilter = document.getElementById('level-filter');
  const searchInput = document.getElementById('search-input');
  const courseGrid = document.getElementById('course-grid');
  const coursesEmpty = document.getElementById('courses-empty');
  const resultCount = document.getElementById('result-count');

  function getFilteredCourses() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const category = categoryFilters ? categoryFilters.value : 'all';
    const level = levelFilter ? levelFilter.value : 'all';

    return coursesData.filter(function(course) {
      const matchesSearch = !searchTerm ||
        course.title.toLowerCase().includes(searchTerm) ||
        course.description.toLowerCase().includes(searchTerm) ||
        course.instructor.toLowerCase().includes(searchTerm) ||
        course.category.toLowerCase().includes(searchTerm);
      const matchesCategory = category === 'all' || course.category === category;
      const matchesLevel = level === 'all' || course.level === level;
      return matchesSearch && matchesCategory && matchesLevel;
    });
  }

  function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    let html = '';
    for (let i = 0; i < fullStars; i++) { html += '★'; }
    if (hasHalf) { html += '½'; }
    return html;
  }

  function renderCourses(courses) {
    if (courseGrid) {
      courseGrid.innerHTML = '';
    }
    if (coursesEmpty) {
      coursesEmpty.style.display = 'none';
    }

    if (courses.length === 0) {
      if (coursesEmpty) coursesEmpty.style.display = 'block';
      if (resultCount) resultCount.textContent = '0';
      return;
    }

    if (resultCount) resultCount.textContent = courses.length;

    courses.forEach(function(course, index) {
      const card = document.createElement('article');
      card.className = 'course-card--dynamic';
      card.setAttribute('role', 'article');
      card.setAttribute('aria-label', course.title);
      card.style.transitionDelay = (index * 0.05) + 's';

      card.innerHTML =
        '<div class="course-card--dynamic__image" role="img" aria-label="' + course.category + ' course illustration">' +
          '<span aria-hidden="true">' + course.image + '</span>' +
          '<span class="course-card--dynamic__tag">' + course.category + '</span>' +
        '</div>' +
        '<div class="course-card--dynamic__body">' +
          '<span class="course-card--dynamic__category">' + course.category + '</span>' +
          '<h3 class="course-card--dynamic__title">' + course.title + '</h3>' +
          '<p class="course-card--dynamic__description">' + course.description + '</p>' +
          '<div class="course-card--dynamic__meta">' +
            '<div class="course-card--dynamic__instructor">' +
              '<div class="course-card--dynamic__instructor-avatar" aria-hidden="true">' + course.initials + '</div>' +
              '<span>' + course.instructor + '</span>' +
            '</div>' +
            '<span class="course-card--dynamic__level">' + course.level + '</span>' +
          '</div>' +
          '<div class="course-card--dynamic__meta">' +
            '<span class="course-card--dynamic__duration">' +
              '<svg aria-hidden="true" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>' + course.duration +
            '</span>' +
            '<span class="course-card--dynamic__rating">' +
              renderStars(course.rating) + ' ' + course.rating +
            '</span>' +
          '</div>' +
          '<div class="course-card--dynamic__footer">' +
            '<div class="course-card--dynamic__price">' + course.price + ' <span>/ course</span></div>' +
            '<a href="#" class="btn btn--primary">View Course</a>' +
          '</div>' +
        '</div>';

      if (courseGrid) {
        courseGrid.appendChild(card);
        // Trigger animation
        requestAnimationFrame(function() {
          requestAnimationFrame(function() {
            card.classList.add('visible');
          });
        });
      }
    });
  }

  function filterCourses() {
    const filtered = getFilteredCourses();
    renderCourses(filtered);
    // Re-trigger scroll reveal for new cards
    if (typeof initScrollReveal === 'function') {
      // Re-query and observe new reveal elements
      const newReveals = document.querySelectorAll('.course-card--dynamic:not(.visible)');
    }
  }

  function initCourses() {
    // Only run on courses page
    if (!courseGrid) return;

    renderCourses(coursesData);

    if (searchInput) {
      searchInput.addEventListener('input', filterCourses);
    }
    if (categoryFilters) {
      categoryFilters.addEventListener('change', filterCourses);
    }
    if (levelFilter) {
      levelFilter.addEventListener('change', filterCourses);
    }
  }

  // ============================================
  // Initialize All Features
  // ============================================
  function init() {
    initMobileMenu();
    initHeaderScroll();
    initActiveNav();
    initScrollReveal();
    initCounters();
    initSmoothScroll();
    initCardTilt();
    initParallaxElements();
    initCourses();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
