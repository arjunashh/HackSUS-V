import React, { useEffect, useRef, useState, ReactNode, HTMLAttributes } from "react";

interface MagnetProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: number;
  disabled?: boolean;
  magnetStrength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  wrapperClassName?: string;
  innerClassName?: string;
}

const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 100,
  disabled = false,
  magnetStrength = 2,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.5s ease-in-out",
  wrapperClassName = "",
  innerClassName = "",
  ...props
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const magnetRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(position);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useEffect(() => {
    if (disabled) {
      setPosition({ x: 0, y: 0 });
      setIsActive(false);
      return;
    }
  }, [disabled]);

  const transitionStyle = isActive ? activeTransition : inactiveTransition;

  const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

  return (
    <div
      ref={magnetRef}
      className={wrapperClassName}
      style={{ position: "relative", display: "inline-block" }}
      onPointerMove={(e) => {
        if (disabled) return;
        const el = magnetRef.current;
        if (!el) return;
        const { left, top, width, height } = el.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;

        const maxOffset = padding / Math.max(1, magnetStrength);
        const nextX = clamp((e.clientX - centerX) / magnetStrength, -maxOffset, maxOffset);
        const nextY = clamp((e.clientY - centerY) / magnetStrength, -maxOffset, maxOffset);

        if (!isActive) setIsActive(true);
        const prev = positionRef.current;
        if (prev.x !== nextX || prev.y !== nextY) {
          setPosition({ x: nextX, y: nextY });
        }
      }}
      onPointerLeave={() => {
        if (disabled) return;
        setIsActive(false);
        setPosition({ x: 0, y: 0 });
      }}
      {...props}
    >
      <div
        className={innerClassName}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          transition: transitionStyle,
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Magnet;
