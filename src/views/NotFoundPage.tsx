import { t } from 'i18next'

export default function NotFoundPage() {
  setTimeout(() => {
    window.location.href = '/'
  }, 1000)
  return (
    <div>{t('text.notFound')}</div>
  )
}
