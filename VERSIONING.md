# Guide de Versionnement pour HephaiOpen

## 📋 Étapes pour créer une nouvelle version

1. **Mettre à jour la version dans `package.json`**
   ```json
   {
     "version": "X.Y.Z"
   }
   ```
   - X : Version majeure (changements incompatibles)
   - Y : Version mineure (nouvelles fonctionnalités)
   - Z : Patch (corrections de bugs)

2. **Créer et pousser le tag**
   ```powershell
   # Créer le tag avec un message
   git tag -a vX.Y.Z -m "Version X.Y.Z"

   # Pousser le tag vers GitHub
   git push origin vX.Y.Z
   ```

3. **Si besoin de supprimer un tag**
   ```powershell
   # Supprimer le tag localement
   git tag -d vX.Y.Z

   # Supprimer le tag sur GitHub
   git push origin :refs/tags/vX.Y.Z
   ```

## 🔄 Processus de release

1. Le push d'un tag déclenche automatiquement le workflow GitHub Actions
2. Les fichiers générés seront :
   - `HephaiOpen_X.Y.Z.exe` (installateur principal)
   - `HephaiOpen_X.Y.Z.exe.blockmap` (pour les mises à jour différentielles)
   - `latest.yml` (métadonnées de la version)
   - Autres fichiers de configuration

## 📝 Bonnes pratiques

1. **Messages de commit**
   - feat: nouvelle fonctionnalité
   - fix: correction de bug
   - docs: documentation
   - style: formatage
   - refactor: refactoring du code
   - test: ajout/modification de tests
   - chore: maintenance

2. **Quand incrémenter la version**
   - Patch (0.0.X) : Corrections de bugs
   - Mineure (0.X.0) : Nouvelles fonctionnalités rétrocompatibles
   - Majeure (X.0.0) : Changements incompatibles

3. **Tests avant release**
   - Vérifier que l'application fonctionne en mode production
   - Tester la détection des mises à jour
   - Vérifier l'installation et la mise à jour

## 🔍 Vérification des releases

1. **Vérifier sur GitHub**
   - Aller sur la page Releases
   - Vérifier que tous les fichiers sont présents
   - Vérifier que le workflow s'est terminé avec succès

2. **Tester la mise à jour**
   - Installer une version précédente
   - Vérifier que la mise à jour est détectée
   - Vérifier que le téléchargement fonctionne
   - Vérifier que l'installation se fait correctement

## 🐛 Dépannage

1. **Le tag existe déjà**
   ```powershell
   # Supprimer et recréer le tag
   git tag -d vX.Y.Z
   git push origin :refs/tags/vX.Y.Z
   git tag -a vX.Y.Z -m "Version X.Y.Z"
   git push origin vX.Y.Z
   ```

2. **Problèmes de workflow**
   - Vérifier les logs dans GitHub Actions
   - S'assurer que `electron-builder.json5` est correctement configuré
   - Vérifier que le `GITHUB_TOKEN` a les bonnes permissions

## 📊 Structure des releases

```
release/
└── X.Y.Z/
    ├── HephaiOpen_X.Y.Z.exe            # Installateur
    ├── HephaiOpen_X.Y.Z.exe.blockmap   # Map pour mises à jour différentielles
    ├── latest.yml                      # Métadonnées de version
    ├── builder-debug.yml               # Logs de build
    └── builder-effective-config.yaml    # Configuration utilisée
```
