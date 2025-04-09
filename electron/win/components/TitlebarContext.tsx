import { createContext, useContext, useState } from 'react'

interface TitlebarContextProps {
  activeMenuIndex: number | null
  setActiveMenuIndex: (index: number | null) => void
  menusVisible: boolean
  setMenusVisible: (visible: boolean) => void
  closeActiveMenu: () => void
  icon?: React.ReactNode
}

const TitlebarContext = createContext<TitlebarContextProps | undefined>(undefined)

export const TitlebarContextProvider = ({ children, icon }: { children: React.ReactNode, icon?: React.ReactNode }) => {
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null)
  const [menusVisible, setMenusVisible] = useState(false)
  const closeActiveMenu = () => setActiveMenuIndex(null)

  return (
    <TitlebarContext.Provider value={{ activeMenuIndex, setActiveMenuIndex, menusVisible, setMenusVisible, closeActiveMenu, icon }}>
      {children}
    </TitlebarContext.Provider>
  )
}

export const useTitlebarContext = () => {
  const context = useContext(TitlebarContext)
  if (context === undefined) {
    throw new Error('useTitlebarContext must be used within a TitlebarContext')
  }
  return context
}
