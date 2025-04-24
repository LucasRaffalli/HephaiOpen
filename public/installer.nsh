!macro customHeader
  ; Active le header avec image
  !define MUI_HEADERIMAGE
!define MUI_HEADERIMAGE_RIGHT
!define MUI_HEADERIMAGE_BITMAP "${BUILD_RESOURCES_DIR}/installerSidebar.bmp"
!macroend

!macro preInit
  ; Si besoin d'initialisation avant tout
!macroend

!macro customInit
  ; Logique personnalisée d'init
!macroend

!macro customInstall
  ; Logique personnalisée d’installation
!macroend

!macro customInstallMode
  ; set $isForceMachineInstall ou $isForceCurrentInstall si tu veux forcer un mode
!macroend

!macro customWelcomePage
  !insertmacro MUI_PAGE_WELCOME
!macroend

!macro customUnWelcomePage
  !define MUI_WELCOMEPAGE_TITLE "Welcome to HephaiOpen Setup"
  !define MUI_WELCOMEPAGE_TEXT "Setup will guide you through the installation of HephaiOpen.$\r$\nClick Next to continue."
  !insertmacro MUI_UNPAGE_WELCOME
!macroend
