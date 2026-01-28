
import React, { useState } from 'react';
import { Bell, Check, Info, AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../components/GlassCard';
import Button from '../../components/Button';
import { useUser } from '../../context/UserContext';
import { Notification } from '../../types';

const Notifications: React.FC = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsRead, deleteNotification } = useUser();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const navigate = useNavigate();

  const filteredList = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.read);

  const getIcon = (type: string) => {
    switch(type) {
      case 'success': return <CheckCircle className="text-green-500" size={20} />;
      case 'warning': return <AlertTriangle className="text-yellow-500" size={20} />;
      case 'alert': return <Bell className="text-red-500" size={20} />;
      default: return <Info className="text-accent-blue" size={20} />;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    markNotificationAsRead(notification.id);
    
    // If this notification is linked to an application, navigate to it
    if (notification.relatedAppId) {
        navigate('/dashboard/applications', { state: { openAppId: notification.relatedAppId } });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notifications</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm">Stay updated with your applications and deadlines.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="ghost" size="sm" onClick={markAllNotificationsRead} className="text-accent-blue">
             Mark all as read
           </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6 border-b border-slate-200 dark:border-white/10 pb-1">
        <button 
          onClick={() => setFilter('all')}
          className={`pb-2 px-1 text-sm font-medium transition-colors relative ${filter === 'all' ? 'text-accent-blue' : 'text-slate-500 hover:text-slate-800 dark:text-gray-400 dark:hover:text-white'}`}
        >
          All Notifications
          {filter === 'all' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-accent-blue rounded-t-full"></div>}
        </button>
        <button 
          onClick={() => setFilter('unread')}
          className={`pb-2 px-1 text-sm font-medium transition-colors relative ${filter === 'unread' ? 'text-accent-blue' : 'text-slate-500 hover:text-slate-800 dark:text-gray-400 dark:hover:text-white'}`}
        >
          Unread
          {filter === 'unread' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-accent-blue rounded-t-full"></div>}
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredList.length > 0 ? (
          filteredList.map(item => (
            <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className="cursor-pointer"
            >
                <GlassCard 
                className={`p-4 flex gap-4 items-start transition-all ${!item.read ? 'bg-white/80 dark:bg-navy-800/80 border-l-4 border-l-accent-blue' : 'opacity-80'}`}
                hoverEffect={true}
                >
                <div className={`mt-1 p-2 rounded-full shrink-0 ${!item.read ? 'bg-accent-blue/10' : 'bg-slate-100 dark:bg-white/5'}`}>
                    {getIcon(item.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                    <h3 className={`text-sm font-bold mb-1 ${!item.read ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-gray-400'}`}>
                        {item.title}
                    </h3>
                    <span className="text-xs text-slate-400 shrink-0 ml-2">{item.date}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed">
                    {item.message}
                    </p>
                </div>

                <div className="flex flex-col gap-1" onClick={(e) => e.stopPropagation()}>
                    {!item.read && (
                    <button 
                        onClick={() => markNotificationAsRead(item.id)}
                        className="p-1.5 text-slate-400 hover:text-accent-blue rounded-lg hover:bg-slate-100 dark:hover:bg-white/10"
                        title="Mark as read"
                    >
                        <Check size={16} />
                    </button>
                    )}
                    <button 
                    onClick={() => deleteNotification(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10"
                    title="Delete"
                    >
                    <Trash2 size={16} />
                    </button>
                </div>
                </GlassCard>
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="text-slate-400" size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No notifications</h3>
            <p className="text-slate-500 dark:text-gray-400">You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
