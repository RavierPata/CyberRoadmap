document.addEventListener("DOMContentLoaded", function () {

    const hamburger = document.getElementById("hamburger-btn");
    const navMenu   = document.getElementById("nav-menu");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", function () {
            navMenu.classList.toggle("nav-open");
            hamburger.textContent = navMenu.classList.contains("nav-open") ? "✕" : "☰";
        });
    }

    const themeToggle = document.getElementById("theme-toggle");

    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            document.body.classList.toggle("light-mode");
            themeToggle.textContent = document.body.classList.contains("light-mode")
                ? "🌙 Dark Mode"
                : "☀️ Light Mode";
        });
    }

    const heroTitle = document.getElementById("hero-title");

    if (heroTitle) {
        const fullText = heroTitle.getAttribute("data-text") || heroTitle.textContent;
        heroTitle.textContent = "";
        let charIndex = 0;

        function typeNextChar() {
            if (charIndex < fullText.length) {
                heroTitle.textContent += fullText.charAt(charIndex);
                charIndex++;
                setTimeout(typeNextChar, 65);
            } else {
                heroTitle.classList.add("animate-pulse");
            }
        }

        setTimeout(typeNextChar, 400);
    }

    const fadeElements = document.querySelectorAll(".fade-in");

    if (fadeElements.length > 0 && "IntersectionObserver" in window) {
        const fadeObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        fadeElements.forEach(function (el) {
            fadeObserver.observe(el);
        });
    } else {
        fadeElements.forEach(function (el) { el.classList.add("visible"); });
    }

    const galleryImages = document.querySelectorAll(".gallery-card img");

    galleryImages.forEach(function (img) {
        img.addEventListener("mouseover", function () {
            this.style.transform  = "scale(1.1)";
            this.style.transition = "transform 0.35s ease";
        });
        img.addEventListener("mouseout", function () {
            this.style.transform = "scale(1)";
        });
    });

    const contactForm = document.getElementById("contact-form");

    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();

            document.querySelectorAll(".error-msg").forEach(function (err) {
                err.remove();
            });

            let formIsValid = true;

            const nameField = document.getElementById("fullname");
            if (nameField && nameField.value.trim() === "") {
                showError(nameField, "⚠ Full name is required.");
                formIsValid = false;
            }

            const emailField = document.getElementById("email");
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailField && !emailRegex.test(emailField.value.trim())) {
                showError(emailField, "⚠ Please enter a valid email address.");
                formIsValid = false;
            }

            const radioButtons  = document.querySelectorAll('input[name="experience"]');
            const radioSelected = Array.from(radioButtons).some(function (rb) { return rb.checked; });
            if (!radioSelected) {
                const radioGroup = document.getElementById("radio-group");
                if (radioGroup) showError(radioGroup, "⚠ Please select your experience level.");
                formIsValid = false;
            }

            const checkboxes = document.querySelectorAll('input[name="interests"]');
            const anyChecked = Array.from(checkboxes).some(function (cb) { return cb.checked; });
            if (!anyChecked) {
                const checkGroup = document.getElementById("check-group");
                if (checkGroup) showError(checkGroup, "⚠ Please select at least one area of interest.");
                formIsValid = false;
            }

            const pathSelect = document.getElementById("career-path");
            if (pathSelect && pathSelect.value === "") {
                showError(pathSelect, "⚠ Please select a career path.");
                formIsValid = false;
            }

            const msgField = document.getElementById("message");
            if (msgField && msgField.value.trim().length < 10) {
                showError(msgField, "⚠ Please write at least 10 characters.");
                formIsValid = false;
            }

            if (formIsValid) {
                displayQuizResult();
            }
        });
    }

    function showError(element, message) {
        const errSpan       = document.createElement("span");
        errSpan.className   = "error-msg";
        errSpan.textContent = message;
        element.parentNode.appendChild(errSpan);
    }

    function displayQuizResult() {
        const resultBox = document.getElementById("result-box");
        if (!resultBox) return;

        const pathSelect   = document.getElementById("career-path");
        const selectedPath = pathSelect ? pathSelect.value : "general";

        const checkedBoxes = document.querySelectorAll('input[name="interests"]:checked');
        const interestList = Array.from(checkedBoxes).map(function (cb) { return cb.value; });

        const expRadio = document.querySelector('input[name="experience"]:checked');
        const expLevel = expRadio ? expRadio.value : "beginner";

        const recommendations = {
            pentester: {
                icon: "🔴",
                title: "Penetration Tester",
                text: "Start with <strong>CompTIA Security+</strong>, then pursue the <strong>CEH</strong> or <strong>eJPT</strong>. " +
                      "Your goal cert is <strong>OSCP</strong>. Master Kali Linux, Python scripting, and Metasploit."
            },
            soc: {
                icon: "🔵",
                title: "SOC Analyst",
                text: "Start with <strong>CompTIA Security+</strong>, then <strong>CySA+</strong>. " +
                      "Learn SIEM platforms (Splunk, Microsoft Sentinel), log analysis, and incident response playbooks."
            },
            cloud: {
                icon: "☁️",
                title: "Cloud Security Engineer",
                text: "Get <strong>AWS Cloud Practitioner</strong> or <strong>AZ-900</strong> first, then pursue the <strong>CCSP</strong>. " +
                      "Focus on IAM, encryption at rest/transit, and zero-trust architecture."
            },
            forensics: {
                icon: "🔬",
                title: "Digital Forensics Analyst",
                text: "Start with <strong>CompTIA A+</strong> and <strong>Security+</strong>, then aim for <strong>GCFE</strong> or <strong>GCFA</strong>. " +
                      "Learn Autopsy, FTK Imager, and chain-of-custody procedures."
            },
            general: {
                icon: "🛡️",
                title: "General Cybersecurity",
                text: "Start with <strong>CompTIA A+</strong> then <strong>Security+</strong>. " +
                      "Explore all domains — find what excites you most, then specialize!"
            }
        };

        const rec = recommendations[selectedPath] || recommendations.general;

        resultBox.innerHTML =
            "<h3>" + rec.icon + " Your Recommended Path: " + rec.title + "</h3>" +
            "<p>" + rec.text + "</p>" +
            "<hr>" +
            "<p><strong>Experience Level Entered:</strong> " + expLevel + "</p>" +
            "<p><strong>Interests Selected:</strong> " +
                (interestList.length > 0 ? interestList.join(", ") : "None selected") +
            "</p>" +
            "<p><em>Head over to the <a href='learning-paths.html'>Learning Paths</a> page for step-by-step guidance!</em></p>";

        resultBox.style.display   = "block";
        resultBox.style.opacity   = "0";
        resultBox.style.transform = "translateY(20px)";
        resultBox.style.transition = "opacity 0.55s ease, transform 0.55s ease";

        void resultBox.offsetHeight;

        resultBox.style.opacity   = "1";
        resultBox.style.transform = "translateY(0)";

        resultBox.scrollIntoView({ behavior: "smooth", block: "start" });
    }

});