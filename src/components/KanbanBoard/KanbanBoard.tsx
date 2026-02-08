import React from 'react';
import {
  DndContext,
  DragOverlay,
} from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCardContent } from './KanbanCard';
import './KanbanBoard.css';
import { useKanbanData } from './hooks/useKanbanData';
import { useKanbanDrag } from './hooks/useKanbanDrag';

export const KanbanBoard: React.FC = () => {
  const {
    columns,
    cards,
    setCards,
    activeCard,
    setActiveCard,
    columnsId,
    createCard,
    deleteCard,
    updateCardTitle
  } = useKanbanData();

  const {
    sensors,
    onDragStart,
    onDragOver,
    onDragEnd
  } = useKanbanDrag(setCards, setActiveCard);

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
              <KanbanCardContent
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