/* =========================================================
   Lumenreel — Simulated Reel Entertainment
   Lightweight, dependency-free interactions
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById("navToggle");
  var primaryNav = document.getElementById("primaryNav");

  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = primaryNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Close nav after clicking an in-page link on mobile
    var navLinks = primaryNav.querySelectorAll("a");
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        if (primaryNav.classList.contains("is-open")) {
          primaryNav.classList.remove("is-open");
          navToggle.setAttribute("aria-expanded", "false");
        }
      });
    });

    // Close nav when resizing up to desktop
    var mq = window.matchMedia("(min-width: 721px)");
    var handleMQ = function (e) {
      if (e.matches) {
        primaryNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    };
    if (mq.addEventListener) {
      mq.addEventListener("change", handleMQ);
    } else if (mq.addListener) {
      mq.addListener(handleMQ);
    }
  }

  /* ---------- Smooth internal anchor behavior ---------- */
  // Native CSS scroll-behavior handles most cases. We add a small offset
  // for the sticky header so anchors land just below it.
  var header = document.querySelector(".site-header");
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#" || targetId.length < 2) return;

      var target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      var headerOffset = header ? header.getBoundingClientRect().height : 0;
      var rect = target.getBoundingClientRect();
      var top = rect.top + window.pageYOffset - headerOffset - 8;

      if (prefersReducedMotion) {
        window.scrollTo(0, top);
      } else {
        window.scrollTo({ top: top, behavior: "smooth" });
      }

      // Move focus to target for accessibility without causing another jump
      if (target.hasAttribute("tabindex") === false) {
        target.setAttribute("tabindex", "-1");
      }
      target.focus({ preventScroll: true });
    });
  });

  /* ---------- FAQ accordion enhancement ----------
     <details>/<summary> already works natively. We add a small
     enhancement: only one FAQ item stays open at a time, for a
     calmer browsing experience.
  */
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (item.open) {
        faqItems.forEach(function (other) {
          if (other !== item && other.open) {
            other.open = false;
          }
        });
      }
    });
  });

  /* ---------- Subtle reel animation nudge ----------
     The reels scroll continuously via CSS. We add a small, respectful
     "nudge" when the hero first becomes visible, so the reels feel
     responsive on load without any flashy effect.
  */
  var reels = document.querySelectorAll(".reel");
  if (reels.length && !prefersReducedMotion && "IntersectionObserver" in window) {
    var reelObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var track = entry.target.querySelector(".reel-track");
          if (!track) return;

          var originalAnim = getComputedStyle(track).animationDuration;
          // Temporarily speed up reel slightly for ~0.8s, then restore.
          track.style.transition = "none";
          track.style.animationDuration = "1.2s";
          setTimeout(function () {
            track.style.animationDuration = originalAnim;
          }, 800);

          reelObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    reels.forEach(function (r) { reelObserver.observe(r); });
  }

  /* ---------- Contact form (static demo) ---------- */
  var form = document.querySelector(".contact-form");
  var formNote = document.getElementById("formNote");

  if (form && formNote) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = form.querySelector("#cName");
      var email = form.querySelector("#cEmail");
      var message = form.querySelector("#cMessage");

      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        formNote.textContent = "Please complete all required fields before sending.";
        return;
      }

      // Very simple email sanity check
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      if (!emailOk) {
        formNote.textContent = "Please enter a valid email address.";
        return;
      }

      formNote.textContent =
        "Thank you. This is a static demonstration form, so no message was actually sent.";
      form.reset();
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
