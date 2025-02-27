<!-- routes/+page.svelte -->
<div class="blog">
  <div class="content">
    <header class="blog-header">
      <div class="header-content">
        <h1 class="blog-title">¬0</h1>
        <a href="/about" class="about-link">About</a>
      </div>
      <div class="divider"></div>
    </header>

    <main class="post-content">
      <h2 class="section-title">Recent Posts</h2>
      
      <div class="post-list">
        <article class="post-item">
          <a href="/crossingPaths" class="post-link">
            <h3 class="post-name">Crossing paths, will it happen?</h3>
            <time class="post-date">Feb 27, 2025 | 8:00 AM</time>
          </a>
        </article>
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

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .blog-title {
    font-family: "IBM Plex Mono", monospace;
    font-size: 4rem;
    font-weight: 600;
    color: #ffffff;
    margin: 0;
  }

  .about-link {
    font-family: "Poppins", sans-serif;
    color: #e0e0e0;
    text-decoration: none;
    font-size: 1.1rem;
    transition: color 0.2s ease;
  }

  .about-link:hover {
    color: #ff7f50;
  }

  .divider {
    height: 2px;
    background-color: #ff7f50;
    margin: 1rem 0;
    width: 100%;
  }

  .section-title {
    font-family: "Poppins", sans-serif;
    font-size: 1.5rem;
    font-weight: 600;
    color: #ffffff;
    margin: 2rem 0 1.5rem 0;
  }

  .post-list {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .post-item {
    border-radius: 8px;
    transition: transform 0.2s ease;
  }

  .post-item:hover {
    transform: translateX(8px);
  }

  .post-link {
    text-decoration: none;
    color: inherit;
  }

  .post-name {
    font-family: "Poppins", sans-serif;
    font-size: 1.3rem;
    font-weight: 500;
    color: #e0e0e0;
    margin: 0 0 0.5rem 0;
  }

  .post-date {
    font-family: "IBM Plex Mono", monospace;
    font-size: 0.9rem;
    color: #b3b3b3;
  }

  @media (max-width: 768px) {
    .content {
      padding: 1rem;
    }

    .blog-title {
      font-size: 3rem;
    }

    .post-name {
      font-size: 1.1rem;
    }
  }
</style>