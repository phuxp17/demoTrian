import React from 'react'
import { Info } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

export function SampleNotice({ className }: { className?: string }) {
  return (
    <p className={twMerge('flex items-start gap-2 rounded-[10px] border border-gold-soft/75 bg-ivory px-4 py-3 text-[0.88rem] leading-relaxed text-ink-soft', className)}>
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
      <span>Thông tin hiển thị là dữ liệu minh hoạ, đang chờ đối chiếu với hồ sơ chính thức của cơ quan chức năng. Thân nhân có thể gửi đính chính qua mục Góp tư liệu.</span>
    </p>
  )
}
