'use client';

import { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let disposed = false;

    const init = async () => {
      if (!containerRef.current || disposed) return;

      const { Application, Graphics } = await import('pixi.js');
      const app = new Application();

      await app.init({
        width: containerRef.current.clientWidth || 1,
        height: containerRef.current.clientHeight || 1,
        backgroundAlpha: 0,
        antialias: true,
      });

      if (!containerRef.current || disposed) {
        app.destroy(true);
        return;
      }

      containerRef.current.appendChild(app.canvas);

      const graphics = new Graphics();
      const dots = Array.from({ length: 40 }, () => ({
        x: Math.random() * app.screen.width,
        y: Math.random() * app.screen.height,
        dx: (Math.random() - 0.5) * 0.8,
        dy: (Math.random() - 0.5) * 0.8,
      }));

      app.ticker.add(() => {
        graphics.clear();
        dots.forEach((dot) => {
          dot.x += dot.dx;
          dot.y += dot.dy;

          if (dot.x < 0 || dot.x > app.screen.width) dot.dx *= -1;
          if (dot.y < 0 || dot.y > app.screen.height) dot.dy *= -1;

          graphics.circle(dot.x, dot.y, 2).fill({
            color: 0x93c5fd,
            alpha: 0.35,
          });
        });
      });

      app.stage.addChild(graphics);

      const resize = () => {
        if (!containerRef.current || disposed) return;
        const { width, height } = containerRef.current.getBoundingClientRect();
        app.renderer.resize(width, height);
      };

      resize();
      window.addEventListener('resize', resize);

      return () => {
        window.removeEventListener('resize', resize);
        app.destroy(true, { children: true, texture: true, textureSource: true });
      };
    };

    const cleanupPromise = init();

    return () => {
      disposed = true;
      cleanupPromise.then((cleanup) => cleanup?.());
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 -z-10 overflow-hidden" />;
}
