import React, { useState } from 'react';
import Card from './Card';
import ColorPalette from './ColorPalette';

function List({
  title,
  cards,
  listId,
  color,
  onAddCard,
  onCardClick,
  onToggleComplete,
  onDeleteCard,
  onDeleteList,
  onCardDragStart,
  onListDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onUpdateListColor,
  onUpdateCardColor,
  colorPalette
}) {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardType, setNewCardType] = useState('');
  const [isListHovered, setIsListHovered] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const handleAddCardSubmit = () => {
    if (newCardTitle.trim() && newCardType) {
      onAddCard(listId, newCardTitle, newCardType);
      setNewCardTitle('');
      setIsAddingCard(false);
      setNewCardType('');
    } else if (!newCardType) {
      alert('Por favor, escolha um tipo de card.');
    }
  };

  const handleCancelAddCard = () => {
    setIsAddingCard(false);
    setNewCardTitle('');
    setNewCardType('');
  };

  const handleDeleteListClick = (e) => {
    e.stopPropagation();
    onDeleteList(listId);
  };

  return (
    <div
      draggable="true"
      className={`list ${isDragOver ? 'drag-over' : ''}`}
      style={{ backgroundColor: color }}
      onMouseEnter={() => setIsListHovered(true)}
      onMouseLeave={() => setIsListHovered(false)}

      onDragStart={(e) => {
        e.stopPropagation();
        onListDragStart(listId);
      }}
      onDragOver={(e) => {
        e.stopPropagation();
        onDragOver(e);
        setIsDragOver(true);
      }}
      onDragLeave={(e) => {
        e.stopPropagation();
        setIsDragOver(false);
      }}
      onDrop={(e) => {
        e.stopPropagation();
        onDrop(e, listId);
        setIsDragOver(false);
      }}
      onDragEnd={(e) => {
        e.stopPropagation();
        onDragEnd();
      }}
    >

      <div
        className={`list-delete-button ${isListHovered ? 'visible' : ''}`}
        onClick={handleDeleteListClick}
      >
        ✕
      </div>

      <div className="list-header">
        <h3 className="list-title">{title}</h3>
        <div
          className="color-picker-button"
          onClick={(e) => {
            e.stopPropagation();
            setIsColorPickerOpen(!isColorPickerOpen);
          }}
        >
          <img src="https://img.icons8.com/material-outlined/20/5e6c84/paint-brush.png" alt="Cor" />
        </div>
      </div>

      {isColorPickerOpen && (
        <ColorPalette
          colors={colorPalette}
          onSelectColor={(selectedColor) => {
            onUpdateListColor(listId, selectedColor);
            setIsColorPickerOpen(false);
          }}
        />
      )}

      <div className="list-cards">
        {cards.map(card => (
          <Card
            key={card.id}
            card={card}
            onCardClick={onCardClick}
            onToggleComplete={onToggleComplete}
            onDeleteCard={onDeleteCard}
            onDragStart={onCardDragStart}
            onDragEnd={onDragEnd}
            onUpdateCardColor={onUpdateCardColor}
            colorPalette={colorPalette}
          />
        ))}
      </div>

      {
        isAddingCard ? (
          <div className="add-card-form">
            <textarea
              className="add-card-textarea"
              placeholder="Insira um título para este cartão..."
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              autoFocus
            />
            <select
              className="add-card-select"
              value={newCardType}
              onChange={(e) => setNewCardType(e.target.value)}
              style={!newCardType ? { color: '#5e6c84' } : {}}
            >
              <option value="" disabled>Escolha o tipo de card...</option>
              <option value="description">Apenas Descrição</option>
              <option value="checklist">Com Checklist</option>
            </select>
            <div className="add-card-controls">
              <button
                className="add-card-submit-button"
                onClick={handleAddCardSubmit}
              >
                Adicionar Cartão
              </button>
              <button
                className="add-card-cancel-button"
                onClick={handleCancelAddCard}
              >
                ✕
              </button>
            </div>
          </div>
        ) : (
          <div
            className="add-card-button"
            onClick={() => setIsAddingCard(true)}
          >
            + Adicionar um cartão
          </div>
        )
      }
    </div>
  );
}

export default List;
