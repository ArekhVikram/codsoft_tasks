import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxWidth: '380px',
          width: 'calc(100vw - 48px)',
          pointerEvents: 'none'
        }}
      >
        {toasts.map(toast => {
          let bg = '#1A1918';
          let border = '#333';
          let icon = <Info size={18} color="#FAF8F5" />;

          if (toast.type === 'success') {
            bg = '#223829';
            border = '#2E6845';
            icon = <CheckCircle2 size={18} color="#A3E5B9" />;
          } else if (toast.type === 'error') {
            bg = '#3B1D1B';
            border = '#8E2820';
            icon = <AlertCircle size={18} color="#F5A39B" />;
          }

          return (
            <div
              key={toast.id}
              role="alert"
              style={{
                background: bg,
                color: '#FAF8F5',
                border: `1px solid ${border}`,
                borderRadius: '4px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '0.875rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                pointerEvents: 'auto',
                animation: 'slideUpFade 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <span style={{ flexShrink: 0 }}>{icon}</span>
              <span style={{ flex: 1, lineHeight: 1.4 }}>{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  color: '#FAF8F5',
                  opacity: 0.6,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2px'
                }}
                aria-label="Dismiss notification"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
