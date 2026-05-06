const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  const storedTheme = localStorage.getItem('portfolioTheme');
  if (storedTheme) html.dataset.theme = storedTheme;
  const updateThemeIcon = () => {
    themeToggle.textContent = html.dataset.theme === 'dark' ? '🌙' : '☀️';
  };
  updateThemeIcon();
  themeToggle.addEventListener('click', () => {
    html.dataset.theme = html.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('portfolioTheme', html.dataset.theme);
    updateThemeIcon();
  });

  AOS.init({ duration: 800, once: true, mirror: false });

  /* Hero Section - Typing Animation */
  const typedTextElement = document.querySelector('.typed-text');
  const roles = ['Full Stack Developer', 'Web Developer', 'Problem Solver', 'UI/UX Enthusiast', 'Code Craftsman'];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const typeHeroRole = () => {
    const currentRole = roles[roleIndex];
    const typeSpeed = isDeleting ? 50 : 80;
    const deleteSpeed = 40;

    if (!isDeleting) {
      typedTextElement.textContent = currentRole.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentRole.length) {
        isDeleting = true;
        setTimeout(typeHeroRole, 1500);
        return;
      }
    } else {
      typedTextElement.textContent = currentRole.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeHeroRole, 300);
        return;
      }
    }

    setTimeout(typeHeroRole, isDeleting ? deleteSpeed : typeSpeed);
  };

  if (typedTextElement) {
    typeHeroRole();
  }

  /* Smooth Scroll to Section */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* Scroll Indicator Click Handler */
  const scrollIndicator = document.querySelector('.hero-scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const aboutSection = document.querySelector('#about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  /* Parallax Mouse Movement on Hero Visual */
  const heroVisualContainer = document.querySelector('.hero-visual-container');
  const floatingCard = document.querySelector('.floating-card');
  const floatingElements = document.querySelectorAll('.floating-element');

  if (heroVisualContainer && floatingCard) {
    document.addEventListener('mousemove', (e) => {
      const x = (window.innerWidth / 2 - e.clientX) / 50;
      const y = (window.innerHeight / 2 - e.clientY) / 50;

      floatingCard.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg)`;

      floatingElements.forEach((element, index) => {
        const moveX = (window.innerWidth / 2 - e.clientX) / (80 - index * 20);
        const moveY = (window.innerHeight / 2 - e.clientY) / (80 - index * 20);
        element.style.transform = `translate(calc(-50% + ${moveX}px), ${moveY}px)`;
      });
    });
  }

  const timelineSection = document.getElementById('timelineSection');
  const timelineWrapper = document.querySelector('.timeline-wrapper');
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        timelineWrapper.classList.add('timeline-active');
        timelineObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });
  if (timelineSection) timelineObserver.observe(timelineSection);

  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const navLink = document.querySelector(`.nav-link[href="#${id}"]`);
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        if (navLink) navLink.classList.add('active');
      }
    });
  }, { rootMargin: '-50% 0px -50% 0px' });
  sections.forEach(section => observer.observe(section));

  document.querySelectorAll('.filter-btns button').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.filter-btns button').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      const filter = button.dataset.filter;
      document.querySelectorAll('#projectGrid [data-category]').forEach(card => {
        card.style.display = (filter === 'all' || card.dataset.category === filter) ? 'block' : 'none';
      });
    });
  });

  const projectModal = new bootstrap.Modal(document.getElementById('projectModal'));
  document.querySelectorAll('.open-project').forEach(button => {
    button.addEventListener('click', () => {
      document.getElementById('projectModalLabel').textContent = button.dataset.title;
      document.getElementById('modalDescription').textContent = button.dataset.description;
      document.getElementById('modalStack').innerHTML = `<strong>Tech stack:</strong> ${button.dataset.stack}`;
      const demoLink = document.getElementById('modalDemo');
      const githubLink = document.getElementById('modalGitHub');
      const demoUrl = button.dataset.demo;
      const githubUrl = button.dataset.github;
      if (demoUrl && demoUrl !== '#') {
        demoLink.href = demoUrl;
        demoLink.classList.remove('disabled');
      } else {
        demoLink.href = '#';
        demoLink.classList.add('disabled');
      }
      if (githubUrl && githubUrl !== '#') {
        githubLink.href = githubUrl;
        githubLink.classList.remove('disabled');
      } else {
        githubLink.href = '#';
        githubLink.classList.add('disabled');
      }
      projectModal.show();
    });
  });

  const githubContainer = document.getElementById('githubRepos');
  const githubUsername = 'ransam12';
  fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=6`)
    .then(response => response.json())
    .then(repos => {
      if (!Array.isArray(repos) || repos.length === 0) {
        githubContainer.innerHTML = '<div class="col-12 text-center text-muted">No repositories found.</div>';
        return;
      }
      githubContainer.innerHTML = repos.map(repo => `
        <div class="col-md-6 col-xl-4" data-aos="fade-up">
          <div class="card project-card h-100 glass-card">
            <div class="card-body d-flex flex-column">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <span class="project-badge">GitHub</span>
                <small class="text-muted">${repo.language || 'Code'}</small>
              </div>
              <h5 class="card-title">${repo.name}</h5>
              <p class="card-text text-muted">${repo.description || 'Public repository with useful code and examples.'}</p>
              <div class="mt-auto d-flex gap-2 flex-wrap">
                <a class="btn btn-sm btn-primary" href="${repo.html_url}" target="_blank">View Repo</a>
                ${repo.homepage ? `<a class="btn btn-sm btn-outline-light" href="${repo.homepage}" target="_blank">Live Demo</a>` : ''}
              </div>
            </div>
          </div>
        </div>
      `).join('');
    })
    .catch(() => {
      githubContainer.innerHTML = '<div class="col-12 text-center text-muted">Unable to load GitHub data. Please try again later.</div>';
    });

  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const sendButton = document.getElementById('sendButton');
  const spinner = sendButton.querySelector('.spinner-border');
  const buttonText = sendButton.querySelector('.button-text');
  const nameField = document.getElementById('name');
  const emailField = document.getElementById('email');
  const subjectField = document.getElementById('subject');
  const messageField = document.getElementById('message');
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const subjectError = document.getElementById('subjectError');
  const messageError = document.getElementById('messageError');

  const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const setFormStatus = (message, color) => {
    formStatus.textContent = message;
    formStatus.style.color = color;
  };
  const clearFieldErrors = () => {
    [nameError, emailError, subjectError, messageError].forEach(el => { if (el) el.textContent = ''; });
  };
  const toggleSubmitState = isLoading => {
    if (isLoading) {
      sendButton.classList.add('btn-loading');
      spinner.classList.remove('d-none');
      buttonText.textContent = 'Sending...';
      sendButton.disabled = true;
    } else {
      sendButton.classList.remove('btn-loading');
      spinner.classList.add('d-none');
      buttonText.textContent = 'Send Message';
      sendButton.disabled = false;
    }
  };
  const saveContactDraft = () => {
    const draft = {
      name: nameField.value,
      email: emailField.value,
      subject: subjectField.value,
      message: messageField.value
    };
    localStorage.setItem('contactDraft', JSON.stringify(draft));
  };
  const loadContactDraft = () => {
    const draft = JSON.parse(localStorage.getItem('contactDraft') || '{}');
    if (draft.name) nameField.value = draft.name;
    if (draft.email) emailField.value = draft.email;
    if (draft.subject) subjectField.value = draft.subject;
    if (draft.message) messageField.value = draft.message;
  };

  [nameField, emailField, subjectField, messageField].forEach(field => {
    field.addEventListener('input', () => {
      clearFieldErrors();
      saveContactDraft();
    });
  });

  const validateContactForm = () => {
    let valid = true;
    if (!nameField.value.trim()) {
      nameError.textContent = 'Please enter your name.';
      valid = false;
    }
    if (!emailField.value.trim()) {
      emailError.textContent = 'Please enter your email address.';
      valid = false;
    } else if (!isValidEmail(emailField.value.trim())) {
      emailError.textContent = 'Please enter a valid email address.';
      valid = false;
    }
    if (!messageField.value.trim()) {
      messageError.textContent = 'Please tell me about your project.';
      valid = false;
    }
    return valid;
  };

  loadContactDraft();

  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    clearFieldErrors();
    setFormStatus('', '');
    if (!validateContactForm()) {
      setFormStatus('Please fix the errors above and try again.', '#f87171');
      return;
    }
    toggleSubmitState(true);
    setFormStatus('Sending message...', '#94a3b8');

    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: nameField.value.trim(),
        email: emailField.value.trim(),
        subject: subjectField.value.trim(),
        message: messageField.value.trim(),
        date: new Date().toISOString()
      })
    })
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(() => {
        contactForm.reset();
        localStorage.removeItem('contactDraft');
        setFormStatus('✅ Message sent successfully. Thank you!', '#34d399');
      })
      .catch(() => {
        setFormStatus('Unable to send message right now. Please try again later.', '#f87171');
      })
      .finally(() => {
        toggleSubmitState(false);
      });
  });

  const skillsSection = document.getElementById('skills');
  const skillToggleButtons = document.querySelectorAll('.skill-toggle button');
  const skillCounters = document.querySelectorAll('.skill-counter');
  const skillProgressBars = document.querySelectorAll('.skill-progress-bar');
  const skillCircles = document.querySelectorAll('.skill-circle');

  const setSkillView = view => {
    if (!skillsSection) return;
    skillsSection.dataset.view = view;
    skillToggleButtons.forEach(button => {
      button.classList.toggle('active', button.dataset.skillView === view);
    });
  };

  skillToggleButtons.forEach(button => {
    button.addEventListener('click', () => {
      setSkillView(button.dataset.skillView);
    });
  });

  const animateSkillCounters = () => {
    skillCounters.forEach(counter => {
      const target = Number(counter.dataset.target) || 0;
      let current = 0;
      const duration = 1400;
      const stepTime = 20;
      const increment = Math.ceil(target / (duration / stepTime));
      const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target;
          clearInterval(interval);
        } else {
          counter.textContent = current;
        }
      }, stepTime);
    });
  };

  const animateSkillVisuals = () => {
    skillProgressBars.forEach(bar => {
      const progress = bar.dataset.progress || 0;
      bar.style.width = `${progress}%`;
      bar.setAttribute('aria-valuenow', progress);
    });

    skillCircles.forEach(circle => {
      const progress = Number(circle.dataset.progress) || 0;
      const valueLabel = circle.querySelector('.circle-value');
      let current = 0;
      const duration = 1200;
      const stepTime = 16;
      const increment = Math.max(1, Math.ceil(progress / (duration / stepTime)));
      const update = () => {
        current = Math.min(current + increment, progress);
        if (valueLabel) valueLabel.textContent = `${current}%`;
        const angle = current * 3.6;
        circle.style.background = `conic-gradient(var(--primary) ${angle}deg, rgba(255,255,255,0.08) ${angle}deg 360deg)`;
        if (current < progress) requestAnimationFrame(update);
      };
      update();
    });
  };

  if (skillsSection) {
    const skillsObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateSkillCounters();
          animateSkillVisuals();
          skillsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    skillsObserver.observe(skillsSection);
  }

  /* About Section Animation */
  const aboutSection = document.getElementById('about');
  const statCounters = document.querySelectorAll('.stat-counter');
  
  const animateAboutStats = () => {
    statCounters.forEach(counter => {
      const target = Number(counter.dataset.target) || 0;
      let current = 0;
      const duration = 1400;
      const stepTime = 20;
      const increment = Math.ceil(target / (duration / stepTime));
      const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target;
          clearInterval(interval);
        } else {
          counter.textContent = current;
        }
      }, stepTime);
    });
  };

  if (aboutSection) {
    const aboutObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateAboutStats();
          aboutObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    aboutObserver.observe(aboutSection);
  }

  document.getElementById('downloadResume').addEventListener('click', () => {
    const resumeText = `Beza Gezahegn\n\nComputer Science Student & Web Developer\n\nProfile:\nPassionate about building modern web experiences with a focus on usability, performance, and responsive design.\n\nSkills:\n- HTML, CSS, Bootstrap, JavaScript\n- Python, Git, GitHub\n- UI/UX design and responsive layouts\n\nProjects:\n- Puppy Page: Responsive landing page\n- Login System: Authentication interface\n- Library System: Java-based management app\n\nContact:\nEmail: mamobezagezahegn@gmail.com\n`;
    const blob = new Blob([resumeText], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Beza-Gezahegn-CV.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  });

  document.getElementById('aboutDownloadResume').addEventListener('click', () => {
    const resumeText = `Beza Gezahegn\n\nComputer Science Student & Web Developer\n\nProfile:\nPassionate about building modern web experiences with a focus on usability, performance, and responsive design.\n\nSkills:\n- HTML, CSS, Bootstrap, JavaScript\n- Python, Git, GitHub\n- UI/UX design and responsive layouts\n\nProjects:\n- Puppy Page: Responsive landing page\n- Login System: Authentication interface\n- Library System: Java-based management app\n\nContact:\nEmail: mamobezagezahegn@gmail.com\n`;
    const blob = new Blob([resumeText], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Beza-Gezahegn-CV.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  });