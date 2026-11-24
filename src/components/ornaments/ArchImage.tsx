import React from 'react'

/** A photo inside the heritage arch, with a gold hairline frame set inside it. */
export function ArchImage({
  src,
  alt,
  className = '',
  imgClassName = '',
}: {
  src: string
  alt: string
  className?: string
  imgClassName?: string
}) {
  return (
    <div className={`relative overflow-hidden rounded-t-[999px] bg-parchment ${className}`}>
      <img src={src} alt={alt} className={`portal-photo h-full w-full object-cover ${imgClassName}`} />
      <div className="pointer-events-none absolute inset-2.5 rounded-t-[999px] border border-[#fff2d2]/55" />
    </div>
  )
}
