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
    videoElement.play(); // Play the video on hover
    videoElement.style.transform = 'scale(1.1)';
}
function stopVideo(event){
    var image = event.target;
    var gridImage = image.closest('.grid-image');
    const videoElement = gridImage.querySelector('.video');
    console.log(videoElement);
    videoElement.style.display = 'none';
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