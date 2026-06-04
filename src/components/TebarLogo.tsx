import React from 'react';
// @ts-ignore
import logoImage from './logo tebarmedia.png';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'dark' | 'light' | 'white'; // 'dark' = for white/light layouts, 'light'/'white' = for dark footer
}

export function TebarMark({ className = "h-8 w-8" }: { className?: string; variant?: 'dark' | 'light' | 'white' }) {
  // Use a beautifully isolated icon mark representation if needed individually, 
  // otherwise, we fall back to the exact official asset.
  return (
    <img 
      src={logoImage} 
      alt="Tebarmedia Mark" 
      className={`${className} object-contain`}
      referrerPolicy="no-referrer"
    />
  );
}

export function TebarLogo({ className = "", size = "md", variant = "dark" }: LogoProps) {
  // Exact responsive heights mapping to preserve design balance
  const sizeClasses = {
    sm: "h-11 sm:h-12",
    md: "h-14 sm:h-16",
    lg: "h-20 sm:h-24",
    xl: "h-32 sm:h-36"
  };

  const imgHeight = sizeClasses[size];

  // If rendering on dark footer backgrounds, a clean rounded white capsule ensures 
  // the dark navy typeface remains highly legible, crisp, and high-fidelity.
  const containerStyle = variant === 'light' || variant === 'white'
    ? 'bg-white rounded-xl py-2 px-3.5 shadow-sm border border-white/10 hover:border-white/20 transition-all flex items-center justify-center'
    : 'flex items-center';

  return (
    <div className={`${containerStyle} select-none ${className}`} id={`tebarmedia-official-logo-${size}`}>
      <img 
        src={logoImage} 
        alt="Tebarmedia - Informasi Merata" 
        className={`${imgHeight} w-auto object-contain`}
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
