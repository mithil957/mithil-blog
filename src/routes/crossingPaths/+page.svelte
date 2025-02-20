<script lang="ts">
  import GridPaths from "$lib/crossingPaths/components/GridPaths/GridPaths.svelte";
  import PathIntersections from "$lib/crossingPaths/components/PathIntersections/PathIntersections.svelte";
  import DiagramGallery from "$lib/crossingPaths/components/DiagramGallery/DiagramGallery.svelte";
  import MonteCarloIllustration from "$lib/crossingPaths/components/MonteCarloIllustration/MonteCarloPicture.svelte";
  import MonteCarloSimulation from "$lib/crossingPaths/components/MonteCarloSimulation/MonteCarloSimulation.svelte";
  import PolygonMethod from "$lib/crossingPaths/components/PolygonMethod/PolygonMethod.svelte";
</script>

<div class="blog-post">
  <div class="content">
    <header class="blog-header">
      <h1 class="blog-title">¬0</h1>
      <div class="divider"></div>
      <a href="/" class="home-link">Home</a>
    </header>

    <article class="post-content">
      <h2 class="post-title">Crossing paths, will it happen?</h2>
      <br>
      <!-- Introduction -->
      <p class="section-text">
        When did you last cross paths with an old friend? With someone
        unexpected? How did you feel? Maybe you said it's a small world and
        laughed. Or, remembered the first time you met and shake your head. How
        could it have ever happened? Is it really impossible?
      </p>

      <!-- Simple Crossing -->
      <h2 class="section-title">Simple crossing</h2>
      <p class="section-text">
        We have two people U (you) and SU (someone unexpected). Each starting
        somewhere and following a path until it ends. It's a small world, so
        let's start with a 3 by 3 grid with 2 paths.
      </p>

      <div class="interactive-element">
        <GridPaths />
      </div>

      <p class="section-text">
        It looks like as the world gets bigger, U won't cross paths with SU.
        What happens as the grid size gets bigger?
      </p>

      <div class="table-wrapper">
        <table class="grid-table">
          <thead>
            <tr>
              <th>Grid Size</th>
              <th class="center">Probability</th>
              <th>Runtime</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2 × 2</td>
              <td class="center monospace">370/630 ≈ 0.587</td>
              <td>0 secs</td>
            </tr>
            <tr>
              <td>6 × 6</td>
              <td class="center monospace">222,624/690,900 ≈ 0.322</td>
              <td>1.1 secs</td>
            </tr>
            <tr>
              <td>10 × 10</td>
              <td class="center monospace">7,197,450/26,350,170 ≈ 0.273</td>
              <td>45 secs</td>
            </tr>
            <tr>
              <td>14 × 14</td>
              <td class="center monospace">81,149,616/317,507,400 ≈ 0.256</td>
              <td>9 mins</td>
            </tr>
          </tbody>
        </table>
        <div class="table-caption">Brute force Non-Parallel Python</div>
      </div>

      <p class="section-text">
        The probability of intersection goes down as the world gets bigger. The
        runtime goes way up as well. How many paths do you have?
      </p>

      <ul class="section-text">
        <li>We need a start and end point</li>
        <li>
          There is 9 points on a 2 by 2 grid, 16 points on a 3 by 3 grid -> N by
          N grid has (N+1)² points, P
        </li>
        <li>1 of these points from 9 will be our starting point</li>
        <li>1 of the 8 (9 - 1) points will be our ending point</li>
        <li>9 * 8 = 72 paths -> P * (P - 1) paths, PATHS</li>
        <li>
          You and someone unexpected have a unique path. So you get 1 of the 72
          and SU gets 1 of 71 remaining paths.
        </li>
        <li>
          72 * 71 = 5112 path pairs -> PATHS * (PATHS - 1) path pairs, PAIRS
        </li>
        <li>For every pair, we check if U and SU crossed paths</li>
      </ul>

      <div class="interactive-element">
        <PathIntersections />
      </div>

      <!-- What is a crossing? -->
      <h2 class="section-title">What is a crossing?</h2>

      <div class="interactive-element">
        <DiagramGallery />
      </div>

      <!-- Approximate -->
      <h2 class="section-title">Approximate</h2>
      <p class="section-text">
        That's a lot of path pairs to check and it would take way too much time
        to check them all. Let's cross paths with Stainslaw Ulam, the inventor
        of the Monte Carlo method. Monte Carlo is a way to determine "something"
        by repeated sampling. Think of the game Red Light, Green Light.
      </p>

      <p class="section-text">
        When the large robot doll turns around, instead of making you less
        alive, she records your position. If she turns around twice, she has
        your location at 2 points in time. If we connect these 2 points, that
        might be a bad approximation of how your running path. The more she
        turns around and records your location, the more accurately she can see
        your path.
      </p>

      <div class="interactive-element">
        <MonteCarloIllustration />
      </div>

      <div class="interactive-element">
        <MonteCarloSimulation />
      </div>

      <p class="section-text">
        Monte Carlo matches up with the exact probability calculation. As grid
        size increases, the space (number of path pairs) increases. To get a
        reasonable "vibe" of the space, we should take a good amount of samples.
        Otherwise, our approximation could be wrong.
      </p>

      <!-- Polygons -->
      <h2 class="section-title">Polygons</h2>
      <p class="section-text">
        Let's flip the situation. When is it impossible not to cross paths?
      </p>

      <p class="section-text">
        Polygon method. Your path if extended to the boundary of the world would
        split it into 2 parts. The upper polygon and lower polygon. SU will have
        a start point in "some" part of the upper polygon. This means the paths
        are guaranteed to cross.
      </p>

      <div class="interactive-element">
        <PolygonMethod />
      </div>

      <!-- It's a small world -->
      <h2 class="section-title">It's a small world</h2>
      <p class="section-text">
        Now we can count all the ways in which your paths are crossed. How does
        this number grow as the world gets bigger and bigger? Can it keep up?
        The complementary area, which is a set of points, in the upper polygon
        is proportional to x² The lower polygon has an area, which is a set of
        points, that is proportional to x² Crossing these two areas would be
        proportional to x⁴ (x² * x²) In order to describe your path, we need x1,
        y1, x2, y2 Each of these variables can range from 0 to N The number of
        line segments is proportional to x⁴ The number of intersections grows
        proportional to x⁸ (x⁴ * x⁴) The growth of the path pairs grows
        proportional to x⁸ as well When the grid size grows to infinity, we get
        a non-zero probability of intersection! It really is a small world.
      </p>

      <!-- Further exploration -->
      <h2 class="section-title">Further exploration</h2>
      <ul class="section-text">
        <li>
          Probability of intersection if we pick points on the surface of a
          sphere or cube
        </li>
        <li>
          Is the probability of one space equal to another space? For example,
          rectangle and the surface of a cylinder
        </li>
        <li>What if your path is not a straight line?</li>
      </ul>
    </article>
  </div>
</div>

<style>
  .content {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  .blog-header {
    margin-bottom: 0rem;
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
    margin: 0.5rem 0 0.5rem 0;
  }

  .post-title {
    font-family: "IBM Plex Mono", monospace;
    font-size: 2.5rem;
    font-weight: 600;
    color: #ffffff;
    margin: 0;
    line-height: 1.2;
  }

  .content {
    width: 100%;
    max-width: 800px;
    padding: 0 2rem;
    margin: 0 auto;
  }

  .blog-post {
    min-height: 100vh;
    background-color: #1a1a1a;
  }

  .content {
    width: 100%;
    max-width: 800px;
    padding: 4rem 2rem;
    margin: 0 auto;
  }

  .post-content {
    font-family: "Poppins", sans-serif;
    font-size: 1.1rem;
    font-weight: 400;
  }

  .section-title {
    font-family: "Poppins", sans-serif;
    font-size: 1.5rem;
    font-weight: 600;
    margin: 2.5rem 0 1rem 0;
    color: #ffffff;
  }

  .section-text {
    font-family: "Poppins", sans-serif;
    font-weight: 400;
    margin: 0 0 1.5rem 0;
    color: #e0e0e0;
  }

  .interactive-element {
    background-color: #2a2a2a;
    border-radius: 8px;
    padding: 2rem;
    margin: 2rem 0;
    width: 100%;
    min-height: 300px;
  }

  .table-wrapper {
    background-color: #2a2a2a;
    border-radius: 8px;
    padding: 2rem;
    margin: 2rem 0;
    overflow-x: auto;
  }

  .grid-table {
    width: 100%;
    border-collapse: collapse;
    color: #e0e0e0;
  }

  .grid-table th {
    padding: 1rem;
    border-bottom: 2px solid #404040;
    text-align: left;
  }

  .grid-table td {
    padding: 1rem;
    border-bottom: 1px solid #404040;
  }

  .grid-table td.monospace {
    font-family: "IBM Plex Mono", monospace;
    color: #b3b3b3;
  }

  .table-caption {
    margin-top: 1rem;
    color: #b3b3b3;
    font-style: italic;
    text-align: center;
  }

  @media (max-width: 768px) {
    .content {
      padding: 1rem;
    }

    .post-title {
      font-size: 2rem;
    }
  }
</style>
