import React from 'react';

export const ShirtSwatch = ({
  base = '#f9f8f4',
  deep = '#d8d5ca',
  pattern = 'solid',
  patternColor = 'rgba(0,0,0,0.08)',
  imageUrl = '',
  size = 44,
}) => {
  if (imageUrl) {
    return (
      <div
        className="shirt-swatch"
        style={{
          width: size,
          height: size,
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    );
  }

  // Generate CSS pattern matching Tuscan Verve luxury art
  let patternBg = 'none';
  if (pattern === 'stripe') {
    patternBg = `repeating-linear-gradient(90deg, transparent, transparent 4px, ${patternColor} 4px, ${patternColor} 6px)`;
  } else if (pattern === 'check') {
    patternBg = `
      repeating-linear-gradient(0deg, transparent, transparent 6px, ${patternColor} 6px, ${patternColor} 7px),
      repeating-linear-gradient(90deg, transparent, transparent 6px, ${patternColor} 6px, ${patternColor} 7px)
    `;
  } else if (pattern === 'dot') {
    patternBg = `radial-gradient(${patternColor} 1.5px, transparent 1.5px)`;
  } else if (pattern === 'diag') {
    patternBg = `repeating-linear-gradient(45deg, transparent, transparent 5px, ${patternColor} 5px, ${patternColor} 6px)`;
  }

  return (
    <div
      className="shirt-swatch"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${base} 0%, ${deep} 100%)`,
      }}
      title={`${pattern} weave (${base})`}
    >
      <div
        className="shirt-swatch-pattern"
        style={{
          background: patternBg,
          backgroundSize: pattern === 'dot' ? '8px 8px' : 'auto',
        }}
      />
      <div
        className="shirt-swatch-collar"
        style={{
          background: deep,
          borderColor: 'rgba(0, 0, 0, 0.2)',
        }}
      />
    </div>
  );
};
