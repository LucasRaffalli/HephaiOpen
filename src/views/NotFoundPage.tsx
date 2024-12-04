import React from 'react'

export default function NotFoundPage() {
  setTimeout(() => {
    window.location.href = '/'
  }, 1000)
  return (
    <div>NotFoundPage</div>
  )
}
