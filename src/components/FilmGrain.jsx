import { useRef, useEffect } from 'react';

export default function FilmGrain() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const size = 64;
    const offscreen = document.createElement('canvas');
    offscreen.width = size;
    offscreen.height = size;
    const ctx = offscreen.getContext('2d');
    const imageData = ctx.createImageData(size, size);

    for (let i = 0; i < imageData.data.length; i += 4) {
      const val = Math.random() * 255;
      imageData.data[i] = val;
      imageData.data[i + 1] = val;
      imageData.data[i + 2] = val;
      imageData.data[i + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
    const dataUrl = offscreen.toDataURL('image/png');

    el.style.backgroundImage = `url(${dataUrl})`;
    el.style.backgroundRepeat = 'repeat';
    el.style.backgroundSize = `${size}px ${size}px`;

    let frame = 0;
    const id = setInterval(() => {
      frame = (frame + 1) % 4;
      el.style.backgroundPosition = `${frame * 16}px ${frame * 16}px`;
    }, 200);

    return () => clearInterval(id);
  }, []);

  return <div ref={ref} id="film-grain" />;
}
