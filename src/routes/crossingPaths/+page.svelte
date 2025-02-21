<script lang="ts">
  import GridPaths from "$lib/crossingPaths/components/GridPaths/GridPaths.svelte";
  import PathIntersections from "$lib/crossingPaths/components/PathIntersections/PathIntersections.svelte";
  import DiagramGallery from "$lib/crossingPaths/components/DiagramGallery/DiagramGallery.svelte";
  import MonteCarloIllustration from "$lib/crossingPaths/components/MonteCarloIllustration/MonteCarloPicture.svelte";
  import MonteCarloSimulation from "$lib/crossingPaths/components/MonteCarloSimulation/MonteCarloSimulation.svelte";
  import PolygonMethod from "$lib/crossingPaths/components/PolygonMethod/PolygonMethod.svelte";
  import Math from "$lib/Math.svelte";
</script>

<div class="blog-post">
  <div class="content">
    <header class="blog-header">
      <h1 class="blog-title">¬0</h1>
      <div class="divider"></div>
      <a href="/" class="home-link">Home</a>
    </header>

    <article class="post-content">
      <h2 class="post-title">Crossing paths</h2>
      <br />
      <!-- Introduction -->
      <p class="section-text">
        When did you last cross paths with an old friend? With someone
        unexpected? Something about it feels impossible, you say it's a small
        world and catch up. How could it have ever happened? Is it really?
      </p>

      <!-- Simple Crossing -->
      <h2 class="section-title">Simple world</h2>
      <p class="section-text">
        We will have a simple model. The world will be a
        square of size <Math math="N \times N" />. We have two people <Math
          math="\mathcal<U>"
        /> (you) and <Math math="\mathcal<SU>" /> (someone unexpected). Each starting
        somewhere and following a path until it ends. The start and end points will
        be lattice points (integer coordinates). For example, <Math
          math="(2,4)"
        /> is a lattice point but <Math math="(6.8, 4)" /> is not. What will happen
        to the probability of intersection as <Math math="N" /> (the world) gets
        bigger?
      </p>

      <div class="interactive-element">
        <GridPaths />
      </div>

      <p class="section-text">
        Let's start with understanding the space of possibilities.
      </p>

      <div class="section-text math-blocks">
        <div class="math-block">
          <h3>Number of Points</h3>
          <p>Let's start by counting the points on different sized grids</p>
          <ul>
            <li>
              <Math math="4" /> points on a <Math math="1 \times 1" /> grid
            </li>
            <li>
              <Math math="9" /> points on a <Math math="2 \times 2" /> grid
            </li>
            <li>
              <Math math="16" /> points on a <Math math="3 \times 3" /> grid
            </li>
            <li>
              <Math math="(N+1)^2" /> points on a <Math math="N \times N" /> grid
            </li>
          </ul>
          <p>We will call this set of points <Math math="\mathcal<P>" /></p>
        </div>

        <div class="math-block">
          <h3>Defining a Path</h3>
          From <Math math="\mathcal<P>" />, we select
          <ul>
            <li>A starting point <Math math="A" /></li>
            <li>
              An ending point <Math math="B" /> from the remaining <Math
                math="|\mathcal<P>| - 1"
              /> points
            </li>
          </ul>
          This gives us the following number of possible paths:
          <ul>
            <li>
              <Math math="|\mathcal<P>| \cdot (|\mathcal<P>| - 1)" /> if <Math
                math="AB"
              /> is different from <Math math="BA" />
            </li>
            <li>
              <Math math="\frac<|\mathcal<P>| \cdot (|\mathcal<P>| - 1)><2>" /> if
              <Math math="AB" /> is the same as <Math math="BA" />
            </li>
          </ul>
          <p>
            We will call this set of paths (line segments) <Math
              math="\mathcal<L>"
            />
          </p>
        </div>

        <div class="math-block">
          <h3>Path Pairs</h3>
          <p>For two people to cross paths, we need</p>
          <ul>
            <li>
              Your path <Math math="L_u" /> selected from <Math
                math="\mathcal<L>"
              />
            </li>
            <li>
              Someone unexpected's path <Math math="L_<su>" /> selected from the
              remaining <Math math="|\mathcal<L>| - 1" /> paths
            </li>
          </ul>
          <p>
            This gives us <Math
              math="\frac<|\mathcal<L>| \cdot (|\mathcal<L>| - 1)><2>"
            /> possible path pairs. We call this set of path pairs <Math
              math="\mathcal<LP>"
            />
          </p>
        </div>

        <div class="math-block">
          <h3>Intersection Probability</h3>
          For every pair in <Math math="\mathcal<LP>" />, we check if <Math
            math="L_u"
          /> intersects with <Math math="L_<su>" /> and count it up
          <p class="probability-equation">
            <Math
              math="\frac<\text<\# of intersections>><\text<\# of line pairs>>"
            /> = <Math math="P(\text<intersection>)" />
          </p>
        </div>
      </div>

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
        The number of possible line pairs is growing quite fast. The time it
        takes to check all the line pairs for intersection is also growing quite
        large. The probability is going down. Will <Math math="L_u" /> and <Math
          math="L_<su>"
        /> not cross paths? 😢
      </p>

      <div class="interactive-element">
        <PathIntersections />
      </div>

      <p class="section-text">
        In the visualization above, we can see how the space of intersections
        looks. The bottom grid represents <Math math="\mathcal<LP>" />. The axes
        of the grid represents <Math math="\mathcal<L>" /> (all the lines). So the
        cell at <Math math="(1, 3)" /> represents picking the first line from <Math
          math="\mathcal<L>"
        />, which is
        <Math math="L_1" /> and picking the third line from <Math
          math="\mathcal<L>"
        />, which is
        <Math math="L_3" />. So the grid represents picking every possible pair
        of lines and this is exactly what
        <Math math="\mathcal<LP>" /> is. If the cell is white, then an intersection
        occurred. We won't count pairs where <Math math="L_u" /> and <Math
          math="L_<su>"
        /> are the same line - this is why the diagonal is all black.
      </p>

      <!-- What is a crossing? -->
      <h2 class="section-title">What is a crossing?</h2>

      <p class="section-text">
        Your line has 2 points <Math math="A" /> and <Math math="B" />. Take a
        look at the first diagram. <Math math="\overline<AB>" /> has a slope, <Math
          math="S_<ab>"
        />. The point C is
        <b>counterclockwise</b>
        to <Math math="\overline<AB>" /> because <Math math="S_<bc>" />
        is greater than <Math math="S_<ab>" />. The point D is <b>collinear</b>
        to <Math math="\overline<AB>" /> because <Math math="S_<bd>" />
        equals <Math math="S_<ab>" />. The point E is <b>clockwise</b> to <Math
          math="\overline<AB>"
        /> because <Math math="S_<be>" /> is less than <Math math="S_<ab>" />.
        Think of it as riding a bike along the line <Math
          math="\overline<AB>"
        /> and then turning towards the target point, C, D, or E. The way you turn
        decides your orientation. We can use this to figure out if two lines intersect.
        <br />
        <br />
        Take a look at the second diagram. When the gray line is not intersecting,
        its orientation to point A is clockwise. Its orientation to point B is also
        clockwise. Imagine the gray line is sliding down to the left. When it crosses
        B, the orientation to B will become counterclockwise! This means <Math
          math="A"
        /> and <Math math="B" />
        have to be on different sides of the gray line. Also, the gray points have
        to be on different sides of <Math math="\overline<AB>" />.

        <br />
        <br />
        Take a look at the third diagram. If the point is collinear with <Math
          math="\overline<AB>"
        />, then we just need to check if the point is on the line segment.
      </p>

      <div class="interactive-element">
        <DiagramGallery />
      </div>

      <!-- Approximate -->
      <h2 class="section-title">Approximate</h2>
      <p class="section-text">
        There is a lot of path pairs to check for intersection and it would take
        way too much time to check them all as the grid gets very large. Let's
        cross paths with Stainslaw Ulam, the inventor of the Monte Carlo method.
        Monte Carlo is a way to determine "something" by repeated sampling. 
        In our case, "something" is the probability of intersection.
        Think of the game Red Light, Green Light from Squid Games or childhood.
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
        We pick 2 paths at random and see if they intersect. Monte Carlo gets
        close to the exact probability as we get more samples. As the grid size
        increases, the space (number of path pairs) increases. To get a
        reasonable "vibe" of the space, we should take a good amount of samples.
        Otherwise, our approximation could be wrong.
        <br />
        <br />
        As the grid gets big, it looks like the approximate probability is approaching
        some value. What could it be 🤔
      </p>

      <!-- Polygons -->
      <h2 class="section-title">Polygons</h2>
      <p class="section-text">
        Checking every possible path pair becomes impractical. At grid size 20,
        we will have 30 billions pairs to check! Monte Carlo only gives us
        approximations. Let's flip our prespective. When is it impossible for
        paths not to cross?
      </p>

      <p class="section-text">
        What happens when we extend your path <Math math="L_U" /> to the boundaries
        of our grid world? This line naturally divides the space into two regions
        - the upper polygon (blue) and the lower polygon (orange). If someone unexpected
        <Math math="L_<SU>" /> starts their path from a point <Math
          math="P_a"
        /> in the upper polygon, we can calculate a complementary region of points
        <Math math="C" /> in the lower polygon. Play with the visualization below,
        you can see this as the yellow colored points. Creating a path from <Math
          math="P_a"
        /> to any point in <Math math="C" /> will guarantee an intersection! This
        will work no matter which polygon we pick a point from.
      </p>

      <div class="section-text math-blocks">
        <div class="math-block">
          <h3>Polygon Method Steps</h3>
          <p>
            Instead of checking every possible path pair for intersection, we
            can:
          </p>
          <ul>
            <li>Take any possible path <Math math="L_U" /></li>
            <li>
              Extend the path to the grid boundaries and identify the two
              polygons
            </li>
            <li>
              Go through every point <Math math="P_i" /> in one of the polygons
            </li>
            <li>
              Count how many points are in the complementary region of points <Math
                math="C"
              />
            </li>
          </ul>
        </div>
      </div>

      <p class="section-text">
        This method transforms our problem from finding actual intersections to
        finding guaranteed ones, making our calculations much more manageable
        for larger grids.
      </p>

      <div class="interactive-element">
        <PolygonMethod />
      </div>

      <h2 class="section-title">It's a small world</h2>

      <p class="section-text">
        Now we can count all the ways in which paths are guaranteed to cross.
        But what happens to this number as our world grows larger and larger?
        Can the number of non-intersecting paths keep up with the growth of
        intersecting ones?
      </p>

      <div class="math-block section-text">
        <h3>Growth of Possible Paths</h3>
        <p>First, let's understand how many possible paths exist:</p>
        <ul>
          <li>
            Each path needs four coordinates: <Math
              math="(x_1, y_1, x_2, y_2)"
            />
          </li>
          <li>
            Each coordinate can range from <Math math="0" /> to <Math
              math="N"
            />
          </li>
          <li>
            Therefore, the number of possible line segments grows proportional
            to <Math math="N^4" />
          </li>
        </ul>
      </div>

      <div class="math-block section-text">
        <h3>Counting Intersections</h3>
        <p>Using the polygon method, we can count intersections:</p>
        <ul>
          <li>
            For a given path <Math math="L_U" />, we pick one of the polygons <Math math="H" /> which has 
            number of points proportional to <Math math="N^2" />
          </li>
          <li>
            For each point in <Math math="H" />, we have the number of valid intersection
            points in the complementary region <Math math="C" /> which is proportional to <Math math="N^2" />
          </li>
          <li>
            The number of intersecting lines is proportional to (# of points in <Math math="H" />) × (# of points in <Math math="C" />) <Math math="\propto<N^4>" /> 
          </li>
          <li>
            This gives us <Math math="N^4" /> (choosing the first line) × <Math
              math="N^4"
            /> (intersecting lines)
          </li>
          <li>
            The total growth of intersections is proportional to <Math
              math="N^8"
            />
          </li>
        </ul>
      </div>

      <div class="math-block section-text">
        <h3>Why the World Stays Small</h3>
        <ul>
          <li>
            Total possible path pairs grow proportional to <Math math="N^8" />
          </li>
          <li>
            Number of intersecting paths also grows proportional to <Math
              math="N^8"
            />
          </li>
          <li>
            Their ratio (the probability of intersection) approaches a non-zero
            constant
          </li>
          <li>
            Even as <Math math="N \rightarrow \infty" />, there's still a
            significant chance of paths crossing!
          </li>
        </ul>
      </div>

      <p class="section-text">
        We can also think about when paths definitely won't cross. 
        We could calculate an average area of the lower and upper polygon.
        Picking two points from the same polygon would give us a non-intersecting line.
        The area of each region varies based on <Math math="L_U" />, but averaging across all
        possible line segments gives us a lower bound on the probability of
        non-intersection. 
      </p>

      <p class="section-text">
        Even in an infinitely
        large world, the chance of crossing paths never disappears. It really is
        a small world after all ☺️
      </p>

      <!-- Further exploration -->
      <h2 class="section-title">Further exploration</h2>
      <ul class="section-text">
        <li>
          Probability of intersection if we pick points on the surface of a
          sphere or cube?
        </li>
        <li>
          Is the probability of one space equal to another space? For example,
          a rectangle and the surface of a cylinder
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
    color: #e0e0e0;
  }

  .table-caption {
    margin-top: 1rem;
    color: #b3b3b3;
    font-style: italic;
    text-align: center;
  }

  .math-blocks {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .math-block {
    background-color: #2a2a2a;
    border-radius: 8px;
    padding: 1.5rem;
  }

  .math-block h3 {
    font-family: "Poppins", sans-serif;
    font-size: 1.2rem;
    font-weight: 600;
    color: #ffffff;
    margin: 0 0 1rem 0;
  }

  .math-block p {
    margin: 1rem 0;
  }

  .math-block ul {
    list-style: none;
    padding-left: 1rem;
    margin: 0.5rem 0;
  }

  .math-block li {
    margin: 0.5rem 0;
  }

  .probability-equation {
    text-align: center;
    padding: 1rem 0;
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
