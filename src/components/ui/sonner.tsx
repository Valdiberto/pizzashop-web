'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Toaster as Sonner, ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  function useIsLgUp() {
    const [isLgUp, setIsLgUp] = useState(false)

    useEffect(() => {
      const mq = window.matchMedia('(min-width: 1024px)')
      const handleChange = () => setIsLgUp(mq.matches)
      handleChange()
      mq.addEventListener('change', handleChange)
      return () => mq.removeEventListener('change', handleChange)
    }, [])

    return isLgUp
  }
  const isLgUp = useIsLgUp()
  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      position={isLgUp ? 'bottom-right' : 'top-center'}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
