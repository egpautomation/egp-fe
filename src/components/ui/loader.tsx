import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ 
  size = 'md', 
  color = '#554cb5',
  className = '' 
}) => {

  const loaderStyle = {
    width: size === 'sm' ? '32px' : size === 'lg' ? '64px' : '44.8px',
    height: size === 'sm' ? '32px' : size === 'lg' ? '64px' : '44.8px',
    color: color,
    position: 'relative' as const,
    background: `radial-gradient(11.2px, ${color} 94%, transparent)`
  };

  const beforeStyle = {
    content: '""',
    position: 'absolute' as const,
    inset: 0,
    borderRadius: '50%',
    background: `
      radial-gradient(10.08px at bottom right, transparent 94%, ${color}) top left,
      radial-gradient(10.08px at bottom left, transparent 94%, ${color}) top right,
      radial-gradient(10.08px at top right, transparent 94%, ${color}) bottom left,
      radial-gradient(10.08px at top left, transparent 94%, ${color}) bottom right
    `,
    backgroundSize: '22.4px 22.4px',
    backgroundRepeat: 'no-repeat',
    animation: 'loader 1.5s infinite cubic-bezier(0.3, 1, 0, 1)'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <style>
        {`
          @keyframes loader {
            33% {
              inset: -11.2px;
              transform: rotate(0deg);
            }
            66% {
              inset: -11.2px;
              transform: rotate(90deg);
            }
            100% {
              inset: 0;
              transform: rotate(90deg);
            }
          }
        `}
      </style>
      <div 
        className="loader"
        style={loaderStyle}
      >
        <div style={beforeStyle}></div>
      </div>
    </div>
  );
};

export default Loader;
