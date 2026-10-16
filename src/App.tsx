import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { DashboardView } from './components/DashboardView';
import { RoomsView } from './components/RoomsView';
import { RoomLiveModal } from './components/RoomLiveModal';
import { CommunitiesView } from './components/CommunitiesView';
import { InboxView } from './components/InboxView';
import { DiscoverView } from './components/DiscoverView';
import { GamesView } from './components/GamesView';
import { AICoachView } from './components/AICoachView';
import { LearnView } from './components/LearnView';
import { AssessmentsView } from './components/AssessmentsView';
import { CertificatesView } from './components/CertificatesView';
import { EventsView } from './components/EventsView';
import { FriendsView } from './components/FriendsView';
import { ProfileView } from './components/ProfileView';
import { SettingsView } from './components/SettingsView';
import { PremiumView } from './components/PremiumView';
import { AdminView } from './components/AdminView';
import { SupportPage, SafetyPage, PrivacyPage, TermsPage } from './components/StaticPages';
import { SearchModal } from './components/SearchModal';
import { AuthModal } from './components/AuthModal';
import { Certificate } from './types/index';
import { INITIAL_CERTIFICATES } from './services/mockData';

const MainAppContent: React.FC = () => {
  const { activeRoom, joinRoom, leaveRoom } = useApp();

  // Determine initial route based on URL query or hash
  const getInitialRoute = () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      return 'dashboard';
    }
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    if (hash) return hash;
    return 'landing';
  };

  const [currentRoute, setCurrentRoute] = useState<string>(getInitialRoute);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [certificatesList, setCertificatesList] = useState<Certificate[]>(INITIAL_CERTIFICATES);

  // Sync route changes to hash for bookmarking and back-button
  const navigate = (route: string) => {
    setCurrentRoute(route);
    window.location.hash = `#/${route}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash && hash !== currentRoute) {
        setCurrentRoute(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentRoute]);

  // Keyboard shortcut Ctrl+K / Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCertificateIssued = (newCert: Certificate) => {
    setCertificatesList(prev => [newCert, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 flex flex-col font-sans selection:bg-[#635BFF] selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        currentRoute={currentRoute}
        navigate={navigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1" role="main">
        {currentRoute === 'landing' && <LandingPage navigate={navigate} />}
        {currentRoute === 'dashboard' && <DashboardView navigate={navigate} />}
        {currentRoute === 'rooms' && <RoomsView onJoinRoom={(room) => joinRoom(room)} />}
        {currentRoute === 'communities' && <CommunitiesView />}
        {currentRoute === 'inbox' && <InboxView />}
        {currentRoute === 'discover' && <DiscoverView navigate={navigate} />}
        {currentRoute === 'games' && <GamesView />}
        {currentRoute === 'ai-coach' && <AICoachView />}
        {currentRoute === 'learn' && <LearnView />}
        {currentRoute === 'assessments' && (
          <AssessmentsView
            onCertificateIssued={handleCertificateIssued}
            onViewCertificates={() => navigate('certificates')}
          />
        )}
        {currentRoute === 'certificates' && (
          <CertificatesView
            certificates={certificatesList}
            onTakeAssessment={() => navigate('assessments')}
          />
        )}
        {currentRoute === 'events' && <EventsView />}
        {currentRoute === 'friends' && <FriendsView navigate={navigate} />}
        {currentRoute === 'profile' && <ProfileView />}
        {currentRoute === 'settings' && <SettingsView />}
        {currentRoute === 'premium' && <PremiumView />}
        {currentRoute === 'admin' && <AdminView />}
        {currentRoute === 'support' && <SupportPage />}
        {currentRoute === 'safety' && <SafetyPage />}
        {currentRoute === 'privacy' && <PrivacyPage />}
        {currentRoute === 'terms' && <TermsPage />}
      </main>

      {/* Active Live Speaking Room Modal */}
      {activeRoom && (
        <RoomLiveModal
          room={activeRoom}
          onClose={leaveRoom}
        />
      )}

      {/* Global Omni-Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        navigate={navigate}
      />

      {/* Free Account Registration & Switcher Modal */}
      <AuthModal />

    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

export default App;
