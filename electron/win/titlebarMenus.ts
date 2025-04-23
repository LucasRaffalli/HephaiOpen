import { t } from '../../src/i18n'

export interface TitlebarMenu {
  name: string
  items: TitlebarMenuItem[]
}

export interface TitlebarMenuItem {
  name: string
  action?: string
  actionParams?: (string | number | object)[]
  actionCallback?: () => void
  shortcut?: string
  items?: TitlebarMenuItem[]
}

export const menuItems: TitlebarMenu[] = [
  {
    name: t('menu.file.title'),
    items: [
      {
        name: t('menu.file.checkUpdate'),
        actionCallback: () => {
          window.location.hash = '/update';
        },
        shortcut: 'Ctrl + U'
      },
      {
        name: '---'
      },
      {
        name: t('menu.file.exit'),
        action: 'window-close',
      },
    ],
  },
  {
    name: t('menu.view.title'),
    items: [
      {
        name: t('menu.view.reload'),
        action: 'web-reload',
        shortcut: 'Ctrl + R',
      },
      {
        name: t('menu.view.devTools'),
        action: 'web-toggle-devtools',
        shortcut: 'Ctrl + Shift + i',
      },
      {
        name: t('menu.view.showNavbar'),
        action: 'static-show-navbar',
        shortcut: 'ctrl + l',
      },
      {
        name: '---',
      },
      {
        name: t('menu.view.actualSize'),
        action: 'web-actual-size',
        shortcut: 'Ctrl + 0',
      },
      {
        name: t('menu.view.zoomIn'),
        action: 'web-zoom-in',
        shortcut: 'Ctrl+ +',
      },
      {
        name: t('menu.view.zoomOut'),
        action: 'web-zoom-out',
        shortcut: 'Ctrl+ -',
      },
      {
        name: '---',
      },
      {
        name: t('menu.view.fullscreen'),
        action: 'web-toggle-fullscreen',
        shortcut: 'F11',
      },
    ],
  },
  {
    name: t('menu.window.title'),
    items: [
      {
        name: localStorage.getItem('isDarkMode') === 'true' 
          ? t('menu.window.lightMode') 
          : t('menu.window.darkMode'),
        action: 'window-darkmode-toggle',
        shortcut: 'Toggle',
        actionCallback: () => {
          const isDark = localStorage.getItem('isDarkMode') === 'true';
          localStorage.setItem('isDarkMode', (!isDark).toString());
          setTimeout(() => window.location.reload(), 100);
        },
      },
      {
        name: t('menu.window.shortcutsPanel'),
        action: 'static-show-panel',
        shortcut: 'alt + s',
      },
      {
        name: '---',
      },
      {
        name: t('menu.window.maximize'),
        action: 'window-maximize-toggle',
        shortcut: 'Toggle',
      },
      {
        name: t('menu.window.minimize'),
        action: 'window-minimize',
        shortcut: 'Ctrl + m',
      },
      {
        name: t('menu.window.close'),
        action: 'window-close',
        shortcut: 'Ctrl + w',
      },
    ],
  },
  {
    name: t('menu.credits.title'),
    items: [
      {
        name: 'Lucas Raffalli',
        action: 'web-open-url',
        actionParams: ['https://github.com/LucasRaffalli'],
        shortcut: '@LucasRaffalli',
      },
      {
        name: 'Guasam',
        action: 'web-open-url',
        actionParams: ['https://github.com/guasam'],
        shortcut: '@guasam',
      },
      {
        name: 'Electron',
        action: 'web-open-url',
        actionParams: ['https://github.com/electron-vite/electron-vite-react'],
        shortcut: '@Electron',
      },
    ],
  },
]
