$(document).ready(function () {

    // Smooth scrolling
    $('a[href^="#"]').on('click', function (e) {
        e.preventDefault();
        const target = $(this.getAttribute('href'));
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 70
            }, 800);
        }
    });

    // Typing effect
    const text = "Aspiring Java Full Stack Developer";
    let i = 0;
    function typeEffect() {
        if (i < text.length) {
            $('.hero-lead').text(text.substring(0, i + 1));
            i++;
            setTimeout(typeEffect, 60);
        }
    }
    typeEffect();

});

// ===== Scroll Reveal =====
const revealElements = document.querySelectorAll(
    ".skill-card, .project-card, #about .row, #contact form"
);

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("reveal", "active");
        }
    });
}, { threshold: 0.15 });

revealElements.forEach((el) => {
    el.classList.add("reveal");
    revealObserver.observe(el);
});

// ===== Magnetic Buttons =====
const magneticButtons = document.querySelectorAll(".btn");

magneticButtons.forEach((btn) => {
    btn.classList.add("magnetic");

    btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener("mouseleave", () => {
        btn.style.transform = "translate(0,0)";
    });
});

// ===== 3D Tilt + Lift Effect for Cards =====
const tiltCards = document.querySelectorAll(".skill-card, .project-card");

tiltCards.forEach((card) => {
    card.classList.add("tilt");

    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 14;
        const rotateY = (centerX - x) / 14;

        card.style.transform =
            `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "rotateX(0deg) rotateY(0deg) translateY(0)";
    });
});

// ===== Project Modal =====
const projectData = {
    "Engiplex Solutions (Freelance)": {
        desc: "Designed, developed, and deployed the official company website as a freelance project with real client collaboration.",
        tech: ["HTML", "CSS", "Bootstrap", "JavaScript", "jQuery", "PHP", "Google Sheets"],
        highlights: [
            "Worked directly with client to gather requirements",
            "Handled deployment, domain setup and SEO basics",
            "Responsive and cross-browser compatible design"
        ],
        images: [
            "images/engiplex-1.png",
            "images/engiplex-2.png",
            "images/engiplex-3.png"
        ],
        live: "https://engiplex.in/",
        git: "https://github.com/engiplexservices-star/Engiplex"
    },

    "Horizon Hub – Weather Forecast App": {
        desc: "Responsive weather forecasting web app showing real-time and multi-day weather using public APIs.",
        tech: ["HTML", "CSS", "JavaScript", "Fetch API", "OpenWeatherMap API"],
        highlights: [
            "City search and geolocation-based results",
            "Unit conversion (°C / °F)",
            "Robust error handling and async/await usage"
        ],
        images: [
            "images/horizon-1.png",
            "images/horizon-2.png",
            "images/horizon-3.png"
        ],
        live: "https://horhub.netlify.app/",
        git: "https://github.com/RamBhole/Horizon-Hub"
    },

    "Banking Management System": {
        desc: "Console-based banking system using Java and JDBC with PostgreSQL for persistent data management.",
        tech: ["Java", "JDBC", "PostgreSQL", "OOP"],
        highlights: [
            "Account management and transaction handling",
            "Database connectivity with JDBC",
            "Modular and maintainable code structure"
        ],
        images: [
            "images/banking-1.png",
            "images/banking-2.png",
            "images/banking-3.png"
        ],
        live: "#",
        git: "https://github.com/RamBhole/Banking-System-JAVA-JDBC-PostgreSQL"
    }
};

document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("click", () => {
        const title = card.querySelector("h5").innerText;
        const data = projectData[title];

        document.getElementById("modalTitle").innerText = title;
        document.getElementById("modalDesc").innerText = data.desc;

        const imgDiv = document.getElementById("modalImages");
        imgDiv.innerHTML = "";

        data.images.forEach(src => {
            imgDiv.innerHTML += `<img src="${src}" alt="project screenshot">`;
        });

        const techDiv = document.getElementById("modalTech");
        techDiv.innerHTML = "";
        data.tech.forEach(t => {
            techDiv.innerHTML += `<span class="tech-badge">${t}</span>`;
        });

        const highDiv = document.getElementById("modalHighlights");
        highDiv.innerHTML = "<ul class='highlight-list'>" +
            data.highlights.map(h => `<li>${h}</li>`).join("") +
            "</ul>";

        document.getElementById("modalLive").href = data.live;
        document.getElementById("modalGit").href = data.git;

        new bootstrap.Modal(document.getElementById("projectModal")).show();
    });
});

// ===== Scroll Spy Navbar =====

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (pageYOffset >= sectionTop) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active-nav");
        if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active-nav");
        }
    });
});

// ===== Animated Stats Counter =====

const statNumbers = document.querySelectorAll(".stat-number");

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = +el.getAttribute("data-target");
      let count = 0;

      const update = () => {
        const increment = target / 80;
        count += increment;
        if (count < target) {
          el.innerText = Math.ceil(count);
          requestAnimationFrame(update);
        } else {
          el.innerText = target;
        }
      };

      update();
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.6 });

statNumbers.forEach(el => statObserver.observe(el));

// ===== Skills Filter =====

const filterBtns = document.querySelectorAll(".filter-btn");
const skillCards = document.querySelectorAll(".skill-card");

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active-filter"));
    btn.classList.add("active-filter");

    const filter = btn.getAttribute("data-filter");

    skillCards.forEach(card => {
      if (filter === "all" || card.getAttribute("data-category") === filter) {
        card.parentElement.style.display = "block";
      } else {
        card.parentElement.style.display = "none";
      }
    });
  });
});


// ===== Scroll Spy Navbar =====
window.addEventListener("scroll", () => {
    let current = "";

    document.querySelectorAll("section").forEach(section => {
        const sectionTop = section.offsetTop - 150;
        if (pageYOffset >= sectionTop) {
            current = section.getAttribute("id");
        }
    });

    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.remove("active-nav");
        if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active-nav");
        }
    });
});



// ===== Three.js backgrounds =====
createBG("home-bg", 0.0003);
createBG("about-bg", 0.0004);
createBG("skills-bg", 0.0005);
createBG("projects-bg", 0.0006);
createBG("contact-bg", 0.0003);
createBG("education-bg", 0.00045);
