// Year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile menu toggle
const navToggle = document.querySelector('.nav-toggle');
const primaryNav = document.getElementById('primary-nav');
if (navToggle && primaryNav) {
    const closeMenu = () => {
        primaryNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Ouvrir le menu');
    };
    navToggle.addEventListener('click', () => {
        const isOpen = primaryNav.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        navToggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
    });
    primaryNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && primaryNav.classList.contains('open')) closeMenu();
    });
}

// Wire up Stripe placeholders
// Each "Acheter" button has data-stripe="REMPLACER_LIEN_STRIPE_XX"
// When you have the real Stripe Payment Link, just paste it here in the STRIPE_LINKS map
// OR replace the data-stripe attribute value in the HTML directly.
const STRIPE_LINKS = {
    REMPLACER_LIEN_STRIPE_10:  'https://buy.stripe.com/fZu28r0P0eh55CCbec6Na33',
    REMPLACER_LIEN_STRIPE_20:  'https://buy.stripe.com/cNibJ141c6OD1mm4PO6Na34',
    REMPLACER_LIEN_STRIPE_25:  'https://buy.stripe.com/3cI00japA3Cr0ii5TS6Na35',
    REMPLACER_LIEN_STRIPE_35:  'https://buy.stripe.com/fZu8wP7dogpdghgaa86Na36',
    REMPLACER_LIEN_STRIPE_50:  'https://buy.stripe.com/14A00j69keh5d545TS6Na37',
    REMPLACER_LIEN_STRIPE_60:  'https://buy.stripe.com/9B628r1T48WL4yy5TS6Na38',
    REMPLACER_LIEN_STRIPE_110: 'https://buy.stripe.com/00w8wP69kdd14yyfus6Na39'
};

// Lightbox for screenshots
(function() {
    const triggers = document.querySelectorAll('.screenshots-grid a');
    if (!triggers.length) return;

    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.innerHTML = '<button class="lightbox-close" aria-label="Fermer">&times;</button>' +
                   '<button class="lightbox-nav lightbox-prev" aria-label="Image précédente">&lsaquo;</button>' +
                   '<button class="lightbox-nav lightbox-next" aria-label="Image suivante">&rsaquo;</button>' +
                   '<div class="lightbox-stage"><img class="lightbox-img" alt=""><div class="lightbox-counter"></div></div>';
    document.body.appendChild(lb);

    const lbImg = lb.querySelector('.lightbox-img');
    const lbCounter = lb.querySelector('.lightbox-counter');
    const closeBtn = lb.querySelector('.lightbox-close');
    const prevBtn = lb.querySelector('.lightbox-prev');
    const nextBtn = lb.querySelector('.lightbox-next');

    const images = Array.from(triggers).map(a => ({
        src: a.getAttribute('href'),
        alt: (a.querySelector('img') || {}).alt || ''
    }));
    let currentIndex = 0;

    function show(i) {
        currentIndex = (i + images.length) % images.length;
        lbImg.src = images[currentIndex].src;
        lbImg.alt = images[currentIndex].alt;
        lbCounter.textContent = (currentIndex + 1) + ' / ' + images.length;
    }
    function open(i) {
        show(i);
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
        closeBtn.focus();
    }
    function close() {
        lb.classList.remove('open');
        document.body.style.overflow = '';
    }
    function next() { show(currentIndex + 1); }
    function prev() { show(currentIndex - 1); }

    triggers.forEach((trigger, i) => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            open(i);
        });
    });
    closeBtn.addEventListener('click', close);
    nextBtn.addEventListener('click', next);
    prevBtn.addEventListener('click', prev);
    lb.addEventListener('click', (e) => {
        if (e.target === lb || e.target.classList.contains('lightbox-stage')) close();
    });
    document.addEventListener('keydown', (e) => {
        if (!lb.classList.contains('open')) return;
        if (e.key === 'Escape') close();
        else if (e.key === 'ArrowRight') next();
        else if (e.key === 'ArrowLeft') prev();
    });
})();

document.querySelectorAll('[data-stripe]').forEach(btn => {
    const key = btn.getAttribute('data-stripe');
    const url = STRIPE_LINKS[key];

    if (url) {
        btn.setAttribute('href', url);
    } else {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            alert(
                'Lien Stripe non configuré.\n\n' +
                'Pour activer ce bouton, ajoutez votre lien Stripe ' +
                'dans assets/js/script.js (objet STRIPE_LINKS) ou ' +
                'directement dans l\'attribut data-stripe du bouton.'
            );
        });
    }
});
