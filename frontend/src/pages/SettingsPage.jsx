import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  Shield, 
  Bell, 
  Eye, 
  Moon, 
  Sun, 
  Globe, 
  Key, 
  Trash2,
  Download,
  Upload,
  Save,
  Monitor
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Settings state
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      marketing: false,
      updates: true,
    },
    privacy: {
      profileVisible: true,
      showActivity: false,
      allowDirectMessages: true,
    },
    appearance: {
      theme: 'dark', // 'light', 'dark', 'auto'
      language: 'en',
      timezone: 'UTC',
    },
    security: {
      twoFactorEnabled: false,
      loginAlerts: true,
    }
  });

  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Settings saved:', settings);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Handle account deletion
      console.log('Account deletion requested');
      signOut();
      navigate('/');
    }
  };

  const handleExportData = () => {
    // Simulate data export
    const data = {
      user,
      settings,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'visioncast-data-export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Monitor },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Eye },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'data', label: 'Data & Storage', icon: Download },
  ];

  const ToggleSwitch = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <label className="text-white font-medium">{label}</label>
        {description && <p className="text-gray-400 text-sm mt-1">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-[#FFD700]' : 'bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-[#FFD700] mb-4">Appearance</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Theme</label>
                  <div className="flex gap-3">
                    {[
                      { value: 'light', label: 'Light', icon: Sun },
                      { value: 'dark', label: 'Dark', icon: Moon },
                      { value: 'auto', label: 'Auto', icon: Monitor }
                    ].map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => handleSettingChange('appearance', 'theme', value)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                          settings.appearance.theme === value
                            ? 'border-[#FFD700] bg-[#FFD700]/10 text-[#FFD700]'
                            : 'border-[#333333] bg-[#2A2A2A] text-gray-400 hover:border-[#FFD700]/50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Language</label>
                  <select
                    value={settings.appearance.language}
                    onChange={(e) => handleSettingChange('appearance', 'language', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-[#333333] bg-[#2A2A2A] text-white focus:outline-none focus:border-[#FFD700] transition-colors"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="zh">中文</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-[#FFD700] mb-4">Notification Preferences</h3>
              <div className="bg-[#2A2A2A] rounded-lg p-4 space-y-1">
                <ToggleSwitch
                  enabled={settings.notifications.email}
                  onChange={(value) => handleSettingChange('notifications', 'email', value)}
                  label="Email Notifications"
                  description="Receive updates via email"
                />
                <ToggleSwitch
                  enabled={settings.notifications.push}
                  onChange={(value) => handleSettingChange('notifications', 'push', value)}
                  label="Push Notifications"
                  description="Get notifications in your browser"
                />
                <ToggleSwitch
                  enabled={settings.notifications.marketing}
                  onChange={(value) => handleSettingChange('notifications', 'marketing', value)}
                  label="Marketing Emails"
                  description="Receive promotional content and offers"
                />
                <ToggleSwitch
                  enabled={settings.notifications.updates}
                  onChange={(value) => handleSettingChange('notifications', 'updates', value)}
                  label="Product Updates"
                  description="Stay informed about new features"
                />
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-[#FFD700] mb-4">Privacy Settings</h3>
              <div className="bg-[#2A2A2A] rounded-lg p-4 space-y-1">
                <ToggleSwitch
                  enabled={settings.privacy.profileVisible}
                  onChange={(value) => handleSettingChange('privacy', 'profileVisible', value)}
                  label="Public Profile"
                  description="Make your profile visible to other users"
                />
                <ToggleSwitch
                  enabled={settings.privacy.showActivity}
                  onChange={(value) => handleSettingChange('privacy', 'showActivity', value)}
                  label="Show Activity Status"
                  description="Let others see when you're online"
                />
                <ToggleSwitch
                  enabled={settings.privacy.allowDirectMessages}
                  onChange={(value) => handleSettingChange('privacy', 'allowDirectMessages', value)}
                  label="Allow Direct Messages"
                  description="Receive messages from other users"
                />
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-[#FFD700] mb-4">Security Settings</h3>
              <div className="bg-[#2A2A2A] rounded-lg p-4 space-y-4">
                <ToggleSwitch
                  enabled={settings.security.twoFactorEnabled}
                  onChange={(value) => handleSettingChange('security', 'twoFactorEnabled', value)}
                  label="Two-Factor Authentication"
                  description="Add an extra layer of security to your account"
                />
                <ToggleSwitch
                  enabled={settings.security.loginAlerts}
                  onChange={(value) => handleSettingChange('security', 'loginAlerts', value)}
                  label="Login Alerts"
                  description="Get notified of new login attempts"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#FFD700] mb-4">Password & Authentication</h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-[#2A2A2A] rounded-lg border border-[#333333] hover:border-[#FFD700] transition-colors flex items-center gap-3">
                  <Key className="w-5 h-5 text-[#FFD700]" />
                  <div>
                    <p className="text-white font-medium">Change Password</p>
                    <p className="text-gray-400 text-sm">Last changed 3 months ago</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-[#FFD700] mb-4">Data Management</h3>
              <div className="space-y-4">
                <button
                  onClick={handleExportData}
                  className="w-full text-left px-4 py-3 bg-[#2A2A2A] rounded-lg border border-[#333333] hover:border-[#FFD700] transition-colors flex items-center gap-3"
                >
                  <Download className="w-5 h-5 text-[#FFD700]" />
                  <div>
                    <p className="text-white font-medium">Export Your Data</p>
                    <p className="text-gray-400 text-sm">Download all your account data</p>
                  </div>
                </button>

                <button className="w-full text-left px-4 py-3 bg-[#2A2A2A] rounded-lg border border-[#333333] hover:border-[#FFD700] transition-colors flex items-center gap-3">
                  <Upload className="w-5 h-5 text-[#FFD700]" />
                  <div>
                    <p className="text-white font-medium">Import Data</p>
                    <p className="text-gray-400 text-sm">Import data from another service</p>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
              <div className="bg-red-900/10 border border-red-700/30 rounded-lg p-4">
                <button
                  onClick={handleDeleteAccount}
                  className="w-full text-left px-4 py-3 bg-red-900/20 rounded-lg border border-red-700/50 hover:border-red-500 transition-colors flex items-center gap-3"
                >
                  <Trash2 className="w-5 h-5 text-red-400" />
                  <div>
                    <p className="text-red-400 font-medium">Delete Account</p>
                    <p className="text-red-300/70 text-sm">Permanently delete your account and all data</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-[#0F0F0F] via-[#1A1A1A] to-[#2A2A2A] relative z-10">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-20 max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/ai')}
            className="flex items-center gap-2 text-gray-400 hover:text-[#FFD700] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">Settings</h1>
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="px-4 py-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black rounded-lg hover:from-[#FFC700] hover:to-[#FF9500] transition-all duration-300 font-medium flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-4">
              <nav className="space-y-2">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                      activeTab === id
                        ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black'
                        : 'text-gray-400 hover:text-white hover:bg-[#2A2A2A]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        div::-webkit-scrollbar {
          width: 6px;
        }
        div::-webkit-scrollbar-track {
          background: #1A1A1A;
        }
        div::-webkit-scrollbar-thumb {
          background: #FFD700;
          border-radius: 6px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: #FFA500;
        }
      `}</style>
    </div>
  );
};

export default SettingsPage;
