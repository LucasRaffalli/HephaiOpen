import { createContext, useContext, useEffect, useState } from 'react'
import { Titlebar } from './Titlebar'
import type { TitlebarMenu } from '../titlebarMenus'
import { TitlebarContextProvider } from './TitlebarContext'
import { Box } from '@radix-ui/themes'

interface WindowContextProps {
  titlebar: TitlebarProps
  readonly window: WindowInitProps
}

interface WindowInitProps {
  width: number
  height: number
  maximizable: boolean
  minimizable: boolean
  platform: string
}

interface WindowContextProviderProps {
  children: React.ReactNode
  titlebar?: TitlebarProps
}

export interface TitlebarProps {
  title: string
  titleCentered?: boolean
  icon?: React.ReactNode | string
  menuItems?: TitlebarMenu[]
}

const WindowContext = createContext<WindowContextProps | undefined>(undefined)

export const WindowContextProvider = ({ children, titlebar }: WindowContextProviderProps) => {
  const [initProps, setInitProps] = useState<WindowInitProps | undefined>()

  const defaultTitlebar: TitlebarProps = {
    title: 'Electron React App',
    icon: null,
    titleCentered: false,
    menuItems: [],
  }

  // Merge default titlebar props with user defined props
  titlebar = { ...defaultTitlebar, ...titlebar }

  useEffect(() => {
    // Load window init props
    window.api.invoke('init-window')
      .then((value: WindowInitProps) => setInitProps(value))
      .catch((error) => {
        console.error('Failed to initialize window:', error)
        // Définir des valeurs par défaut en cas d'erreur
        setInitProps({
          width: 800,
          height: 600,
          maximizable: true,
          minimizable: true,
          platform: 'win32'
        })
      })

    // Add class to parent element
    const parent = document.querySelector('.window-content')?.parentElement
    if (parent) {
      parent.classList.add('window-frame')
    }
  }, [])

  return (
    <WindowContext.Provider value={{ titlebar, window: initProps! }}>
      <Box className="window-frame">
        <TitlebarContextProvider>
          <Titlebar />
        </TitlebarContextProvider>
        <>
          {children}
        </>
      </Box>
    </WindowContext.Provider>
  )
}

const WindowContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="window-content">{children}</div>
}

export const useWindowContext = () => {
  const context = useContext(WindowContext)
  if (context === undefined) {
    throw new Error('useWindowContext must be used within a WindowContextProvider')
  }
  return context
}
