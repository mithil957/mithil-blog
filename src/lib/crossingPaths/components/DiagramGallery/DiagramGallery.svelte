<script lang="ts">
    const diagrams = [
      {
        src: '/orientation_diagram.png',
        caption: 'Orientation of three points: Clockwise, Counterclockwise, or Collinear'
      },
      {
        src: '/intersection_diagram.png',
        caption: 'Two line segments intersecting at a point'
      },
      {
        src: '/collinear_diagram.png',
        caption: 'Special case: Points are collinear'
      }
    ];
  </script>
  
  <div class="gallery">
    {#each diagrams as diagram}
      <div class="diagram-container">
        <img 
          src={diagram.src} 
          alt={diagram.caption}
          class="diagram-image"
        />
        <p class="diagram-caption">{diagram.caption}</p>
      </div>
    {/each}
  </div>
  
  <style>
    .gallery {
      display: flex;
      flex-wrap: wrap;
      gap: 2rem;
      justify-content: center;
      width: 100%;
      padding: 1rem 0;
    }
  
    .diagram-container {
      flex: 1;
      min-width: 250px;
      max-width: 400px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  
    .diagram-image {
      width: 100%;
      height: auto;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  
    .diagram-caption {
      margin-top: 0.75rem;
      text-align: center;
      font-size: 0.9rem;
      color: #666;
      max-width: 90%;
      line-height: 1.4;
    }
  
    @media (max-width: 768px) {
      .diagram-container {
        min-width: 200px;
      }
    }
  </style>