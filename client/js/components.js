/* components/navbar.js — inject navbar & footer into every page */
(function () {
  const NAV_HTML = `
  <nav class="navbar">
    <a href="/" class="nav-brand">Scholar<span>Path</span> 🎓</a>
    <div class="nav-links" id="nav-links">
      <a href="/index.html"          class="nav-link" data-page="index">Home</a>
      <a href="/pages/find.html"     class="nav-link" data-page="find">Find Scholarships</a>
      <a href="/pages/matcher.html"  class="nav-link" data-page="matcher">Eligibility Matcher</a>
      <a href="/pages/community.html"class="nav-link" data-page="community">Community</a>
      <a href="/pages/about.html"    class="nav-link" data-page="about">About</a>
    </div>
    <div class="nav-actions" id="nav-actions">
      <button class="theme-btn" onclick="Theme.toggle()" title="Toggle theme">🌙</button>
      <a href="/pages/login.html"    class="nav-login">Log In</a>
      <a href="/pages/register.html" class="nav-signup">Get Started Free</a>
    </div>
    <button class="nav-toggle" onclick="toggleMobileNav()" aria-label="Menu">☰</button>
  </nav>`;

  const FOOTER_HTML = `
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-grid">
        <div class="footer-brand">
          <h3>Scholar<span>Path</span></h3>
          <p>Connecting ambitious students with life-changing scholarship opportunities worldwide. Always free for students.</p>
          <div class="footer-social">
            <button class="social-btn" title="Twitter">𝕏</button>
            <button class="social-btn" title="LinkedIn">in</button>
            <button class="social-btn" title="Instagram">ig</button>
            <button class="social-btn" title="YouTube">▶</button>
          </div>
        </div>
        <div class="footer-col">
          <h4>Platform</h4>
          <ul>
            <li><a href="/pages/find.html">Find Scholarships</a></li>
            <li><a href="/pages/matcher.html">Eligibility Matcher</a></li>
            <li><a href="/pages/community.html">Community Q&A</a></li>
            <li><a href="/pages/org-dashboard.html">Post a Scholarship</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Students</h4>
          <ul>
            <li><a href="/pages/register.html">Create Profile</a></li>
            <li><a href="/pages/dashboard.html">My Dashboard</a></li>
            <li><a href="/pages/find.html">Deadline Tracker</a></li>
            <li><a href="/pages/faq.html">Resources & FAQ</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Organizations</h4>
          <ul>
            <li><a href="/pages/org-dashboard.html">Org Portal</a></li>
            <li><a href="/pages/register.html?role=org">Register Org</a></li>
            <li><a href="/pages/contact.html">Support</a></li>
            <li><a href="/pages/about.html">About Us</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2025 ScholarPath. All rights reserved.</span>
        <span>
          <a href="#">Privacy Policy</a> &nbsp;·&nbsp;
          <a href="#">Terms of Service</a> &nbsp;·&nbsp;
          <a href="/pages/contact.html">Contact</a>
        </span>
      </div>
    </div>
  </footer>`;

  function toggleMobileNav() {
    const links = document.getElementById('nav-links');
    if (links) links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
  }
  window.toggleMobileNav = toggleMobileNav;

  document.addEventListener('DOMContentLoaded', () => {
    // Inject navbar
    const navEl = document.getElementById('navbar-placeholder');
    if (navEl) navEl.outerHTML = NAV_HTML;

    // Inject footer
    const footerEl = document.getElementById('footer-placeholder');
    if (footerEl) footerEl.outerHTML = FOOTER_HTML;

    // Toast container
    if (!document.getElementById('toast-container')) {
      const tc = document.createElement('div');
      tc.id = 'toast-container';
      document.body.appendChild(tc);
    }
  });
})();
