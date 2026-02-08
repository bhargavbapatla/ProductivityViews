import { SortableContext, useSortable } from '@dnd-kit/sortable';
import React, { useMemo } from 'react';
import { AddIcon } from '../Icons/Icons';
import './KanbanBoard.css';
import { KanbanCard } from './KanbanCard';
import type { KanbanColumnProps } from './types';


export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  cards,
  deleteCard,
  updateCardTitle,
  createCard,
}) => {
  const cardsIds = useMemo(() => cards.map((card) => card.id), [cards]);

  const { setNodeRef } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
    disabled: true, // Disable column dragging itself for now, just act as container
  });

  return (
    <div
      ref={setNodeRef}
      className="kanban-column"
    >
      <div 
        className="column-header"
        style={{ backgroundColor: column.color }}
      >
        <div className="header-left">
          <span>{column.title}</span>
          <span className="task-count">{cards.length}</span>
        </div>
        <button 
          className="add-column-btn" 
          onClick={() => createCard(column.id)}
          aria-label="Add card to column"
        >
          <AddIcon />
        </button>
      </div>

      <div className="column-content">
        <button 
          className="add-card-btn"
          onClick={() => createCard(column.id)}
        >
          <AddIcon className="add-icon-small" /> Add Card
        </button>
        
        <SortableContext items={cardsIds}>
          {cards.map((card) => (
            <KanbanCard
              key={card.id}
              card={card}
              deleteCard={deleteCard}
              updateCardTitle={updateCardTitle}
              indicatorColor={column.color}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};
