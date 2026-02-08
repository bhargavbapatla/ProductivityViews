import React from 'react';
import { useView } from '../../context/ViewContext';
import { TreeViewIcon, KanbanBoardIcon } from './LandingPageIcons';
import './LandingPage.css';

export const LandingPage: React.FC = () => {
  const { setView } = useView();

  return (
    <div className="landing-page">
      <div className="container">
        <header>
          <h1>Choose Your View</h1>
          <p className="subtitle">Select how you'd like to organize your work</p>
        </header>

        <div className="cards-container">
          {/* Tree View Card */}
          <div className="card" onClick={() => setView('tree')}>
            <TreeViewIcon className="card-icon" />
            <h2>Tree View</h2>
            <p>Hierarchical structure to organize and visualize your data in nested levels</p>
            <span className="arrow">→</span>
          </div>

          {/* Kanban Board Card */}
          <div className="card" onClick={() => setView('kanban')}>
            <KanbanBoardIcon className="card-icon" />
            <h2>Kanban Board</h2>
            <p>Visual workflow management to track tasks through different stages</p>
            <span className="arrow">→</span>
          </div>
        </div>
      </div>
    </div>
  );
};
