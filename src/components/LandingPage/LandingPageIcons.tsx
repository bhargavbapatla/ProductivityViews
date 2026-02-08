import React from 'react';

export const TreeViewIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Tree structure illustration */}
    <circle className="tree-node-1" cx="100" cy="30" r="12" fill="#667eea" opacity="0.9"/>
    <line className="tree-line-1" x1="100" y1="42" x2="100" y2="70" stroke="#95a5a6" strokeWidth="2.5"/>
    
    {/* Second level */}
    <line className="tree-line-2a" x1="100" y1="70" x2="60" y2="90" stroke="#95a5a6" strokeWidth="2.5"/>
    <line className="tree-line-2b" x1="100" y1="70" x2="140" y2="90" stroke="#95a5a6" strokeWidth="2.5"/>
    
    <circle className="tree-node-2a" cx="60" cy="90" r="10" fill="#764ba2" opacity="0.85"/>
    <circle className="tree-node-2b" cx="140" cy="90" r="10" fill="#764ba2" opacity="0.85"/>
    
    {/* Third level from left node */}
    <line className="tree-line-3a" x1="60" y1="100" x2="40" y2="125" stroke="#95a5a6" strokeWidth="2"/>
    <line className="tree-line-3b" x1="60" y1="100" x2="80" y2="125" stroke="#95a5a6" strokeWidth="2"/>
    
    <circle className="tree-node-3a" cx="40" cy="125" r="8" fill="#a8b3ff" opacity="0.8"/>
    <circle className="tree-node-3b" cx="80" cy="125" r="8" fill="#a8b3ff" opacity="0.8"/>
    
    {/* Third level from right node */}
    <line className="tree-line-3c" x1="140" y1="100" x2="120" y2="125" stroke="#95a5a6" strokeWidth="2"/>
    <line className="tree-line-3d" x1="140" y1="100" x2="160" y2="125" stroke="#95a5a6" strokeWidth="2"/>
    
    <circle className="tree-node-3c" cx="120" cy="125" r="8" fill="#a8b3ff" opacity="0.8"/>
    <circle className="tree-node-3d" cx="160" cy="125" r="8" fill="#a8b3ff" opacity="0.8"/>
    
    {/* Fourth level examples */}
    <line className="tree-line-4a" x1="40" y1="133" x2="30" y2="155" stroke="#bdc3c7" strokeWidth="1.5"/>
    <line className="tree-line-4b" x1="40" y1="133" x2="50" y2="155" stroke="#bdc3c7" strokeWidth="1.5"/>
    <line className="tree-line-4c" x1="160" y1="133" x2="150" y2="155" stroke="#bdc3c7" strokeWidth="1.5"/>
    <line className="tree-line-4d" x1="160" y1="133" x2="170" y2="155" stroke="#bdc3c7" strokeWidth="1.5"/>
    
    <circle className="tree-node-4a" cx="30" cy="155" r="6" fill="#d0d7ff" opacity="0.7"/>
    <circle className="tree-node-4b" cx="50" cy="155" r="6" fill="#d0d7ff" opacity="0.7"/>
    <circle className="tree-node-4c" cx="150" cy="155" r="6" fill="#d0d7ff" opacity="0.7"/>
    <circle className="tree-node-4d" cx="170" cy="155" r="6" fill="#d0d7ff" opacity="0.7"/>
  </svg>
);

export const KanbanBoardIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Kanban columns */}
    {/* Column 1 */}
    <rect className="kanban-col-1" x="15" y="30" width="50" height="140" rx="8" fill="#f8f9fa" stroke="#667eea" strokeWidth="2"/>
    <rect className="kanban-card-1-1" x="20" y="40" width="40" height="28" rx="4" fill="#667eea" opacity="0.9"/>
    <rect className="kanban-card-1-2" x="20" y="73" width="40" height="28" rx="4" fill="#667eea" opacity="0.7"/>
    <rect className="kanban-card-1-3" x="20" y="106" width="40" height="28" rx="4" fill="#667eea" opacity="0.5"/>
    
    {/* Column 2 */}
    <rect className="kanban-col-2" x="75" y="30" width="50" height="140" rx="8" fill="#f8f9fa" stroke="#764ba2" strokeWidth="2"/>
    <rect className="kanban-card-2-1" x="80" y="40" width="40" height="28" rx="4" fill="#764ba2" opacity="0.9"/>
    <rect className="kanban-card-2-2" x="80" y="73" width="40" height="28" rx="4" fill="#764ba2" opacity="0.7"/>
    
    {/* Column 3 */}
    <rect className="kanban-col-3" x="135" y="30" width="50" height="140" rx="8" fill="#f8f9fa" stroke="#a8b3ff" strokeWidth="2"/>
    <rect className="kanban-card-3-1" x="140" y="40" width="40" height="28" rx="4" fill="#a8b3ff" opacity="0.9"/>
    
    {/* Decorative dots for column headers */}
    <g className="kanban-dots-1">
      <circle cx="30" cy="22" r="2.5" fill="#667eea"/>
      <circle cx="38" cy="22" r="2.5" fill="#667eea"/>
      <circle cx="46" cy="22" r="2.5" fill="#667eea"/>
    </g>
    
    <g className="kanban-dots-2">
      <circle cx="90" cy="22" r="2.5" fill="#764ba2"/>
      <circle cx="98" cy="22" r="2.5" fill="#764ba2"/>
      <circle cx="106" cy="22" r="2.5" fill="#764ba2"/>
    </g>
    
    <g className="kanban-dots-3">
      <circle cx="150" cy="22" r="2.5" fill="#a8b3ff"/>
      <circle cx="158" cy="22" r="2.5" fill="#a8b3ff"/>
      <circle cx="166" cy="22" r="2.5" fill="#a8b3ff"/>
    </g>
  </svg>
);
