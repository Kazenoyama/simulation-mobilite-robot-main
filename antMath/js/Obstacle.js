class Obstacle {

    constructor(centerX, centerY, radius) {
      this.centerX = centerX;
      this.centerY = centerY;
      this.radius = radius;
      this.beginAngle = 0;
      this.endAngle = 2 * Math.PI;
      this.color;

      /*
      this.img = document.createElement('img');
      this.img.src = "./img/waterImage.png";
      this.img.style.position = 'absolute';
      this.img.style.transform = 'translateX(' + -50 + '%) translateY(' + -50 + '%)';
      this.img.style.width = this.radius + 'px';
      this.img.style.height = this.radius + 'px';*/
    }

    getRandomColor() {
      // Generate random values for red, green, and blue
      var red = Math.floor(Math.random() * 256);
      var green = Math.floor(Math.random() * 256);
      var blue = Math.floor(Math.random() * 256);
    
      // Create the RGB color string
      var color = 'rgb(' + red + ',' + green + ',' + blue + ')';
    
      this.color = color;
    }
  
    draw(context) {
      context.beginPath();
      /*
      this.img.style.left = this.centerX + 'px';
      this.img.style.top = this.centerY + 'px';*/
      context.arc(this.centerX, this.centerY, this.radius, this.beginAngle, this.endAngle);
      context.stroke();
      context.fillStyle = this.color;
      context.fill();
    }

    clearCircle(context){
      context.clearRect(this.centerX - this.radius-10, this.centerY - this.radius-10,2.2*this.radius,2.2* this.radius)
    }

    attachClickListener(canvas) {
      canvas.addEventListener('click', (event) => {
        const mouseX = event.clientX - canvas.getBoundingClientRect().left;
        const mouseY = event.clientY - canvas.getBoundingClientRect().top;
  
        const distance = Math.sqrt((mouseX - this.centerX) ** 2 + (mouseY - this.centerY) ** 2);
        
        if (distance <= this.radius) {
          // Click is inside the obstacle, trigger the callback

          //console.log(this.centerX, this.centerY);
        }
      });
    }

    attachDragListener(canvas,context) {
      let isDragging = false;
  
      const onMouseDown = (event) => {
        console.log("Object")
        const mouseX = event.clientX - canvas.getBoundingClientRect().left;
        const mouseY = event.clientY - canvas.getBoundingClientRect().top;
  
        const distance = Math.sqrt((mouseX - this.centerX) ** 2 + (mouseY - this.centerY) ** 2);
  
        if (distance <= this.radius) {
          isDragging = true;
        }
      };
  
      const onMouseMove = (event) => {
        if (isDragging) {
          this.clearCircle(context);
          this.centerX = event.clientX - canvas.getBoundingClientRect().left;
          this.centerY = event.clientY - canvas.getBoundingClientRect().top;
          this.draw(context)
          // Additional logic can be added here during the drag
        }
      };
  
      const onMouseUp = (event) => {
        isDragging = false;
      };
  
      canvas.addEventListener('mousedown', onMouseDown);
      canvas.addEventListener('mousemove', onMouseMove);
      canvas.addEventListener('mouseup', onMouseUp);
    }
  
  
    getX(){return this.centerX;}
    getY(){return this.centerY;}
    getRadius(){return this.radius;}
    getBeginAngle(){return this.beginAngle;}
    getEndAngle(){return this.endAngle;}
    }
    