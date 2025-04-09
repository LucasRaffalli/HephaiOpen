import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import "@radix-ui/themes/styles.css";
import "@radix-ui/themes/layout.css";
import './index.css'
import '../electron/win/window.css'

import 'react-toastify/dist/ReactToastify.css';
import './demos/ipc'
import { BrowserRouter } from 'react-router-dom';
import { Theme, ThemePanel } from '@radix-ui/themes';
import { ThemeProvider, useTheme } from './utils/ThemeContext';
import './i18n';
import { WindowContextProvider } from '../electron/win/components/WindowContext';
import { menuItems } from '../electron/win';

const Root = () => {
  const { isDarkMode, accentColor } = useTheme();

  return (
    <Theme appearance={isDarkMode ? "dark" : "light"} accentColor={accentColor as any} radius="small" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <WindowContextProvider titlebar={{ title: 'Hephai Open', menuItems, icon: '/favicon.ico' }}>
        <App />
      </WindowContextProvider>
    </Theme>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Root />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);

postMessage({ payload: 'removeLoading' }, '*')
