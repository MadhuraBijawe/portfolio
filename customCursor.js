document.addEventListener('DOMContentLoaded', () => {
  const customCursor = document.querySelector('.custom-cursor');

  let mouseX = 0,
      mouseY = 0;
  let cursorX = 0,
      cursorY = 0;
  let lastX = 0,
      lastY = 0;
  let dotOffsetX = 0,
      dotOffsetY = 0;

  const followCursor = () => {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;

    const velocityX = mouseX - lastX;
    const velocityY = mouseY - lastY;
    const velocity = Math.sqrt(velocityX ** 2 + velocityY ** 2);

    const maxOffset = Math.min(20, velocity * 0.9);
    const angle = Math.atan2(velocityY, velocityX);
    dotOffsetX = -maxOffset * Math.cos(angle);
    dotOffsetY = -maxOffset * Math.sin(angle);

    dotOffsetX *= Math.max(0.8, 1 - velocity * 0.02);
    dotOffsetY *= Math.max(0.8, 1 - velocity * 0.02);

    customCursor.style.transform = `translate(${cursorX - 11}px, ${cursorY - 11}px)`;
    customCursor.style.setProperty('--dot-offset-x', `${dotOffsetX}px`);
    customCursor.style.setProperty('--dot-offset-y', `${dotOffsetY}px`);

    lastX = mouseX;
    lastY = mouseY;

    requestAnimationFrame(followCursor);
  };

  const handleMouseMove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  };

  document.addEventListener('mousemove', handleMouseMove);
  followCursor();
});
