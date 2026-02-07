import React, { useEffect, useState } from 'react';
import './modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  submitLabel?: string;
  isDestructive?: boolean;
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  onSubmit, 
  submitLabel = "Confirm",
  isDestructive = false
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300); // Match CSS transition
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : 'closed'}`} onClick={onClose}>
      <div 
        className={`modal-content ${isOpen ? 'open' : 'closed'}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          {onSubmit && (
            <button 
              className={`btn ${isDestructive ? 'btn-danger' : 'btn-primary'}`} 
              onClick={onSubmit}
            >
              {submitLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
