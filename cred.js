/* CRED-style motion layer. Loaded after script.js. Safe to remove. */
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* 1. Buttery smooth scrolling (Lenis), if the library loaded */
  if (!reduce && window.Lenis) {
    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    window.__lenis = lenis;
  }

  /* 2. Headlines: split into masked words, last word in serif italic */
  const heads = document.querySelectorAll("main h2, .club h3");
  heads.forEach(h => {
    if (h.children.length) return;               // leave headings with markup alone
    const words = h.textContent.trim().split(/\s+/);
    h.setAttribute("aria-label", h.textContent.trim());
    h.innerHTML = words.map((w, i) => {
      const accent = i === words.length - 1 && words.length > 2 ? ' class="c-accent"' : "";
      return `<span class="cw" aria-hidden="true"><span${accent} style="transition-delay:${i * 60}ms">${w}</span></span>`;
    }).join(" ");
    h.classList.add("c-split");
    h.classList.remove("reveal", "in");
    h.style.transitionDelay = "";
  });
  if (reduce || !("IntersectionObserver" in window)) {
    heads.forEach(h => h.classList.add("c-in"));
  } else {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("c-in"); io.unobserve(e.target); }
    }), { threshold: 0.2, rootMargin: "0px 0px -8% 0px" });
    heads.forEach(h => io.observe(h));
  }

  /* 3. Scroll-scrubbed manifesto text: words light up as you scroll */
  const scrubs = [...document.querySelectorAll(".scrub")];
  scrubs.forEach(p => {
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(t => {
            if (!t) return;
            if (/^\s+$/.test(t)) frag.appendChild(document.createTextNode(t));
            else { const s = document.createElement("span"); s.className = "sw"; s.textContent = t; frag.appendChild(s); }
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(p);
    p._w = [...p.querySelectorAll(".sw")];
  });

  /* 4. Hero: content eases back and fades as you scroll away */
  const hero = document.querySelector(".h-hero .h-center");

  /* 5. Header hides on scroll down, returns on scroll up */
  const header = document.getElementById("site-header");
  let lastY = scrollY;

  const onScroll = () => {
    const vh = innerHeight, y = scrollY;
    if (hero && !reduce) {
      const p = Math.min(Math.max(y / (vh * 0.9), 0), 1);
      hero.style.transform = `translate3d(0,${p * 60}px,0) scale(${1 - p * 0.12})`;
      hero.style.opacity = String(1 - p * 0.9);
    }
    scrubs.forEach(p => {
      const r = p.getBoundingClientRect();
      const prog = reduce ? 1 : Math.min(Math.max((vh * 0.82 - r.top) / (r.height + vh * 0.3), 0), 1);
      const lit = Math.round(prog * p._w.length);
      p._w.forEach((w, i) => w.classList.toggle("on", i < lit));
    });
    if (header && !(header.classList.contains("open"))) {
      header.classList.toggle("c-hide", y > lastY && y > 240);
    }
    lastY = y;
  };
  let ticking = false;
  addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(() => { onScroll(); ticking = false; }); }
  }, { passive: true });
  addEventListener("resize", onScroll);
  onScroll();

  /* 6. Stats count up when they come into view */
  const nums = document.querySelectorAll(".h-stats b");
  if (nums.length && !reduce && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, end = parseFloat(el.dataset.v), dec = (el.dataset.v.split(".")[1] || "").length;
      const t0 = performance.now(), dur = 1400;
      const step = t => {
        const k = Math.min((t - t0) / dur, 1), ease = 1 - Math.pow(1 - k, 4);
        el.textContent = (end * ease).toFixed(dec);
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      io.unobserve(el);
    }), { threshold: 0.6 });
    nums.forEach(n => { n.dataset.v = n.textContent.trim(); n.textContent = (0).toFixed((n.dataset.v.split(".")[1] || "").length); io.observe(n); });
  }

  /* 7. Tiles tilt toward the cursor, like CRED's product cards */
  if (fine && !reduce) {
    const tilt = el => {
      el.addEventListener("pointermove", e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateZ(0)`;
      });
      el.addEventListener("pointerenter", () => { el.style.transitionDelay = "0ms"; });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    };
    const sel = ".icard, .news, .h-stats > div, .hstep, .step";
    document.querySelectorAll(sel).forEach(tilt);
    // cards rendered later by script.js
    new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => {
      if (n.nodeType === 1 && n.matches(sel)) tilt(n);
    }))).observe(document.querySelector("main") || document.body, { childList: true, subtree: true });
  }

  /* 8. Big outlined wordmark in the footer */
  const foot = document.querySelector("footer");
  if (foot && !foot.querySelector(".c-footmark")) {
    const m = document.createElement("span");
    m.className = "c-footmark"; m.setAttribute("aria-hidden", "true"); m.textContent = "COLS Skyward";
    foot.prepend(m);
  }
})();
