import { useEffect, useRef, useState } from 'react'
import { useWindowContext } from './WindowContext'
import { useTitlebarContext } from './TitlebarContext'
import type { TitlebarMenu, TitlebarMenuItem } from '../titlebarMenus'
import { Box, Flex } from '@radix-ui/themes'
import HephaiIcon from '@/components/design/icons/hephai'

export const Titlebar = () => {
  const { title, icon, titleCentered, menuItems } = useWindowContext().titlebar
  const { menusVisible, setMenusVisible, closeActiveMenu } = useTitlebarContext()
  const wcontext = useWindowContext().window

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && menuItems?.length) {
        if (e.repeat) return
        if (menusVisible) closeActiveMenu()
        setMenusVisible(!menusVisible)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [menusVisible])

  return (
    <div className={`window-titlebar ${wcontext?.platform ? `platform-${wcontext.platform}` : ''}`}>
      {wcontext?.platform === 'win32' && (
        <div className="window-titlebar-icon">
          {typeof icon === 'string' ? (
            <Flex align={"center"} justify={"center"} > <HephaiIcon size={24} /> </Flex>
          ) : (
            icon
          )}
        </div>
      )}

      <div
        className={`window-titlebar-title ${menusVisible ? 'menus-visible' : ''}`}
        {...(titleCentered && { 'data-centered': true })}
        style={{ visibility: menusVisible ? 'hidden' : 'visible' }}
      >
        {title}
      </div>
      {menusVisible && <TitlebarMenu />}
      {wcontext?.platform === 'win32' && <TitlebarControls />}
    </div>
  )
}

const TitlebarMenu = () => {
  const { menuItems } = useWindowContext().titlebar

  if (!menuItems) return null

  return (
    <div className="window-titlebar-menu">
      {menuItems?.map((menu, index) => <TitlebarMenuItem key={index} menu={menu} index={index} />)}
    </div>
  )
}

const TitlebarMenuItem = ({ menu, index }: { menu: TitlebarMenu; index: number }) => {
  const { activeMenuIndex, setActiveMenuIndex } = useTitlebarContext()
  const menuItemRef = useRef<HTMLDivElement | null>(null)

  const togglePopup = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (activeMenuIndex === index) {
      menuItemRef.current?.classList.remove('active')
      setActiveMenuIndex(null)
    }
    else if (!menuItemRef.current?.classList.contains('active')) {
      setActiveMenuIndex(index)
      menuItemRef.current?.classList.add('active')
    }
  }

  const handleMouseOver = () => {
    if (activeMenuIndex != null) {
      setActiveMenuIndex(index)
    }
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuItemRef.current &&
      !menuItemRef.current.contains(event.target as Node) &&
      menuItemRef.current.classList.contains('active')
    ) {
      setActiveMenuIndex(null)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (activeMenuIndex !== index) {
      menuItemRef.current?.classList.remove('active')
    } else {
      menuItemRef.current?.classList.add('active')
    }
  }, [activeMenuIndex])

  return (
    <div className="titlebar-menuItem" ref={menuItemRef}>
      <div
        className="menuItem-label"
        onClick={(e) => togglePopup(e)}
        onMouseOver={handleMouseOver}
        onMouseDown={(e) => e.preventDefault()}
      >
        {menu.name}
      </div>
      {activeMenuIndex === index && <TitlebarMenuPopup menu={menu} />}
    </div>
  )
}

const TitlebarMenuPopup = ({ menu }: { menu: TitlebarMenu }) => {
  return (
    <div className="menuItem-popup">
      {menu.items.map((item, index) => (
        <TitlebarMenuPopupItem key={index} item={item} />
      ))}
    </div>
  )
}

const TitlebarMenuPopupItem = ({ item }: { item: TitlebarMenuItem }) => {
  const { setActiveMenuIndex } = useTitlebarContext()

  function handleAction() {
    if (typeof item.actionCallback === 'function') {
      item.actionCallback()
      setActiveMenuIndex(null)
      return
    }

    window.api.invoke(item.action!, ...(item.actionParams ? item.actionParams : []))
    setActiveMenuIndex(null)
  }

  if (item.name === '---') {
    return <div className="menuItem-popupItem menuItem-separator" />
  }

  return (
    <div
      className={`menuItem-popupItem ${item.action?.startsWith('static-') ? 'static' : ''}`}
      onClick={handleAction}
    >
      <div>{item.name}</div>
      {item.shortcut && <div className="menuItem-shortcut">{item.shortcut}</div>}
    </div>
  )
}

const TitlebarControls = () => {
  const closePath =
    'M 0,0 0,0.7 4.3,5 0,9.3 0,10 0.7,10 5,5.7 9.3,10 10,10 10,9.3 5.7,5 10,0.7 10,0 9.3,0 5,4.3 0.7,0 Z'
  const maximizePath = 'M 0,0 0,10 10,10 10,0 Z M 1,1 9,1 9,9 1,9 Z'
  const minimizePath = 'M 0,5 10,5 10,6 0,6 Z'
  const restorePath = 'M 0,0 0,10 10,10 10,0 Z M 1,1 9,1 9,9 1,9 Z'
  const wcontext = useWindowContext().window
  const [isMaximized, setIsMaximized] = useState(false)

  useEffect(() => {
    const handleMaximizeChange = (maximized: boolean) => {
      setIsMaximized(maximized)
    }
    window.api.on('window-maximized-change', handleMaximizeChange)
    return () => {
      window.api.removeListener('window-maximized-change', handleMaximizeChange)
    }
  }, [])

  return (
    <div className="window-titlebar-controls">
      {wcontext?.minimizable && <TitlebarControlButton label="minimize" svgPath={minimizePath} />}
      {wcontext?.maximizable && (
        <TitlebarControlButton label="maximize" svgPath={isMaximized ? restorePath : maximizePath} />
      )}
      <TitlebarControlButton label="close" svgPath={closePath} />
    </div>
  )
}

const TitlebarControlButton = ({ svgPath, label }: { svgPath: string; label: string }) => {
  const handleAction = () => {
    switch (label) {
      case 'minimize':
        window.api.invoke('window-minimize')
        break
      case 'maximize':
        window.api.invoke('window-maximize-toggle')
        break
      case 'close':
        window.api.invoke('window-close')
        break
      default:
        console.warn(`Unhandled action for label: ${label}`)
    }
  }

  return (
    <Box width="10" height="10" p={'1'} pl={"3"} pr={"3"} aria-label={label} className="titlebar-controlButton" onClick={handleAction}>
      <svg width="10" height="10">
        <path fill="currentColor" d={svgPath} />
      </svg>
    </Box>
  )
}
