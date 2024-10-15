const myRequest = new Request('https://raw.githubusercontent.com/klandrove/interactive-replica/refs/heads/main/data.json');
var allData = [];


fetch(myRequest, { method: 'GET'})
.then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
})
.then(data => {
  allData = data;
  displayData(allData);
})
.catch(error => console.error('Error fetching the data:', error));


function playVideo(event){
    var image = event.target;
    var gridImage = image.closest('.grid-image');
    const videoElement = gridImage.querySelector('.video'); 
    videoElement.play(); // Play the video on hover
}
function stopVideo(event){
    var image = event.target;
    var gridImage = image.closest('.grid-image');
    const videoElement = gridImage.querySelector('.video');
    videoElement.pause(); // Pause the video when not hovering
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
  
        
        var gridImages= document.querySelectorAll('.grid-image');

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
    console.log(selectedCategory);
    var newData = [];
    if(selectedCategory === 'all'){
      newData = allData;
    } else {
      newData = allData.filter(item => item.category === selectedCategory);
    }
    displayData(newData);
  });
});

  

function displayData(data){
  const gridContainer = document.getElementById('grid-container');
  gridContainer.innerHTML = '';
  data.forEach(item => {
    const gridElement = document.createElement('div');
    gridElement.classList.add('grid-element');

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
    subcaption.innerHTML = item.subcaption  + ' &#9679 ' + item.category;

    gridElement.appendChild(gridImage);
    gridElement.appendChild(caption);
    gridElement.appendChild(subcaption);

    gridImage.addEventListener('mouseover', playVideo);
    gridImage.addEventListener('mouseleave', stopVideo);

    gridContainer.appendChild(gridElement);
  })
  cursor.setupEventListeners();
}
