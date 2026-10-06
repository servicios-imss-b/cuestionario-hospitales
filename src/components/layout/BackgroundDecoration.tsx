import React from 'react';
import coverImage from '../../../imagenes/inicio.jpg';
import instructionsImage from '../../../imagenes/instrucciones.webp';
import formImage from '../../../imagenes/formulario.png';

interface BackgroundProps {
  stage: 'cover' | 'instructions' | 'selector' | 'capture' | 'review' | 'success';
}

export const BackgroundDecoration: React.FC<BackgroundProps> = ({ stage }) => {
  const backgroundImages: Record<string, string> = {
    cover: coverImage,
    instructions: instructionsImage,
    selector: formImage,
    capture: formImage,
    review: formImage,
    success: formImage,
  };

  const currentBg = backgroundImages[stage] || backgroundImages.cover;

  return (
    <div className="fixed inset-0 -z-20 pointer-events-none overflow-hidden select-none">
      {/* Background Image with smooth transition */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out scale-105"
        style={{
          backgroundImage: `url("${currentBg}")`,
        }}
      />

      {/* Neutral charcoal overlay keeps the hospital image subdued behind the form. */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#202124]/20 via-[#202124]/18 to-[#202124]/20 backdrop-blur-[1px]" />

      {/* Subtle institutional grid texture */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.06),rgba(255,255,255,0))]" />
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#202124]/35 to-transparent" />
    </div>
  );
};
