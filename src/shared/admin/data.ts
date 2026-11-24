import type { StatusKey } from './ui'

/** Dữ liệu mẫu phục vụ thiết kế trang quản trị. Tên người, số liệu là minh hoạ. */

export type Account = {
  id: string
  name: string
  email: string
  role: string
  scope: string
  lastSeen: string
  status: Extract<StatusKey, 'active' | 'locked'>
}

export const ROLES = ['Quản trị hệ thống', 'Lãnh đạo phê duyệt', 'Biên tập viên', 'Cán bộ nhập liệu', 'Cán bộ thôn']

export const ACCOUNTS: Account[] = [
  { id: 'u1', name: 'Nguyễn Minh Đức', email: 'duc.nm@thulam.hanoi.gov.vn', role: 'Quản trị hệ thống', scope: 'Toàn xã', lastSeen: '5 phút trước', status: 'active' },
  { id: 'u2', name: 'Phạm Quang Huy', email: 'huy.pq@thulam.hanoi.gov.vn', role: 'Lãnh đạo phê duyệt', scope: 'Toàn xã', lastSeen: 'Hôm nay, 08:12', status: 'active' },
  { id: 'u3', name: 'Trần Thu Hà', email: 'ha.tt@thulam.hanoi.gov.vn', role: 'Biên tập viên', scope: 'Nội dung, tư liệu', lastSeen: 'Đang trực tuyến', status: 'active' },
  { id: 'u4', name: 'Lê Văn Bình', email: 'binh.lv@thulam.hanoi.gov.vn', role: 'Cán bộ nhập liệu', scope: 'NTLS Thụy Lâm, NTLS Vân Hà', lastSeen: 'Hôm qua, 16:40', status: 'active' },
  { id: 'u5', name: 'Đỗ Thị Mai', email: 'mai.dt@thulam.hanoi.gov.vn', role: 'Cán bộ nhập liệu', scope: 'NTLS Liên Hà', lastSeen: '12/09/2025', status: 'active' },
  { id: 'u6', name: 'Ngô Văn Tùng', email: 'tung.nv@gmail.com', role: 'Cán bộ thôn', scope: 'Thôn Đào Thục', lastSeen: '28/08/2025', status: 'locked' },
  { id: 'u7', name: 'Hoàng Thị Yến', email: 'yen.ht@thulam.hanoi.gov.vn', role: 'Cán bộ thôn', scope: 'Thôn Biểu Khê, Cổ Miếu', lastSeen: '10/09/2025', status: 'active' },
  { id: 'u8', name: 'Vũ Đình Khang', email: 'khang.vd@thulam.hanoi.gov.vn', role: 'Biên tập viên', scope: 'Nội dung', lastSeen: '01/07/2025', status: 'locked' },
]

export type ReviewItem = {
  id: string
  title: string
  kind: 'Liệt sĩ' | 'Người có công' | 'Địa chỉ đỏ' | 'Bài viết' | 'Gia đình' | 'Media'
  change: string
  by: string
  at: string
  status: Extract<StatusKey, 'pending' | 'returned' | 'published'>
  waitDays: number
}

export const REVIEWS: ReviewItem[] = [
  { id: 'v1', title: 'Liệt sĩ Nguyễn Văn Thành', kind: 'Liệt sĩ', change: 'Cập nhật ảnh chân dung, đơn vị', by: 'Lê Văn Bình', at: '14/09/2025 09:20', status: 'pending', waitDays: 3 },
  { id: 'v2', title: 'Liệt sĩ Chu Văn Đạt', kind: 'Liệt sĩ', change: 'Hồ sơ mới · gán Khu C · Hàng 1 · Mộ 06', by: 'Lê Văn Bình', at: '14/09/2025 08:55', status: 'pending', waitDays: 3 },
  { id: 'v3', title: 'Lễ dâng hương tri ân 27/7', kind: 'Bài viết', change: 'Bài viết mới', by: 'Trần Thu Hà', at: '15/09/2025 15:02', status: 'pending', waitDays: 2 },
  { id: 'v4', title: 'Mẹ Phạm Thị Nga', kind: 'Người có công', change: 'Bổ sung tiểu sử, 3 tư liệu', by: 'Hoàng Thị Yến', at: '13/09/2025 10:11', status: 'pending', waitDays: 4 },
  { id: 'v5', title: 'Đình Đào Thục', kind: 'Địa chỉ đỏ', change: 'Sửa toạ độ bản đồ', by: 'Trần Thu Hà', at: '16/09/2025 11:47', status: 'pending', waitDays: 1 },
  { id: 'v6', title: 'Liệt sĩ Đào Văn Cừ', kind: 'Liệt sĩ', change: 'Sửa năm sinh 1931 → 1932', by: 'Đỗ Thị Mai', at: '11/09/2025 14:30', status: 'returned', waitDays: 6 },
  { id: 'v7', title: 'Gia đình bà Trần Thị Mai', kind: 'Gia đình', change: 'Địa chỉ mới, ảnh nhà', by: 'Hoàng Thị Yến', at: '12/09/2025 09:05', status: 'returned', waitDays: 5 },
  { id: 'v8', title: 'Album: Nghĩa trang Vân Hà 2025', kind: 'Media', change: '24 ảnh mới', by: 'Trần Thu Hà', at: '16/09/2025 16:20', status: 'pending', waitDays: 1 },
  { id: 'v9', title: 'Liệt sĩ Ngô Văn Sinh', kind: 'Liệt sĩ', change: 'Hồ sơ mới · nghi trùng', by: 'Đỗ Thị Mai', at: '15/09/2025 08:40', status: 'pending', waitDays: 2 },
]

export type Article = {
  id: string
  title: string
  category: string
  author: string
  updated: string
  status: Extract<StatusKey, 'draft' | 'pending' | 'returned' | 'published' | 'scheduled'>
  views: number
}

export const ARTICLES: Article[] = [
  { id: 'a1', title: 'Ra mắt Cổng thông tin Tri ân Thư Lâm', category: 'Hoạt động', author: 'Trần Thu Hà', updated: '15/07/2025', status: 'published', views: 4820 },
  { id: 'a2', title: 'Lễ dâng hương tri ân nhân Ngày Thương binh – Liệt sĩ 27/7', category: 'Sự kiện', author: 'Trần Thu Hà', updated: '16/09/2025', status: 'pending', views: 0 },
  { id: 'a3', title: 'Kêu gọi thân nhân bổ sung hình ảnh, kỷ vật liệt sĩ', category: 'Thông báo', author: 'Vũ Đình Khang', updated: '02/08/2025', status: 'published', views: 2135 },
  { id: 'a4', title: 'Hướng dẫn tra cứu thông tin liệt sĩ trên cổng thông tin', category: 'Hướng dẫn', author: 'Trần Thu Hà', updated: '10/08/2025', status: 'published', views: 3302 },
  { id: 'a5', title: 'Đoàn viên thanh niên chăm sóc phần mộ liệt sĩ', category: 'Hoạt động', author: 'Hoàng Thị Yến', updated: '14/09/2025', status: 'returned', views: 0 },
  { id: 'a6', title: 'Số hoá sơ đồ phần mộ các nghĩa trang liệt sĩ', category: 'Thông báo', author: 'Trần Thu Hà', updated: '17/09/2025', status: 'scheduled', views: 0 },
  { id: 'a7', title: 'Ký ức Thành cổ qua những lá thư của liệt sĩ Nguyễn Văn Thành', category: 'Câu chuyện', author: 'Trần Thu Hà', updated: '17/09/2025', status: 'draft', views: 0 },
]

export type LogEntry = {
  id: string
  at: string
  user: string
  action: 'Tạo mới' | 'Cập nhật' | 'Phê duyệt' | 'Trả sửa' | 'Ẩn' | 'Khôi phục' | 'Đăng nhập' | 'Nhập Excel' | 'Xuất dữ liệu' | 'Khóa tài khoản'
  target: string
  module: string
  detail: string
  ip: string
}

export const LOGS: LogEntry[] = [
  { id: 'l1', at: '17/09/2025 10:42', user: 'Phạm Quang Huy', action: 'Phê duyệt', target: 'Liệt sĩ Nguyễn Văn Quý', module: 'Liệt sĩ', detail: 'Công khai hồ sơ, phiên bản 4', ip: '113.190.24.18' },
  { id: 'l2', at: '17/09/2025 10:31', user: 'Trần Thu Hà', action: 'Cập nhật', target: 'Bài viết: Số hoá sơ đồ phần mộ…', module: 'Bài viết', detail: 'Hẹn giờ xuất bản 20/09/2025 07:00', ip: '113.190.24.31' },
  { id: 'l3', at: '17/09/2025 09:58', user: 'Lê Văn Bình', action: 'Nhập Excel', target: 'lietsi_vanha_dot2.xlsx', module: 'Nhập dữ liệu', detail: '42 dòng hợp lệ, 3 dòng lỗi bỏ qua', ip: '14.232.88.7' },
  { id: 'l4', at: '17/09/2025 09:20', user: 'Phạm Quang Huy', action: 'Trả sửa', target: 'Liệt sĩ Đào Văn Cừ', module: 'Liệt sĩ', detail: 'Thiếu giấy báo tử bản scan', ip: '113.190.24.18' },
  { id: 'l5', at: '17/09/2025 08:47', user: 'Nguyễn Minh Đức', action: 'Khóa tài khoản', target: 'Ngô Văn Tùng', module: 'Tài khoản', detail: 'Chuyển công tác', ip: '113.190.24.2' },
  { id: 'l6', at: '16/09/2025 16:20', user: 'Trần Thu Hà', action: 'Tạo mới', target: 'Album: Nghĩa trang Vân Hà 2025', module: 'Media', detail: '24 ảnh', ip: '113.190.24.31' },
  { id: 'l7', at: '16/09/2025 15:04', user: 'Đỗ Thị Mai', action: 'Ẩn', target: 'Liệt sĩ Ngô Văn S. (bản trùng)', module: 'Liệt sĩ', detail: 'Trùng với hồ sơ LS-0412', ip: '27.72.101.9' },
  { id: 'l8', at: '16/09/2025 14:12', user: 'Nguyễn Minh Đức', action: 'Xuất dữ liệu', target: 'Danh sách liệt sĩ toàn xã', module: 'Xuất dữ liệu', detail: 'Excel · 744 hồ sơ', ip: '113.190.24.2' },
  { id: 'l9', at: '16/09/2025 08:01', user: 'Hoàng Thị Yến', action: 'Đăng nhập', target: '—', module: 'Hệ thống', detail: 'Chrome · Android', ip: '42.118.5.66' },
  { id: 'l10', at: '15/09/2025 17:33', user: 'Lê Văn Bình', action: 'Khôi phục', target: 'Liệt sĩ Lê Văn Tiến', module: 'Liệt sĩ', detail: 'Khôi phục từ thùng ẩn', ip: '14.232.88.7' },
]

export const AREAS = ['Toàn xã', 'Xã Thụy Lâm cũ', 'Xã Vân Hà cũ', 'Xã Liên Hà cũ', 'Xã Xuân Nộn cũ']

/** Mã hồ sơ hiển thị nội bộ. */
export const soldierCode = (id: string) => `LS-${id.replace(/\D/g, '').padStart(4, '0')}`
