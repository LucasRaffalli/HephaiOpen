import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import "@radix-ui/themes/styles.css";
import "@radix-ui/themes/layout.css";
import './index.css'
import '../electron/win/window.css'
import { HashRouter } from 'react-router-dom';
import { Theme } from '@radix-ui/themes';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import './i18n';
import { WindowContextProvider } from '../electron/win/components/WindowContext';
import { menuItems } from '../electron/win';
import { HephaiProvider } from './context/HephaiContext';
import { UpdateProvider } from './context/UpdateContext';


const Root = () => {
  const { isDarkMode, accentColor } = useTheme();


  useEffect(() => {
    const timeout = setTimeout(() => {
      postMessage({ payload: 'removeLoading' }, '*');
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Theme appearance={isDarkMode ? "dark" : "light"} accentColor={accentColor as any} radius="small" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <WindowContextProvider titlebar={{ title: 'HephaiOpen', menuItems, icon: '/favicon.ico' }}>
        <UpdateProvider>
          <HephaiProvider>
            <App />
          </HephaiProvider>
        </UpdateProvider>
      </WindowContextProvider>
    </Theme>
  );
};

const rootElement = document.getElementById('root');

ReactDOM.createRoot(rootElement as HTMLElement).render(
  <ThemeProvider>
    <HashRouter>
      <Root />
    </HashRouter>
  </ThemeProvider>
);
