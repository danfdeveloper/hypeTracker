// app/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const NBA_TEAMS = [
  'Atlanta Hawks', 'Boston Celtics', 'Brooklyn Nets', 'Charlotte Hornets',
  'Chicago Bulls', 'Cleveland Cavaliers', 'Dallas Mavericks', 'Denver Nuggets',
  'Detroit Pistons', 'Golden State Warriors', 'Houston Rockets', 'Indiana Pacers',
  'LA Clippers', 'Los Angeles Lakers', 'Memphis Grizzlies', 'Miami Heat',
  'Milwaukee Bucks', 'Minnesota Timberwolves', 'New Orleans Pelicans', 'New York Knicks',
  'Oklahoma City Thunder', 'Orlando Magic', 'Philadelphia 76ers', 'Phoenix Suns',
  'Portland Trail Blazers', 'Sacramento Kings', 'San Antonio Spurs', 'Toronto Raptors',
  'Utah Jazz', 'Washington Wizards'
];

const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' },
];

export default function ProfilePage() {
  const { user, profile, loading, updateProfile, signOut } = useAuth();
  const router = useRouter();
  const [favoriteTeam, setFavoriteTeam] = useState('');
  const [timezone, setTimezone] = useState('America/New_York');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (profile) {
      setFavoriteTeam(profile.favorite_team || '');
      setTimezone(profile.timezone || 'America/New_York');
    }
  }, [profile]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');

    try {
      await updateProfile({
        favorite_team: favoriteTeam || null,
        timezone,
      });
      setSaveMessage('Profile updated successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err: any) {
      setSaveMessage(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const goToHome = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Wavy Gradient Background */}
      <div
        className="fixed inset-0"
        style={{
          background: 'linear-gradient(125deg, rgba(147, 51, 234, 0.4) 0%, rgba(0, 0, 0, 0.9) 40%, rgba(147, 51, 234, 0.3) 70%, rgba(0, 0, 0, 0.9) 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradientWave 8s ease infinite',
          zIndex: 0
        }}
      />
      <style jsx>{`
        @keyframes gradientWave {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* Content */}
      <div className="relative" style={{ zIndex: 2 }}>
        <Header 
          title="hypeTracker" 
          subtitle="Manage your profile" 
          onButtonClick={goToHome}
          showProfile={false}
        />

        <main className="max-w-2xl mx-auto px-6 py-12">
          <div className="bg-black/80 backdrop-blur-sm border border-zinc-800 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Profile Settings</h2>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Sign Out
              </button>
            </div>

            {/* User Email */}
            <div className="mb-8 p-4 bg-zinc-800/50 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Email</p>
              <p className="text-lg">{user.email}</p>
            </div>

            {/* Save Message */}
            {saveMessage && (
              <div className={`mb-6 p-3 border rounded-lg text-sm ${
                saveMessage.includes('success')
                  ? 'bg-green-500/10 border-green-500/50 text-green-400'
                  : 'bg-red-500/10 border-red-500/50 text-red-400'
              }`}>
                {saveMessage}
              </div>
            )}

            {/* Favorite Team */}
            <div className="mb-6">
              <label htmlFor="favoriteTeam" className="block text-sm font-medium text-gray-300 mb-2">
                Favorite Team
              </label>
              <select
                id="favoriteTeam"
                value={favoriteTeam}
                onChange={(e) => setFavoriteTeam(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="">Select a team...</option>
                {NBA_TEAMS.map((team) => (
                  <option key={team} value={team}>
                    {team}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-sm text-gray-400">
                Your favorite team's games will be highlighted
              </p>
            </div>

            {/* Timezone */}
            <div className="mb-8">
              <label htmlFor="timezone" className="block text-sm font-medium text-gray-300 mb-2">
                Time Zone
              </label>
              <select
                id="timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-sm text-gray-400">
                Game times will be displayed in your local time zone
              </p>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}