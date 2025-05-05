; === Sidebar Image Macros ===
!macro customSidebar
  ; Active l'image de barre latérale pour l'installation
  !define MUI_WELCOMEFINISHPAGE_BITMAP "${BUILD_RESOURCES_DIR}/installerSidebar.bmp"
!macroend

!macro customUnSidebar
  ; Active l'image de barre latérale pour la désinstallation
  !define MUI_UNWELCOMEFINISHPAGE_BITMAP "${BUILD_RESOURCES_DIR}/uninstallerSidebar.bmp"
!macroend

; === Initialization Macros ===
!macro preInit
  ; Configuration avant initialisation NSIS (optionnel pour plus tard)
!macroend

!macro customInit
  ; --- Vérifie s'il existe une ancienne installation
  ReadRegStr $R0 HKCU "Software\HephaiOpen" "InstallPath"
  ${If} $R0 != ""
    MessageBox MB_ICONINFORMATION|MB_OK "Une ancienne installation de HephaiOpen est détectée à : $R0$\r$\nL'installation va mettre à jour cette version."
  ${EndIf}

  ; --- Nettoyage d'une ancienne installation si nécessaire
  IfFileExists "$PROGRAMFILES\HephaiOpen\*" 0 +3
    MessageBox MB_YESNO "Ancienne version détectée dans Program Files. Voulez-vous la supprimer avant d'installer ?" IDNO +2
    RMDir /r "$PROGRAMFILES\HephaiOpen"

  ; --- Vérification des droits administrateur
  UserInfo::GetAccountType
  Pop $0
  ${If} $0 != "admin"
    MessageBox MB_ICONSTOP "Des droits administrateur sont nécessaires pour installer HephaiOpen."
    Abort
  ${EndIf}

  ; --- Détection d'une installation silencieuse (facultatif)
  ${If} ${Silent}
    MessageBox MB_OK "Installation silencieuse détectée. Aucune interaction utilisateur."
  ${EndIf}
!macroend

; === Installation Mode Macro ===
!macro customInstallMode
  ; set $isForceMachineInstall ou $isForceCurrentInstall si tu veux forcer un mode
!macroend

; === Installation Macros ===
!macro customInstall
  ; Logique personnalisée d'installation
!macroend

; === Pages Macros ===
!macro customWelcomePage
  !insertmacro MUI_PAGE_WELCOME
!macroend

!macro customUnWelcomePage
  ; Texte personnalisé pour l'écran de désinstallation
  !define MUI_WELCOMEPAGE_TITLE "Welcome to HephaiOpen Uninstall"
  !define MUI_WELCOMEPAGE_TEXT "This will remove HephaiOpen from your computer.$\r$\nClick Next to continue."
  !insertmacro MUI_UNPAGE_WELCOME
!macroend
