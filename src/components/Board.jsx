import React, { useState } from 'react';
import List from '../components/List';
import CardModal from '../components/CardModal';
import '../components/style/Board.css';

const ROLE_LABELS = {
  gestor: { text: 'Gestor', color: '#ff7f50' },
  encarregado: { text: 'Encarregado', color: '#0079BF' },
  recebedor: { text: 'Recebedor', color: '#51e898' },
  admin: { text: 'Admin', color: '#ff0000' },
};

const PASTEL_COLORS = [
  '#ffffff',
  '#fef9c3',
  '#ffe4c2',
  '#ff746c',
  '#fecdd3',
  '#dcfce7',
  '#bdecb6',
];

function Board({ user }) {
  const [lists, setLists] = useState([
    {
      id: 1,
      title: 'Hoje',
      color: '#fef9c3',
      cards: [
        {
          id: 1,
          title: 'Configurar o banco de dados',
          type: 'description',
          description: 'Usar PostgreSQL para a V1.',
          checklist: [],
          labels: [ROLE_LABELS.encarregado, ROLE_LABELS.admin],
          dueDate: null,
          createdAt: '2025-11-08T18:00:00.000Z',
          completedAt: null,
          color: '#ffffff',
        },
        {
          id: 2,
          title: 'Criar protótipo da tela de login',
          type: 'checklist',
          description: '',
          checklist: [
            { id: 10, text: 'Design no Figma', checked: true },
            { id: 11, text: 'Componente React', checked: false },
          ],
          labels: [ROLE_LABELS.recebedor],
          dueDate: null,
          createdAt: '2025-11-09T10:00:00.000Z',
          completedAt: null,
          color: '#ffffff',
        },
      ],
    },
    {
      id: 2,
      title: 'Esta semana',
      color: '#ffe4c2',
      cards: []
    },
    {
      id: 3,
      title: 'Mais tarde',
      color: '#dcfce7',
      cards: []
    },
  ]);

  const [selectedCard, setSelectedCard] = useState(null);
  const [draggedCard, setDraggedCard] = useState(null);
  const [draggedList, setDraggedList] = useState(null);

  const handleAddCard = (listId, cardTitle, cardType) => {
    const newCard = {
      id: Date.now(),
      title: cardTitle,
      type: cardType,
      description: '',
      checklist: [],
      labels: [],
      dueDate: null,
      createdAt: new Date().toISOString(),
      completedAt: null,
      color: '#ffffff',
    };
    const newLists = lists.map(list => {
      if (list.id === listId) {
        return { ...list, cards: [...list.cards, newCard] };
      }
      return list;
    });
    setLists(newLists);
  };

  const handleToggleComplete = (cardId, e) => {
    e.stopPropagation();
    const newLists = lists.map(list => {
      const newCards = list.cards.map(card => {
        if (card.id === cardId) {
          return {
            ...card,
            completedAt: card.completedAt ? null : new Date().toISOString()
          };
        }
        return card;
      });
      return { ...list, cards: newCards };
    });
    setLists(newLists);
  };

  const handleUpdateCard = (updatedCard) => {
    const newLists = lists.map(list => {
      const newCards = list.cards.map(card => {
        if (card.id === updatedCard.id) {
          return updatedCard;
        }
        return card;
      });
      return { ...list, cards: newCards };
    });
    setLists(newLists);
  };

  const handleAddList = () => {
    const listTitle = prompt('Digite o título da nova lista:');
    if (listTitle) {
      const newList = {
        id: Date.now(),
        title: listTitle,
        cards: [],
        color: '#f3f4f6'
      };
      setLists([...lists, newList]);
    }
  };

  const handleDeleteCard = (cardId) => {
    if (!window.confirm('Tem certeza que deseja excluir este cartão?')) {
      return;
    }
    const newLists = lists.map(list => ({
      ...list,
      cards: list.cards.filter(card => card.id !== cardId)
    }));
    setLists(newLists);
  };

  const handleDeleteList = (listId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta lista e todos os seus cartões?')) {
      return;
    }
    const newLists = lists.filter(list => list.id !== listId);
    setLists(newLists);
  };

  const handleCardDragStart = (card) => {
    setDraggedCard(card);
  };

  const handleListDragStart = (listId) => {
    setDraggedList(listId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetListId) => {
    e.preventDefault();
    if (draggedCard) {
      const listsWithoutCard = lists.map(list => ({
        ...list,
        cards: list.cards.filter(c => c.id !== draggedCard.id)
      }));
      const finalLists = listsWithoutCard.map(list => {
        if (list.id === targetListId) {
          return { ...list, cards: [...list.cards, draggedCard] };
        }
        return list;
      });
      setLists(finalLists);
    }
    else if (draggedList) {
      const draggedListIndex = lists.findIndex(list => list.id === draggedList);
      const targetListIndex = lists.findIndex(list => list.id === targetListId);
      if (draggedListIndex === -1 || targetListIndex === -1) return;
      const newLists = [...lists];
      const [movedList] = newLists.splice(draggedListIndex, 1);
      newLists.splice(targetListIndex, 0, movedList);
      setLists(newLists);
    }
  };

  const handleDragEnd = () => {
    setDraggedCard(null);
    setDraggedList(null);
  };

  const handleUpdateListColor = (listId, newColor) => {
    setLists(lists.map(list =>
      list.id === listId ? { ...list, color: newColor } : list
    ));
  };

  const handleUpdateCardColor = (cardId, newColor) => {
    setLists(lists.map(list => ({
      ...list,
      cards: list.cards.map(card =>
        card.id === cardId ? { ...card, color: newColor } : card
      )
    })));
  };

  return (
    <>
      <div className="board">
        {lists.map(list => (
          <List
            key={list.id}
            listId={list.id}
            title={list.title}
            cards={list.cards}
            color={list.color}
            onAddCard={handleAddCard}
            onCardClick={(card) => setSelectedCard(card)}
            onToggleComplete={handleToggleComplete}
            onDeleteCard={handleDeleteCard}
            onDeleteList={handleDeleteList}
            onCardDragStart={handleCardDragStart}
            onListDragStart={handleListDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            onUpdateListColor={handleUpdateListColor}
            onUpdateCardColor={handleUpdateCardColor}
            colorPalette={PASTEL_COLORS}
          />
        ))}
        <div className="add-list" onClick={handleAddList}>
          + Adicionar outra lista
        </div>
      </div>

      {selectedCard && (
        <CardModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          onUpdateCard={handleUpdateCard}
          allLabels={ROLE_LABELS}
        />
      )}
    </>
  );
}

export default Board;
