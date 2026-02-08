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

export const KanbanCardContent: React.FC<KanbanCardProps & {
  setNodeRef?: (node: HTMLElement | null) => void;
  attributes?: any;
  listeners?: any;
  style?: React.CSSProperties;
  isEditing?: boolean;
  onEditChange?: (isEditing: boolean) => void;
  className?: string;
}> = ({ 
  card, 
  deleteCard, 
  updateCardTitle, 
  indicatorColor = '#ffd700',
  setNodeRef,
  attributes,
  listeners,
  style,
  isEditing: propIsEditing,
  onEditChange,
  className
}) => {
  const [internalIsEditing, setInternalIsEditing] = useState(false);
  
  const isEditing = propIsEditing !== undefined ? propIsEditing : internalIsEditing;
  const setIsEditing = onEditChange || setInternalIsEditing;

  const [editContent, setEditContent] = useState(card.content);

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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`kanban-card ${className || ''}`.trim()}
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

export const KanbanCard: React.FC<KanbanCardProps> = (props) => {
  const [isEditing, setIsEditing] = useState(false); // Local state just to control drag disabling

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props.card.id,
    data: {
      type: 'Card',
      card: props.card,
    },
    disabled: isEditing, // This needs to be coordinated with content. 
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <KanbanCardContent
        {...props}
        setNodeRef={setNodeRef}
        style={style}
        className="dragging"
      />
    );
  }

  return (
    <KanbanCardContent
      {...props}
      setNodeRef={setNodeRef}
      attributes={attributes}
      listeners={listeners}
      style={style}
      isEditing={isEditing}
      onEditChange={setIsEditing}
    />
  );
};
