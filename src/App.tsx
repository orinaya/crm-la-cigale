// src/App.tsx
import { useState } from 'react';
import { ReservationList } from './components/domain/ReservationList';
import { ReservationKanban } from './components/domain/ReservationKanban';
import { ReservationPlanning } from './components/domain/ReservationPlanning';
import { ReservationForm } from './components/domain/ReservationForm';
import { LayoutGrid, Calendar, List } from 'lucide-react';
import { Button } from './components/ui/Button';

type View = 'list' | 'kanban' | 'planning';

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentView, setCurrentView] = useState<View>('list');

  const handleCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="flex h-screen bg-lacigale-bg">
      {/* SIDEBAR */}
      <aside className="w-20 lg:w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-gray-100">
          <div className="h-8 w-8 bg-pink-400 rounded-full flex items-center justify-center text-white font-serif font-bold">C</div>
          <span className="ml-3 font-serif font-bold text-gray-800 hidden lg:block">La Cigale</span>
        </div>

        <nav className="flex-1 py-6 space-y-2 px-2 lg:px-4">
          <NavItem icon={<List />} label="Liste" active={currentView === 'list'} onClick={() => setCurrentView('list')} />
          <NavItem icon={<LayoutGrid />} label="Kanban" active={currentView === 'kanban'} onClick={() => setCurrentView('kanban')} />
          <NavItem icon={<Calendar />} label="Planning" active={currentView === 'planning'} onClick={() => setCurrentView('planning')} />
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* TOP BAR */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0">
          <h1 className="text-xl font-bold text-gray-800">
            {currentView === 'list' && 'Liste des Réservations'}
            {currentView === 'kanban' && 'Vue Kanban'}
            {currentView === 'planning' && 'Planning'}
          </h1>
          <div className="flex items-center gap-4">
            <Button onClick={() => setIsFormOpen(true)}>
              + Nouvelle Réservation
            </Button>
          </div>
        </header>

        {/* CONTENT */}
        <div className="flex-1 overflow-auto p-8">
          {currentView === 'list' && <ReservationList refreshTrigger={refreshTrigger} />}
          {currentView === 'kanban' && <ReservationKanban refreshTrigger={refreshTrigger} />}
          {currentView === 'planning' && <ReservationPlanning refreshTrigger={refreshTrigger} />}
        </div>
      </main>

      {/* MODAL */}
      {isFormOpen && (
        <ReservationForm
          onClose={() => setIsFormOpen(false)}
          onSuccess={handleCreated}
        />
      )}
    </div>
  );
}

const NavItem = ({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) => (
  <button onClick={onClick} className={`w-full flex items-center p-3 rounded-lg transition-colors ${active ? 'bg-pink-100 text-pink-600' : 'text-gray-500 hover:bg-gray-50'}`}>
    {icon}
    <span className="ml-3 font-medium hidden lg:block">{label}</span>
  </button>
)

export default App;
