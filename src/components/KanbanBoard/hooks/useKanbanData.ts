import { useState, useMemo } from 'react';
import type { Card, Column, Id } from '../types';

const defaultColumns: Column[] = [
  {
    id: 'todo',
    title: 'Todo',
    color: '#3498db', // Blue
  },
  {
    id: 'doing',
    title: 'In Progress',
    color: '#f39c12', // Orange
  },
  {
    id: 'done',
    title: 'Done',
    color: '#2ecc71', // Green
  },
];

const defaultCards: Card[] = [
  { id: '1', columnId: 'todo', content: 'Create initial project plan' },
  { id: '2', columnId: 'todo', content: 'Design landing page' },
  { id: '3', columnId: 'todo', content: 'Review codebase structure' },
  { id: '4', columnId: 'doing', content: 'Implement authentication' },
  { id: '5', columnId: 'doing', content: 'Set up database schema' },
  { id: '6', columnId: 'doing', content: 'Fix navbar bugs' },
  { id: '7', columnId: 'done', content: 'Organize project repository' },
  { id: '8', columnId: 'done', content: 'Write API documentation' },
];

export const useKanbanData = () => {
  const [columns, setColumns] = useState<Column[]>(defaultColumns);
  const [cards, setCards] = useState<Card[]>(defaultCards);
  const [activeCard, setActiveCard] = useState<Card | null>(null);

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  function generateId() {
    return `card-${Date.now()}-${Math.floor(Math.random() * 10001)}`;
  }

  function createCard(columnId: Id) {
    const newCard: Card = {
      id: generateId(),
      columnId,
      content: `New Task ${cards.length + 1}`,
    };
    setCards([...cards, newCard]);
  }

  function deleteCard(id: Id) {
    setCards(cards.filter((card) => card.id !== id));
  }

  function updateCardTitle(id: Id, newTitle: string) {
    setCards(
      cards.map((card) => {
        if (card.id !== id) return card;
        return { ...card, content: newTitle };
      })
    );
  }

  return {
    columns,
    setColumns,
    cards,
    setCards,
    activeCard,
    setActiveCard,
    columnsId,
    createCard,
    deleteCard,
    updateCardTitle
  };
};
