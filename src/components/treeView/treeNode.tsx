import React, { useState, useEffect } from 'react';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AddIcon, DeleteIcon } from '../Icons/Icons';
import './treeView.css';
import type { TreeNodeData } from '../../types';

interface TreeNodeProps {
  node: TreeNodeData;
  levelCode: number;
  onDelete: (id: string) => void;
  onEdit: (id: string, newName: string) => void;
  onAdd: (parentId: string) => void;
  onLoadChildren: (id: string) => Promise<void>;
  activeDragLevel?: number | null;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, onDelete, onEdit, onAdd, onLoadChildren, levelCode, activeDragLevel }) => {
  const [isExpanded, setIsExpanded] = useState(levelCode === 65);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(node.name);

  const [isLoading, setIsLoading] = useState(false);
  const [isOverflowVisible, setIsOverflowVisible] = useState(false); // Fix for tooltip clipping
  
  // Requirement: Auto-expand when child nodes are added
  useEffect(() => {
    if (node.children && node.children.length > 0) setIsExpanded(true);
  }, [node.children?.length]);

  // Manage overflow visibility for animations vs tooltips
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isExpanded) {
      // Wait for transition (300ms) then allow overflow for tooltips
      timer = setTimeout(() => {
        setIsOverflowVisible(true);
      }, 350); // Slightly longer than CSS transition to be safe
    } else {
      // Immediately hide overflow when collapsing starts
      setIsOverflowVisible(false);
    }
    return () => clearTimeout(timer);
  }, [isExpanded]);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: node.id });

  // Requirement: Expand icon changes and Lazy Loading simulation
  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isExpanded) {
      setIsExpanded(false);
      return;
    }

    // Lazy load if not loaded and expected to have children
    if (!node.isLoaded && (node.hasChildren || (node.children?.length === 0))) {
      setIsLoading(true);
      try {
        await onLoadChildren(node.id);
      } catch (error) {
        console.error("Failed to load children", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    setIsExpanded(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Simply trigger the parent's delete handler which opens the modal
    onDelete(node.id);
  };

  const handleEditSubmit = () => {
    if (editName.trim() !== '' && editName !== node.name) {
      onEdit(node.id, editName);
    }
    setIsEditing(false);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.stopPropagation(); // Prevent drag from starting
      handleEditSubmit();
    } else if (e.key === 'Escape') {
      e.stopPropagation();
      setEditName(node.name);
      setIsEditing(false);
    }
  };

  const currentLetter = String.fromCharCode(levelCode);
  const iconColors: Record<string, string> = { A: '#3498db', B: '#7ed321', C: '#95de44', D: '#b8e986' };

  // Disable interaction with children nodes when dragging a parent node to prevent collision issues
  const isInteractionDisabled = activeDragLevel !== null && activeDragLevel !== undefined && levelCode > activeDragLevel;

  return (
    <div 
      ref={setNodeRef} 
      style={{ 
        transform: CSS.Translate.toString(transform), 
        transition, 
        opacity: isDragging ? 0.5 : 1,
        pointerEvents: isInteractionDisabled ? 'none' : 'auto'
      }} 
      className="node-wrapper"
    >
      <div className="node-item" {...attributes} {...listeners}>
        <div 
          className="circle-icon" 
          style={{ backgroundColor: iconColors[currentLetter] || '#7ed321' }}
          onClick={handleToggle}
        >
          {isLoading ? <div className="loading-spinner" /> : currentLetter}
        </div>
        
        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleEditSubmit}
            onKeyDown={handleEditKeyDown}
            autoFocus
            className="node-input"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="node-label" onDoubleClick={() => setIsEditing(true)}>
            {node.name}
          </span>
        )}

        <button 
          className="action-btn add-btn" 
          onPointerDown={e => e.stopPropagation()} 
          onClick={() => onAdd(node.id)}
          aria-label="Add Child Node"
          data-tooltip="Add Child Node"
        >
          <AddIcon />
        </button>
        {levelCode !== 65 && (
          <button 
            className="action-btn delete-btn" 
            onPointerDown={(e) => e.stopPropagation()} 
            onClick={handleDelete} 
            aria-label="Delete Node"
            data-tooltip="Delete Node"
          >
            <DeleteIcon />
          </button>
        )}
      </div>

      <div className={`children-grid-wrapper ${isExpanded ? 'expanded' : ''}`}>
        <div className="children-container" style={{ overflow: isOverflowVisible ? 'visible' : 'hidden' }}>
          <SortableContext items={node.children?.map(c => c.id) || []} strategy={verticalListSortingStrategy}>
            {node.children?.map((child) => (
              <TreeNode 
                key={child.id} 
                node={child} 
                levelCode={levelCode + 1} 
                onDelete={onDelete} 
                onEdit={onEdit} 
                onAdd={onAdd}
                onLoadChildren={onLoadChildren}
                activeDragLevel={activeDragLevel}
              />
            ))}
          </SortableContext>
        </div>
      </div>
    </div>
  );
};

export default TreeNode;