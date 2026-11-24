import React, { useState } from 'react'
import { Check, Navigation, Printer, Share2 } from 'lucide-react'
import { Button } from '@/components/ui'

type ButtonProps = Omit<React.ComponentProps<typeof Button>, 'onClick'>

/** Opens directions to a place in the visitor's map app. */
export function DirectionsButton({ place, children, ...rest }: ButtonProps & { place: string }) {
  const go = () => {
    const q = encodeURIComponent(`${place}, xã Thư Lâm, Hà Nội`)
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${q}`, '_blank', 'noopener')
  }
  return (
    <Button variant="secondary" {...rest} onClick={go}>
      <Navigation className="h-4 w-4" /> {children ?? 'Chỉ đường'}
    </Button>
  )
}

export function PrintButton({ children, ...rest }: ButtonProps) {
  return (
    <Button variant="ghost" {...rest} onClick={() => window.print()}>
      <Printer className="h-4 w-4" /> {children ?? 'In'}
    </Button>
  )
}

/** Uses the phone's share sheet when there is one, otherwise copies the link and says so. */
export function ShareButton({ title, children, ...rest }: ButtonProps & { title: string }) {
  const [copied, setCopied] = useState(false)
  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title, url })
        return
      }
      await navigator.clipboard?.writeText(url)
    } catch {
      /* the visitor closed the share sheet */
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <Button variant="ghost" {...rest} onClick={share} aria-live="polite">
      {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />} {copied ? 'Đã sao chép liên kết' : (children ?? 'Chia sẻ')}
    </Button>
  )
}
