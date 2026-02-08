import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Card, Id } from './types';
import { DeleteIcon } from '../Icons/Icons';
import './KanbanBoard.css';

interface KanbanCardProps {
  card: Card;
  deleteCard: (id: Id) => void;
  updateCardTitle: (id: Id, newTitle: string) => void;
  indicatorColor?: string;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ 
  card, 
  deleteCard, 
  updateCardTitle,
  indicatorColor = '#ffd700' // Default fallback
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(card.content);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: 'Card',
      card,
    },
    disabled: isEditing, // Disable drag when editing
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setEditContent(card.content);
  };

  const saveEdit = () => {
    setIsEditing(false);
    if (editContent.trim() !== card.content) {
      updateCardTitle(card.id, editContent);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditContent(card.content);
    }
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="kanban-card dragging"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="kanban-card"
    >
      <div 
        className="card-indicator" 
        style={{ backgroundColor: indicatorColor }}
      ></div>
      <div className="card-content-wrapper">
        {isEditing ? (
          <textarea
            className="card-input"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={handleKeyDown}
            autoFocus
            rows={2}
          />
        ) : (
          <div 
            className="card-text" 
            onClick={toggleEdit}
          >
            {card.content}
          </div>
        )}
      </div>
      {!isEditing && (
        <button
          className="delete-card-btn"
          onClick={() => deleteCard(card.id)}
          aria-label="Delete card"
        >
          <DeleteIcon />
        </button>
      )}
    </div>
  );
};
