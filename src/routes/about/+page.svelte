<!-- routes/about/+page.svelte -->
<div class="blog">
  <div class="content">
    <header class="blog-header">
      <div class="header-content">
        <h1 class="blog-title">¬0</h1>
      </div>
      <div class="divider"></div>
      <a href="/" class="home-link">Home</a>
    </header>

    <main class="about-content">
      <p class="about-text">
        Hello, I am Mithil. I like math, programming, and design.
      </p>
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
  }
</style>