<!-- routes/about/+page.svelte -->
<script>
  // You'll need to update these URLs with your actual profile links
  const socialLinks = {
    github: "https://github.com/mithil957",
    linkedin: "https://www.linkedin.com/in/mithil-viradia/"
  };
</script>

<div class="blog">
  <div class="content">
    <header class="blog-header">
      <div class="header-content">
        <h1 class="blog-title">¬0</h1>
      </div>
      <div class="divider"></div>
      <div class="nav-links">
        <a href="/" class="home-link">Home</a>
      </div>
    </header>

    <main class="about-content">
      <p class="about-text">
        Hello, I am Mithil. I like math, programming, and design.
      </p>
      
      <div class="social-links">
        <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" class="social-link" aria-label="GitHub">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="social-icon">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
        </a>
        <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" class="social-link" aria-label="LinkedIn">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="social-icon">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
            <rect x="2" y="9" width="4" height="12"></rect>
            <circle cx="4" cy="4" r="2"></circle>
          </svg>
        </a>
      </div>
    </main>
  </div>
</div>

<style>
  .blog {
    min-height: 100vh;
    background-color: #1a1a1a;
  }

  .content {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  .blog-header {
    margin-bottom: 2rem;
  }

  .blog-title {
    font-family: "IBM Plex Mono", monospace;
    font-size: 4rem;
    font-weight: 600;
    color: #ffffff;
    margin: 0;
  }

  .divider {
    height: 2px;
    background-color: #ff7f50;
    margin: 1rem 0;
    width: 100%;
  }

  .nav-links {
    display: flex;
    align-items: center;
  }

  .home-link {
    font-family: "Poppins", sans-serif;
    font-weight: 300;
    color: #e0e0e0;
    text-decoration: none;
    display: block;
    margin: 0.5rem 0;
    transition: color 0.2s ease;
  }

  .home-link:hover {
    color: #ff7f50;
  }

  .about-content {
    margin-top: 3rem;
  }

  .about-text {
    font-family: "Poppins", sans-serif;
    font-size: 1.5rem;
    font-weight: 400;
    color: #e0e0e0;
    line-height: 1.6;
    margin: 0;
  }

  .social-links {
    display: flex;
    gap: 1.5rem;
    margin-top: 2rem;
  }

  .social-link {
    color: #e0e0e0;
    transition: color 0.2s ease;
  }

  .social-link:hover {
    color: #ff7f50;
  }

  .social-icon {
    width: 28px;
    height: 28px;
  }

  @media (max-width: 768px) {
    .content {
      padding: 1rem;
    }

    .blog-title {
      font-size: 3rem;
    }

    .about-text {
      font-size: 1.2rem;
    }

    .social-icon {
      width: 24px;
      height: 24px;
    }
  }
</style>