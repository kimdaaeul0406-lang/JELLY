// src/components/JellyPop.js
import React, { useEffect, useRef } from "react";

export default function JellyPop({ onComplete }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);
  const isMountedRef = useRef(true);
  const onCompleteRef = useRef(onComplete);

  // 파스텔 + 쨍한 젤리 색깔들
  const COLORS = [
    "#FF6B81",
    "#FF9F1A",
    "#FFE66D",
    "#2ED573",
    "#1E90FF",
    "#A29BFE",
    "#FF6EC7",
  ];

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;

      this.size = Math.random() * 26 + 18; // 젤리 크기
      this.speedX = (Math.random() - 0.5) * 12;
      this.speedY = -Math.random() * 18 - 10;
      this.gravity = 0.45;

      this.alpha = 1;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.3;

      // 40% 젤리빈, 60% 곰돌이 (곰돌이를 더 많이!)
      this.isBean = Math.random() > 0.6;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.bounceCount = 0;
    }

    update(h) {
      this.speedY += this.gravity;
      this.x += this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;

      const floor = h * 0.9;

      // 🔸 바닥에서 한 번만 통! 튕기기
      if (this.y > floor && this.bounceCount < 1) {
        this.y = floor;
        this.speedY *= -0.5; // 살짝만 튕기고
        this.bounceCount++;
      }

      // 🔸 튕긴 다음부터는 빨리 사라지기
      if (this.bounceCount >= 1) {
        this.alpha -= 0.07; // 0.03 → 0.07 로 두 배 이상 빠르게
      }
    }

    draw(ctx) {
      if (this.alpha <= 0) return;

      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);

      if (this.isBean) {
        // 젤리빈 (타원)
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 0.35, this.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // 하이라이트
        ctx.beginPath();
        ctx.ellipse(
          -this.size * 0.1,
          -this.size * 0.3,
          this.size * 0.12,
          this.size * 0.25,
          0,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = "rgba(255,255,255,0.65)";
        ctx.fill();
      } else {
        // 하리보 곰돌이 느낌 (더 귀엽게!)
        ctx.fillStyle = this.color;

        // 몸통 (더 크고 둥글게)
        ctx.beginPath();
        ctx.ellipse(
          0,
          this.size * 0.25,
          this.size * 0.4,
          this.size * 0.5,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // 머리 (몸통보다 약간 작게)
        ctx.beginPath();
        ctx.arc(0, -this.size * 0.15, this.size * 0.4, 0, Math.PI * 2);
        ctx.fill();

        // 귀 (더 크고 귀엽게)
        ctx.beginPath();
        ctx.arc(
          -this.size * 0.3,
          -this.size * 0.35,
          this.size * 0.18,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.beginPath();
        ctx.arc(
          this.size * 0.3,
          -this.size * 0.35,
          this.size * 0.18,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // 귀 안쪽 (더 귀엽게)
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.beginPath();
        ctx.arc(
          -this.size * 0.3,
          -this.size * 0.35,
          this.size * 0.1,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.beginPath();
        ctx.arc(
          this.size * 0.3,
          -this.size * 0.35,
          this.size * 0.1,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // 팔 (더 크게)
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(
          -this.size * 0.4,
          this.size * 0.2,
          this.size * 0.15,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.beginPath();
        ctx.arc(
          this.size * 0.4,
          this.size * 0.2,
          this.size * 0.15,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // 다리 (작고 귀엽게)
        ctx.beginPath();
        ctx.arc(
          -this.size * 0.2,
          this.size * 0.6,
          this.size * 0.12,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.beginPath();
        ctx.arc(
          this.size * 0.2,
          this.size * 0.6,
          this.size * 0.12,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // 눈 (작고 귀엽게)
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.beginPath();
        ctx.arc(
          -this.size * 0.12,
          -this.size * 0.1,
          this.size * 0.08,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.beginPath();
        ctx.arc(
          this.size * 0.12,
          -this.size * 0.1,
          this.size * 0.08,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // 코 (작고 귀엽게)
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.beginPath();
        ctx.arc(0, this.size * 0.02, this.size * 0.05, 0, Math.PI * 2);
        ctx.fill();

        // 하이라이트 (머리 위)
        ctx.globalAlpha = this.alpha * 0.5;
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.beginPath();
        ctx.ellipse(
          -this.size * 0.1,
          -this.size * 0.3,
          this.size * 0.15,
          this.size * 0.2,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // onComplete ref 업데이트
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    isMountedRef.current = true;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      if (!isMountedRef.current || !canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    // 처음 한 번 팡! 하고 젤리들 생성
    particlesRef.current = [];
    const centerX = canvas.width / 2;
    const bottomY = canvas.height * 0.9;

    const count = 50; // 너무 많으면 버벅, 적당히
    for (let i = 0; i < count; i++) {
      particlesRef.current.push(new Particle(centerX, bottomY));
    }

    let finished = false;

    const animate = () => {
      // 컴포넌트가 언마운트되었으면 애니메이션 중지
      if (!isMountedRef.current || !canvas) {
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter((p) => p.alpha > 0);

      particlesRef.current.forEach((p) => {
        p.update(canvas.height);
        p.draw(ctx);
      });

      // 다 사라지면 onComplete 한 번만 호출
      if (!finished && particlesRef.current.length === 0) {
        finished = true;
        if (isMountedRef.current && onCompleteRef.current) {
          onCompleteRef.current();
        }
      }

      // 아직 마운트되어 있고 파티클이 있으면 계속 애니메이션
      if (isMountedRef.current) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();
    window.addEventListener("resize", resize);

    return () => {
      // cleanup: 컴포넌트 언마운트 시 모든 것 정리
      isMountedRef.current = false;
      window.removeEventListener("resize", resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      // 파티클 배열도 비우기
      particlesRef.current = [];
      // 캔버스도 비우기
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
  }, []); // dependency 제거 - 컴포넌트 마운트 시 한 번만 실행

  return <canvas ref={canvasRef} className="jelly-canvas" />;
}
