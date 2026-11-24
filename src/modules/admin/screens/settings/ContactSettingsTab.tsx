import React from 'react'
import { Field, Input, Panel, Textarea } from '@/modules/admin/components'
import type { PortalSettings } from '@/services/settings'

type ContactState = PortalSettings['contact']

export function ContactSettingsTab({
  contact,
  onChange,
}: {
  contact: ContactState
  onChange: (updater: (prev: ContactState) => ContactState) => void
}) {
  return (
    <>
      <Panel title="Đơn vị quản lý" description="Hiện ở chân trang và trang Giới thiệu">
        <div className="grid gap-2.5 sm:grid-cols-2">
          <Field label="Tên đơn vị" required className="sm:col-span-2">
            <Input value={contact.orgName} onChange={(e) => onChange((c) => ({ ...c, orgName: e.target.value }))} />
          </Field>
          <Field label="Địa chỉ" className="sm:col-span-2">
            <Input value={contact.address} onChange={(e) => onChange((c) => ({ ...c, address: e.target.value }))} />
          </Field>
          <Field label="Điện thoại">
            <Input value={contact.phone} onChange={(e) => onChange((c) => ({ ...c, phone: e.target.value }))} />
          </Field>
          <Field label="Email">
            <Input value={contact.email} onChange={(e) => onChange((c) => ({ ...c, email: e.target.value }))} />
          </Field>
          <Field label="Giờ tiếp nhận" className="sm:col-span-2">
            <Input value={contact.hours} onChange={(e) => onChange((c) => ({ ...c, hours: e.target.value }))} />
          </Field>
        </div>
      </Panel>
      <Panel title="Đầu mối hỗ trợ tra cứu" description="Người dân liên hệ khi không tìm thấy thân nhân">
        <div className="grid gap-2.5 sm:grid-cols-2">
          <Field label="Cán bộ phụ trách">
            <Input value={contact.supportOfficer} onChange={(e) => onChange((c) => ({ ...c, supportOfficer: e.target.value }))} />
          </Field>
          <Field label="Số điện thoại">
            <Input value={contact.supportPhone} onChange={(e) => onChange((c) => ({ ...c, supportPhone: e.target.value }))} />
          </Field>
          <Field label="Lời nhắn trên trang tra cứu" className="sm:col-span-2" hint="Tối đa 200 ký tự">
            <Textarea value={contact.searchNote} onChange={(e) => onChange((c) => ({ ...c, searchNote: e.target.value }))} />
          </Field>
        </div>
      </Panel>
    </>
  )
}
