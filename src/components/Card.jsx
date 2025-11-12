import React, { useState } from 'react';
import ColorPalette from './ColorPalette';

function Card({ card, onCardClick, onToggleComplete, onDeleteCard, onDragStart, onDragEnd, onUpdateCardColor, colorPalette }) {

  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const getChecklistProgress = () => {
    if (card.checklist.length === 0) return null;
    const checkedCount = card.checklist.filter(item => item.checked).length;
    return `${checkedCount}/${card.checklist.length}`;
  };

  const getFormattedDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
  };

  const getFormattedCreationDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  }

  const handleCheckboxClick = (e) => {
    onToggleComplete(card.id, e);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDeleteCard(card.id);
  };

  return (
    <div
      className={`card
        ${card.completedAt ? 'card-completed' : ''}
        ${isDragging ? 'dragging' : ''}
      `}
      style={{ backgroundColor: card.color }}
      onClick={() => onCardClick(card)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}

      draggable="true"
      onDragStart={(e) => {
        e.stopPropagation();
        onDragStart(card);
        setIsDragging(true);
      }}
      onDragEnd={(e) => {
        e.stopPropagation();
        onDragEnd();
        setIsDragging(false);
      }}
    >

      {isColorPickerOpen && (
        <ColorPalette
          colors={colorPalette}
          onSelectColor={(selectedColor) => {
            onUpdateCardColor(card.id, selectedColor);
            setIsColorPickerOpen(false);
          }}
        />
      )}

      {card.labels && card.labels.length > 0 && (
        <div className="card-label-container">
          {card.labels.map(label => (
            <span
              key={label.text}
              className="card-label"
              style={{ backgroundColor: label.color }}
              title={label.text}
            />
          ))}
        </div>
      )}

      <div className="card-main-content">

        <div
          className={`card-checkbox
            ${card.completedAt ? 'checked' : ''}
            ${(isHovered || card.completedAt) ? 'visible' : ''}
          `}
          onClick={handleCheckboxClick}
        >
        </div>

        <div
          className={`color-picker-button ${isHovered ? 'visible' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            setIsColorPickerOpen(!isColorPickerOpen);
          }}
        >
          <img src="https://img.icons8.com/material-outlined/20/5e6c84/paint-brush.png" alt="Cor" />
        </div>

        <div
          className={`card-delete-button ${isHovered ? 'visible' : ''}`}
          onClick={handleDeleteClick}
        >
          <img src="https://img.icons8.com/material-outlined/20/5e6c84/trash--v1.png" alt="Excluir" />
        </div>

        <span className="card-title">{card.title}</span>
      </div>

      <div className="card-badges">
        {card.dueDate && (
          <span className="card-badge due-date" title="Data de Entrega">
            🕒 {getFormattedDate(card.dueDate)}
          </span>
        )}
        {card.description && (
          <span className="card-badge description" title="Este cartão tem uma descrição">
            ☰
          </span>
        )}
        {card.type === 'checklist' && card.checklist.length > 0 && (
          <span className="card-badge checklist" title="Progresso do Checklist">
            ✓ {getChecklistProgress()}
          </span>
        )}
      </div>

      {card.createdAt && (
        <div className="card-creation-date">
          {getFormattedCreationDate(card.createdAt)}
        </div>
      )}
    </div>
  );
}

export default Card;
