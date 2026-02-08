import React, { useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import type { Card, Column, Id } from './types';
import './KanbanBoard.css';

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

export const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>(defaultColumns);
  const [cards, setCards] = useState<Card[]>(defaultCards);
  const [activeCard, setActiveCard] = useState<Card | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // 3px movement required to start drag
      },
    })
  );

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

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

  function generateId() {
    return `card-${Date.now()}-${Math.floor(Math.random() * 10001)}`;
  }

  // Drag Handlers
  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === 'Card') {
      setActiveCard(event.active.data.current.card);
      return;
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveACard = active.data.current?.type === 'Card';
    const isOverACard = over.data.current?.type === 'Card';

    if (!isActiveACard) return;

    // Dropping a Card over another Card
    if (isActiveACard && isOverACard) {
      setCards((cards) => {
        const activeIndex = cards.findIndex((t) => t.id === activeId);
        const overIndex = cards.findIndex((t) => t.id === overId);

        if (cards[activeIndex].columnId !== cards[overIndex].columnId) {
          // Clone the cards array to avoid mutating state directly
          const newCards = [...cards];
          // Update the columnId of the active card
          newCards[activeIndex] = { 
            ...newCards[activeIndex], 
            columnId: newCards[overIndex].columnId 
          };
          
          return arrayMove(newCards, activeIndex, overIndex);
        }

        return arrayMove(cards, activeIndex, overIndex);
      });
    }

    // Dropping a Card over a Column
    const isOverAColumn = over.data.current?.type === 'Column';
    if (isActiveACard && isOverAColumn) {
      setCards((cards) => {
        const activeIndex = cards.findIndex((t) => t.id === activeId);
        // Avoid mutation
        if (cards[activeIndex].columnId !== overId) {
             const newCards = [...cards];
             newCards[activeIndex] = { ...newCards[activeIndex], columnId: overId as string };
             return arrayMove(newCards, activeIndex, activeIndex);
        }
        return cards;
      });
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveCard(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;
    
    // Final reordering if needed (usually handled by onDragOver for fluidity, but good to ensure)
  }

  return (
    <div className="kanban-board">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div className="kanban-columns-container">
          <SortableContext items={columnsId}>
            {columns.map((col) => (
              <KanbanColumn
                key={col.id}
                column={col}
                cards={cards.filter((card) => card.columnId === col.id)}
                deleteCard={deleteCard}
                updateCardTitle={updateCardTitle}
                createCard={createCard}
              />
            ))}
          </SortableContext>
        </div>

        {createPortal(
          <DragOverlay>
            {activeCard && (
              <KanbanCard
                card={activeCard}
                deleteCard={deleteCard}
                updateCardTitle={updateCardTitle}
                indicatorColor={columns.find(col => col.id === activeCard.columnId)?.color}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};
