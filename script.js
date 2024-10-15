var gridImages= document.querySelectorAll('.grid-image');
gridImages.forEach((gridImage) => gridImage.addEventListener('mouseover', playVideo));
gridImages.forEach((gridImage) => gridImage.addEventListener('mouseleave', stopVideo));

function playVideo(event){
    //const image = event.target;
    //image.style.width = "105%";
    var image = event.target;
    var gridImage = image.closest('.grid-image');
    const videoElement = gridImage.querySelector('.video');
    videoElement.style.display = 'block';
    videoElement.style.clipPath = 'polygon(30% 0, 100% 0, 100% 70%, 70% 100%, 0 100%, 0 30%)';
    videoElement.style.borderRadius = '15%';
    videoElement.play(); // Play the video on hover
    videoElement.style.transform = 'scale(1.1)';
}
function stopVideo(event){
    var image = event.target;
    var gridImage = image.closest('.grid-image');
    const videoElement = gridImage.querySelector('.video');
    console.log(videoElement);
    videoElement.style.display = 'none';
    videoElement.style.clipPath = 'polygon(100% 0, 100% 100%, 0 100%, 0 0)';
    videoElement.pause(); // Pause the video when not hovering
    image.style.transform = 'scale(1)'; // Reset scale
}

var cursor = {
    delay: 8,
    _x: 0,
    _y: 0,
    endX: (window.innerWidth / 2),
    endY: (window.innerHeight / 2),
    cursorVisible: true,
    cursorEnlarged: false,
    $dot: document.querySelector('.cursor-dot'),
    $outline: document.querySelector('.cursor-dot-outline'),
    $cursorEye: document.querySelector('.cursor-eye'),
    
    init: function() {
        // Set up element sizes
        this.dotSize = this.$dot.offsetWidth;
        this.outlineSize = this.$outline.offsetWidth;
        
        this.setupEventListeners();
        this.animateDotOutline();
    },
    
    setupEventListeners: function() {
        var self = this;

        // Anchor hovering
        gridImages.forEach(function(el) {
            el.addEventListener('mouseover', function() {
                self.cursorEnlarged = true;
                self.toggleCursorSize();
            });
            el.addEventListener('mouseout', function() {
                self.cursorEnlarged = false;
                self.toggleCursorSize();
            });
        });
  
  
        document.addEventListener('mousemove', function(e) {
            // Show the cursor
            self.cursorVisible = true;
            self.toggleCursorVisibility();
            
            // Position the dot
            self.endX = e.pageX;
            self.endY = e.pageY;
            self.$dot.style.top = self.endY + 'px';
            self.$dot.style.left = self.endX + 'px';
        });
    },
    
    animateDotOutline: function() {
        var self = this;

            self._x += (self.endX - self._x) / self.delay;
            self._y += (self.endY - self._y) / self.delay;
            self.$outline.style.top = self._y + 'px';
            self.$outline.style.left = self._x + 'px';
            
            requestAnimationFrame(this.animateDotOutline.bind(self));
    },
    
    toggleCursorSize: function() {
        var self = this;
        
        if (self.cursorEnlarged) {
            self.$dot.style.transform = 'translate(-50%, -50%) scale(0.75)';
            self.$dot.style.backgroundColor = 'black';
            self.$cursorEye.style.display = 'block';
            self.$outline.style.transform = 'translate(-50%, -50%) scale(1.25)';
            self.$outline.style.backgroundColor = 'black';
        } else {
            self.$dot.style.transform = 'translate(-50%, -50%) scale(1)';
            self.$dot.style.backgroundColor = '#fff679';
            self.$cursorEye.style.display = 'none';
            self.$outline.style.transform = 'translate(-50%, -50%) scale(1)';
            self.$outline.style.backgroundColor = 'rgba(255, 246, 121, 0.2)';
        }
    },
    
    toggleCursorVisibility: function() {
        var self = this;
        
        if (self.cursorVisible) {
            self.$dot.style.opacity = 1;
            self.$outline.style.opacity = 1;
        } else {
            self.$dot.style.opacity = 0;
            self.$outline.style.opacity = 0;
        }
    }
}

cursor.init();


// ---------------------------------------------------------------------------
const radioButtons = document.querySelectorAll('input[name="sort"]');
const gridElements = document.querySelectorAll('.grid-element');

  radioButtons.forEach(radio => {
    radio.addEventListener('change', function() {
      const selectedCategory = this.value;

      gridElements.forEach(element => {
        // If "All" is selected, show all grid elements
        if (selectedCategory === 'all') {
          element.style.display = 'block';
        } else {
          // Show only the elements that match the selected category
          const category = element.getAttribute('data-category');
          if (category === selectedCategory) {
            element.style.display = 'block';
          } else {
            element.style.display = 'none';
          }
        }
      });
    });
  });

const myRequest = new Request('https://raw.githubusercontent.com/klandrove/interactive-replica/refs/heads/main/data.json');

fetch(myRequest, { method: 'GET'})
.then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
})
.then(data => {
  const gridContainer = document.getElementById('grid-container');

      data.forEach(item => {
        const gridElement = document.createElement('div');
        gridElement.classList.add('grid-element');
        gridElement.setAttribute('data-category', item.category);

        const gridImage = document.createElement('div');
        gridImage.classList.add('grid-image');

        const img = document.createElement('img');
        img.src = item.imageUrl;
        img.alt = item.caption;
        gridImage.appendChild(img);

        const video = document.createElement('video');
        video.classList.add('video');
        video.loop = true;
        video.muted = true;
        const videoSource = document.createElement('source');
        videoSource.src = item.videoUrl;
        videoSource.type = 'video/mp4';
        video.appendChild(videoSource);
        gridImage.appendChild(video);

        const caption = document.createElement('p');
        caption.classList.add('grid-caption');
        caption.textContent = item.caption;

        const subcaption = document.createElement('p');
        subcaption.classList.add('grid-subcaption');
        subcaption.innerHTML = item.subcaption;

        gridElement.appendChild(gridImage);
        gridElement.appendChild(caption);
        gridElement.appendChild(subcaption);

        gridContainer.appendChild(gridElement);
      });
    })
.catch(error => console.error('Error fetching the data:', error));

