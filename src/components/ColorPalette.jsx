import React from 'react';

function ColorPalette({ colors, onSelectColor }) {

  const handleClick = (e, color) => {
    e.stopPropagation();
    onSelectColor(color);
  };

  return (
    <div className="color-palette" onClick={(e) => e.stopPropagation()}>
      {colors.map(color => (
        <div
          key={color}
          className="color-swatch"
          style={{ backgroundColor: color }}
          onClick={(e) => handleClick(e, color)}
        />
      ))}
    </div>
  );
}

export default ColorPalette;
