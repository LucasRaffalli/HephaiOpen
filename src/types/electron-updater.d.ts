interface VersionInfo {
  releaseNotes: string
  update: boolean
  version: string
  newVersion?: string
}

interface ErrorType {
  message: string
  error: Error
}
