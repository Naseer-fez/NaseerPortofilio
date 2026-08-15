import React from 'react';

interface SplitTextProps {
  text: string;
  className?: string;
}

export function SplitText({ text, className = '' }: SplitTextProps) {
  return (
    <span className={`inline-block select-none ${className}`}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          data-char={char}
          className="inline-block transition-transform duration-75 origin-center will-change-transform"
          style={{
            fontVariationSettings: "'wght' 400",
            display: 'inline-block',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}
