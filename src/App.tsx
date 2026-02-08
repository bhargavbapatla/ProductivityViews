import { ViewProvider, useView } from './context/ViewContext';
import { TreeView } from './components/treeView/treeView';
import { KanbanBoard } from './components/KanbanBoard/KanbanBoard';
import { LandingPage } from './components/LandingPage/LandingPage';
import { BackIcon } from './components/Icons/Icons';
import './App.css';

const MainLayout = () => {
  const { currentView, setView } = useView();

  if (currentView === 'landing') {
    return <LandingPage />;
  }

  return (
    <div className="app-content">
      <header className="app-header">
        <button 
          className="back-button" 
          onClick={() => setView('landing')}
        >
          <BackIcon /> Back to Home
        </button>
        <h1 className="header-title">
          {currentView === 'tree' ? 'Tree View Visualization' : 'Project Kanban Board'}
        </h1>
        <div className="header-spacer"></div>
      </header>

      <main className="main-container">
        {currentView === 'tree' ? <TreeView /> : <KanbanBoard />}
      </main>
    </div>
  );
};

function App() {
  return (
    <ViewProvider>
      <MainLayout />
    </ViewProvider>
  );
}

export default App;
