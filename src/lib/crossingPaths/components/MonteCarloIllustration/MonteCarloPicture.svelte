<script lang="ts">
    const diagram = {
      src: '/monte_carlo_diagram.png',
      caption: 'Monte Carlo sampling: Recording positions (green X marks) at different times to approximate the actual paths (black curves). Like the robot doll taking snapshots in Red Light, Green Light, more samples give us a better approximation of the true paths.'
    };
  </script>
  
  <div class="diagram-container">
    <img 
      src={diagram.src} 
      alt={diagram.caption}
      class="diagram-image"
    />
    <p class="diagram-caption">{diagram.caption}</p>
  </div>
  
  <style>
    .diagram-container {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
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
  </style>