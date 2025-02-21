<script lang="ts">
    const diagram = {
      src: '/monte_carlo_diagram.png',
      caption: 'The approximate path gets closer to the actual path with more samples'
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
      font-size: 1.0rem;
      color: #b3b3b3;
      max-width: 90%;
      line-height: 1.4;
    }
  </style>