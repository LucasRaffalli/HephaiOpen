import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import "@radix-ui/themes/styles.css";
import "@radix-ui/themes/layout.css";
import './index.css'
import '../electron/win/window.css'
import { HashRouter } from 'react-router-dom';
import { Theme } from '@radix-ui/themes';
import { ThemeProvider, useTheme } from './utils/ThemeContext';
import './i18n';
import { WindowContextProvider } from '../electron/win/components/WindowContext';
import { menuItems } from '../electron/win';
import { HephaiProvider } from './context/HephaiContext';

console.log("Main.tsx - Début du chargement");

const Root = () => {
  console.log("Main.tsx - Rendu du composant Root");
  const { isDarkMode, accentColor } = useTheme();

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      postMessage({ payload: 'removeLoading' }, '*');
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Theme appearance={isDarkMode ? "dark" : "light"} accentColor={accentColor as any} radius="small" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <WindowContextProvider titlebar={{ title: 'Hephai Open', menuItems, icon: '/favicon.ico' }}>
        <HephaiProvider>
          <App />
        </HephaiProvider>
      </WindowContextProvider>
    </Theme>
  );
};

console.log("Main.tsx - Avant le createRoot");
const rootElement = document.getElementById('root');
console.log("Root element trouvé:", rootElement);

ReactDOM.createRoot(rootElement as HTMLElement).render(
  <ThemeProvider>
    <HashRouter>
      <Root />
    </HashRouter>
  </ThemeProvider>
);
