// src/components/AppLayout.jsx
import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Icon from './Icon';
import { MODULE_GROUPS, TOPBAR_LINKS } from '../lib/modules';
import { storage } from '../lib/storage';
import './AppLayout.css';

export default function AppLayout() {
  const navigate = useNavigate();
  const profile = storage.getProfile();
  const notifications = storage.getNotifications();
  const unread = notifications.filter((n) => !n.read).length;
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const initials = (profile.name || 'You').trim().split(/\s+/).slice(0, 2).map((s) => s[0]).join('').toUpperCase();

  return (
    <div className="shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => navigate('/')}>
          <span className="brand-mark">TD</span>
          <span className="brand-name">TestDriller</span>
        </button>

        <nav className="navgroups">
          {MODULE_GROUPS.map((group) => (
            <div className="navgroup" key={group.label}>
              <div className="navgroup-label">{group.label}</div>
              {group.items.map((item) => (
                <NavLink
                  key={item.key}
                  to={item.path}
                  className={({ isActive }) => 'navitem' + (isActive ? ' active' : '')}
                >
                  <Icon name={item.icon} size={17} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-foot">
          <span className="mono">v0.1 scaffold · local data</span>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="topbar-links">
            {TOPBAR_LINKS.map((l) => (
              <NavLink key={l.key} to={l.path} className="topbar-link">
                {l.label}
              </NavLink>
            ))}
          </div>

          <div className="topbar-actions">
            <button className="icon-btn" onClick={() => navigate('/ai-tutor')} title="AI Tutor">
              <Icon name="send" size={17} />
            </button>

            <div className="popover-wrap">
              <button className="icon-btn" onClick={() => setNotifOpen((v) => !v)} title="Notifications">
                <Icon name="bell" size={18} />
                {unread > 0 && <span className="badge-dot">{unread}</span>}
              </button>
              {notifOpen && (
                <div className="popover">
                  <div className="popover-title">Notifications</div>
                  {notifications.length === 0 && <div className="popover-empty">Nothing yet.</div>}
                  {notifications.map((n) => (
                    <div key={n.id} className={'notif-row' + (n.read ? '' : ' unread')}>
                      <div className="notif-title">{n.title}</div>
                      <div className="notif-body">{n.body}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="popover-wrap">
              <button className="profile-btn" onClick={() => setProfileOpen((v) => !v)}>
                <span className="avatar">{initials || 'YOU'}</span>
                <Icon name="chevronDown" size={14} />
              </button>
              {profileOpen && (
                <div className="popover">
                  <div className="popover-title">{profile.name || 'Set up your profile'}</div>
                  <button className="popover-item" onClick={() => navigate('/profile')}>
                    <Icon name="user" size={15} /> Profile
                  </button>
                  <button className="popover-item" onClick={() => navigate('/feedback')}>
                    <Icon name="send" size={15} /> Send feedback
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
