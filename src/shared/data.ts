/**
 * Dữ liệu mẫu phục vụ thiết kế.
 *
 * CÓ THẬT (theo Wikipedia "Thư Lâm" và Trang TTĐT xã thulam.hanoi.gov.vn):
 *  - Xã Thư Lâm thành lập 16/6/2025 từ toàn bộ xã Thụy Lâm, Vân Hà, Xuân Nộn và một phần
 *    Liên Hà, Dục Tú, Nguyên Khê, Uy Nỗ, Việt Hùng, thị trấn Đông Anh (huyện Đông Anh cũ).
 *  - Tên các thôn của xã Thụy Lâm cũ: Biểu Khê, Cổ Miếu, Đào Thục, Hà Lâm 1–3, Hương Trầm,
 *    Mạnh Tân, khu 5–7 (nay là thôn Thụy Lôi 1–3).
 *  - Di tích quốc gia: cụm đền Sái – đền Thượng – chùa Sái (1986), đình Thụy Lôi (1986),
 *    đình Hà Lỗ (1989), đình Đào Thục (1995), đình Kim Tiên (1998), đình Vân Điềm (2006).
 *
 * MINH HOẠ (chưa xác minh, cần thay bằng hồ sơ của Ban CHQS / Phòng Văn hoá – Xã hội xã):
 *  - Họ tên, năm sinh, đơn vị, nơi hy sinh của liệt sĩ; số mộ, sơ đồ khu – hàng của nghĩa trang.
 */

export const IMG = {
  hero: 'https://cdn.magicpatterns.com/patterns/generated-images/8b50aba2-15c1-4468-88b7-4091379e7b41.jpg',
  cemetery: 'https://cdn.magicpatterns.com/patterns/generated-images/c1e30242-f0a8-4d72-aad3-e8166a76fec7.jpg',
  dinh: 'https://cdn.magicpatterns.com/patterns/generated-images/426793a5-b6a0-4e5f-97c1-5708900a33f7.jpg',
  incense: 'https://cdn.magicpatterns.com/patterns/generated-images/95e51b81-d5f7-46ed-a90b-baed994a0427.jpg',
  panorama: 'https://cdn.magicpatterns.com/patterns/generated-images/c4a2e478-a0a8-4e75-b5dc-7af533cd7d5d.jpg',
  artifacts: 'https://cdn.magicpatterns.com/patterns/generated-images/9a46bc78-b05b-4c14-8e8d-41b7531da696.jpg',
  letters: 'https://cdn.magicpatterns.com/patterns/generated-images/0e687f06-0c8c-4e9c-8aa3-01e804f9b90b.jpg',
  lotus: 'https://cdn.magicpatterns.com/patterns/generated-images/8c8cebec-498b-4ff8-be23-fef1859ee2ac.jpg',
  home: 'https://cdn.magicpatterns.com/patterns/generated-images/a20dbd75-2d3c-4994-89ca-dcd206486f43.jpg',
  heroSunrise: 'https://cdn.magicpatterns.com/patterns/generated-images/5e352550-778f-4145-bf9f-89a70337fd64.jpg',
  /** Ảnh minh hoạ, chưa phải ảnh thật của liệt sĩ. */
  portraitS1: 'https://cdn.magicpatterns.com/patterns/generated-images/082c7e4c-10d4-4bcb-8dab-77e543a4db12.jpg',
}

/**
 * Line art nét mảnh trên nền trắng (dùng với mix-blend-multiply trên nền giấy),
 * và một bản nét sáng trên nền đen (dùng với mix-blend-screen trên nền đỏ).
 */
export const LINE_ART = {
  gate: 'https://cdn.magicpatterns.com/patterns/generated-images/c77b5654-bb5f-4471-a6ac-22d9fefe167a.jpg',
  gateLight: 'https://cdn.magicpatterns.com/patterns/generated-images/b2a5a4d6-79ab-4dd8-9950-8e27f5128cce.jpg',
  lotusClouds: 'https://cdn.magicpatterns.com/patterns/generated-images/c93940a9-50d5-4946-a217-c0f4cda6a29d.jpg',
  countryside: 'https://cdn.magicpatterns.com/patterns/generated-images/1e5053b1-fd8a-41a1-8ff1-63ed0bc8ab70.jpg',
}

export type Soldier = {
  id: string
  name: string
  born: string
  died: string
  hometown: string
  rank: string
  unit: string
  diedAt: string
  cemetery: string
  plot: string
  photo: boolean
}

const NT_THUY_LAM = 'Nghĩa trang Liệt sĩ Thụy Lâm'
const NT_VAN_HA = 'Nghĩa trang Liệt sĩ Vân Hà'
const NT_LIEN_HA = 'Nghĩa trang Liệt sĩ Liên Hà'
const NT_XUAN_NON = 'Nghĩa trang Liệt sĩ Xuân Nộn'

export const SOLDIERS: Soldier[] = [
  { id: 's1', name: 'Nguyễn Văn Thành', born: '1949', died: '1972', hometown: 'Thôn Thụy Lôi, Thư Lâm', rank: 'Hạ sĩ', unit: 'Trung đoàn 48, Sư đoàn 320', diedAt: 'Thành cổ Quảng Trị', cemetery: NT_THUY_LAM, plot: 'Khu A · Hàng 2 · Mộ 07', photo: true },
  { id: 's2', name: 'Trần Đức Hiển', born: '1951', died: '1971', hometown: 'Thôn Hà Lâm, Thư Lâm', rank: 'Binh nhất', unit: 'Trung đoàn 102, Sư đoàn 308', diedAt: 'Đường 9 – Nam Lào', cemetery: NT_THUY_LAM, plot: 'Khu A · Hàng 3 · Mộ 10', photo: false },
  { id: 's3', name: 'Lê Quang Vinh', born: '1946', died: '1968', hometown: 'Thôn Đào Thục, Thư Lâm', rank: 'Trung sĩ', unit: 'Tiểu đoàn 4, Trung đoàn 9', diedAt: 'Khe Sanh, Quảng Trị', cemetery: NT_THUY_LAM, plot: 'Khu B · Hàng 1 · Mộ 04', photo: true },
  { id: 's4', name: 'Phạm Văn Lộc', born: '1953', died: '1974', hometown: 'Thôn Biểu Khê, Thư Lâm', rank: 'Binh nhì', unit: 'Sư đoàn 312', diedAt: 'Thượng Đức, Quảng Nam', cemetery: NT_THUY_LAM, plot: 'Khu B · Hàng 4 · Mộ 09', photo: false },
  { id: 's5', name: 'Đỗ Minh Tuấn', born: '1950', died: '1972', hometown: 'Thôn Cổ Miếu, Thư Lâm', rank: 'Hạ sĩ', unit: 'Trung đoàn Phòng không 257', diedAt: 'Bảo vệ cầu Đuống, Hà Nội', cemetery: NT_THUY_LAM, plot: 'Khu C · Hàng 2 · Mộ 05', photo: true },
  { id: 's6', name: 'Hoàng Văn Khải', born: '1944', died: '1967', hometown: 'Thôn Mạnh Tân, Thư Lâm', rank: 'Thượng sĩ', unit: 'Sư đoàn 325', diedAt: 'Cồn Tiên – Dốc Miếu', cemetery: NT_THUY_LAM, plot: 'Khu A · Hàng 1 · Mộ 02', photo: false },
  { id: 's7', name: 'Ngô Đình Phúc', born: '1952', died: '1975', hometown: 'Thôn Hương Trầm, Thư Lâm', rank: 'Binh nhất', unit: 'Quân đoàn 1', diedAt: 'Chiến dịch Hồ Chí Minh', cemetery: NT_THUY_LAM, plot: 'Khu D · Hàng 5 · Mộ 08', photo: false },
  { id: 's8', name: 'Vũ Xuân Hòa', born: '1948', died: '1970', hometown: 'Thôn Thụy Lôi, Thư Lâm', rank: 'Trung sĩ', unit: 'Đoàn 559', diedAt: 'Trường Sơn', cemetery: NT_THUY_LAM, plot: 'Khu D · Hàng 3 · Mộ 03', photo: true },
  { id: 's9', name: 'Nguyễn Hữu Nghĩa', born: '1930', died: '1953', hometown: 'Thôn Đào Thục, Thư Lâm', rank: 'Tiểu đội trưởng', unit: 'Đại đoàn 308', diedAt: 'Chiến dịch Thượng Lào', cemetery: NT_THUY_LAM, plot: 'Khu A · Hàng 1 · Mộ 05', photo: false },
  { id: 's10', name: 'Đào Văn Cừ', born: '1932', died: '1954', hometown: 'Thôn Hà Lâm, Thư Lâm', rank: 'Chiến sĩ', unit: 'Đại đoàn 312', diedAt: 'Điện Biên Phủ', cemetery: NT_THUY_LAM, plot: 'Khu B · Hàng 2 · Mộ 06', photo: false },
  { id: 's11', name: 'Lê Văn Tiến', born: '1958', died: '1979', hometown: 'Thôn Biểu Khê, Thư Lâm', rank: 'Hạ sĩ', unit: 'Sư đoàn 346', diedAt: 'Biên giới Cao Bằng', cemetery: NT_THUY_LAM, plot: 'Khu C · Hàng 4 · Mộ 11', photo: false },
  { id: 's12', name: 'Nguyễn Văn Quý', born: '1947', died: '1969', hometown: 'Thôn Vân Điềm, Thư Lâm', rank: 'Trung sĩ', unit: 'Sư đoàn 304', diedAt: 'Đường 9 – Khe Sanh', cemetery: NT_VAN_HA, plot: 'Khu A · Hàng 2 · Mộ 03', photo: false },
  { id: 's13', name: 'Chu Văn Đạt', born: '1950', died: '1972', hometown: 'Thôn Thiết Úng, Thư Lâm', rank: 'Binh nhất', unit: 'Sư đoàn 308', diedAt: 'Quảng Trị', cemetery: NT_VAN_HA, plot: 'Khu C · Hàng 1 · Mộ 06', photo: true },
  { id: 's14', name: 'Ngô Văn Sinh', born: '1949', died: '1971', hometown: 'Thôn Châu Phong, Thư Lâm', rank: 'Hạ sĩ', unit: 'Sư đoàn 320', diedAt: 'Tây Nguyên', cemetery: NT_LIEN_HA, plot: 'Khu B · Hàng 3 · Mộ 05', photo: false },
  { id: 's15', name: 'Đỗ Văn Lâm', born: '1953', died: '1975', hometown: 'Thôn Lỗ Khê, Thư Lâm', rank: 'Binh nhì', unit: 'Sư đoàn 10', diedAt: 'Buôn Ma Thuột', cemetery: NT_LIEN_HA, plot: 'Khu D · Hàng 2 · Mộ 07', photo: false },
  { id: 's16', name: 'Trần Văn Kiên', born: '1945', died: '1968', hometown: 'Thôn Xuân Nộn, Thư Lâm', rank: 'Trung sĩ', unit: 'Trung đoàn 52', diedAt: 'Huế', cemetery: NT_XUAN_NON, plot: 'Khu A · Hàng 3 · Mộ 04', photo: false },
]

export type Cemetery = {
  id: string
  name: string
  address: string
  graves: number
  identified: number
  area: string
  image: string
  has360: boolean
  /** Each of the four zones (A, B back · C, D front) holds rows × perRow graves. */
  layout: { rows: number; perRow: number }
  built: string
}

export const CEMETERIES: Cemetery[] = [
  { id: 'c1', name: NT_THUY_LAM, address: 'Thôn Thụy Lôi, xã Thư Lâm (xã Thụy Lâm cũ), Hà Nội', graves: 264, identified: 241, area: 'Xã Thụy Lâm cũ', image: IMG.cemetery, has360: true, layout: { rows: 6, perRow: 11 }, built: '1976, tôn tạo 2015' },
  { id: 'c2', name: NT_VAN_HA, address: 'Thôn Vân Điềm, xã Thư Lâm (xã Vân Hà cũ), Hà Nội', graves: 168, identified: 157, area: 'Xã Vân Hà cũ', image: IMG.panorama, has360: true, layout: { rows: 6, perRow: 7 }, built: '1978, tôn tạo 2018' },
  { id: 'c3', name: NT_LIEN_HA, address: 'Thôn Châu Phong, xã Thư Lâm (xã Liên Hà cũ), Hà Nội', graves: 192, identified: 176, area: 'Xã Liên Hà cũ', image: IMG.hero, has360: false, layout: { rows: 6, perRow: 8 }, built: '1977, tôn tạo 2016' },
  { id: 'c4', name: NT_XUAN_NON, address: 'Thôn Xuân Nộn, xã Thư Lâm (xã Xuân Nộn cũ), Hà Nội', graves: 120, identified: 109, area: 'Xã Xuân Nộn cũ', image: IMG.lotus, has360: false, layout: { rows: 5, perRow: 6 }, built: '1980, tôn tạo 2019' },
]

export type MeritPerson = {
  id: string
  name: string
  title: string
  years: string
  hometown: string
  category: string
}

export const MERIT: MeritPerson[] = [
  { id: 'm1', name: 'Nguyễn Thị Lan', title: 'Bà mẹ Việt Nam Anh hùng', years: '1920 – 2009', hometown: 'Thôn Thụy Lôi, Thư Lâm', category: 'Bà mẹ Việt Nam Anh hùng' },
  { id: 'm2', name: 'Trần Văn Bảo', title: 'Thương binh hạng 2/4', years: '1947 – 2018', hometown: 'Thôn Hà Lâm, Thư Lâm', category: 'Thương binh' },
  { id: 'm3', name: 'Lê Thị Hạnh', title: 'Người hoạt động kháng chiến', years: '1938 – 2016', hometown: 'Thôn Đào Thục, Thư Lâm', category: 'Người hoạt động kháng chiến' },
  { id: 'm4', name: 'Phạm Thị Nga', title: 'Bà mẹ Việt Nam Anh hùng', years: '1915 – 2002', hometown: 'Thôn Biểu Khê, Thư Lâm', category: 'Bà mẹ Việt Nam Anh hùng' },
  { id: 'm5', name: 'Đặng Văn Sơn', title: 'Bệnh binh', years: '1950 – 2021', hometown: 'Thôn Cổ Miếu, Thư Lâm', category: 'Bệnh binh' },
  { id: 'm6', name: 'Bùi Văn Tâm', title: 'Người có công giúp đỡ cách mạng', years: '1925 – 2011', hometown: 'Thôn Mạnh Tân, Thư Lâm', category: 'Người có công giúp đỡ cách mạng' },
]

export type Family = {
  id: string
  head: string
  kind: string
  address: string
  members: number
  honoured: string
}

export const FAMILIES: Family[] = [
  { id: 'f1', head: 'Gia đình ông Nguyễn Văn Hùng', kind: 'Gia đình liệt sĩ', address: 'Thôn Thụy Lôi 1, xã Thư Lâm, TP. Hà Nội', members: 2, honoured: 'Liệt sĩ Nguyễn Văn Thành' },
  { id: 'f2', head: 'Gia đình bà Trần Thị Mai', kind: 'Gia đình liệt sĩ', address: 'Thôn Hà Lâm, xã Thư Lâm, TP. Hà Nội', members: 1, honoured: 'Liệt sĩ Trần Đức Hiển' },
  { id: 'f3', head: 'Gia đình ông Lê Văn Dũng', kind: 'Gia đình có công với cách mạng', address: 'Thôn Đào Thục, xã Thư Lâm, TP. Hà Nội', members: 3, honoured: 'Bà Lê Thị Hạnh' },
  { id: 'f4', head: 'Gia đình bà Phạm Thị Hoa', kind: 'Gia đình Bà mẹ Việt Nam Anh hùng', address: 'Thôn Biểu Khê, xã Thư Lâm, TP. Hà Nội', members: 2, honoured: 'Mẹ Phạm Thị Nga' },
  { id: 'f5', head: 'Gia đình ông Đỗ Văn Nam', kind: 'Gia đình liệt sĩ', address: 'Thôn Cổ Miếu, xã Thư Lâm, TP. Hà Nội', members: 1, honoured: 'Liệt sĩ Đỗ Minh Tuấn' },
  { id: 'f6', head: 'Gia đình ông Đặng Văn Long', kind: 'Gia đình thương binh, bệnh binh', address: 'Thôn Cổ Miếu, xã Thư Lâm, TP. Hà Nội', members: 1, honoured: 'Ông Đặng Văn Sơn' },
]

export type RedAddress = {
  id: string
  name: string
  kind: string
  address: string
  rank: string
  image: string
}

export const RED_ADDRESSES: RedAddress[] = [
  { id: 'r1', name: 'Đài Tổ quốc ghi công – NTLS Thụy Lâm', kind: 'Đài tưởng niệm', address: 'Thôn Thụy Lôi, xã Thư Lâm', rank: 'Công trình tưởng niệm', image: IMG.hero },
  { id: 'r2', name: 'Cụm di tích đền Sái – đền Thượng – chùa Sái', kind: 'Đình, đền', address: 'Thôn Thụy Lôi, xã Thư Lâm', rank: 'Di tích quốc gia (1986)', image: IMG.dinh },
  { id: 'r3', name: 'Đình Thụy Lôi', kind: 'Đình, đền', address: 'Thôn Thụy Lôi, xã Thư Lâm', rank: 'Di tích quốc gia (1986)', image: IMG.dinh },
  { id: 'r4', name: 'Đình Đào Thục – quê hương múa rối nước', kind: 'Đình, đền', address: 'Thôn Đào Thục, xã Thư Lâm', rank: 'Di tích quốc gia (1995)', image: IMG.lotus },
  { id: 'r5', name: 'Nhà truyền thống xã Thụy Lâm', kind: 'Nhà truyền thống', address: 'Thôn Hà Lâm, xã Thư Lâm', rank: 'Không gian trưng bày (minh hoạ)', image: IMG.artifacts },
  { id: 'r6', name: 'Bia ghi danh liệt sĩ xã Vân Hà', kind: 'Bia tưởng niệm', address: 'Thôn Vân Điềm, xã Thư Lâm', rank: 'Công trình tưởng niệm', image: IMG.cemetery },
]

export type NewsItem = {
  id: string
  title: string
  excerpt: string
  date: string
  category: string
  image: string
}

export const NEWS: NewsItem[] = [
  { id: 'n1', title: 'Ra mắt Cổng thông tin Tri ân Thư Lâm', excerpt: 'Nền tảng số giúp người dân và thân nhân tra cứu thông tin liệt sĩ, phần mộ, người có công và các địa chỉ đỏ của địa phương.', date: '15/07/2025', category: 'Hoạt động', image: IMG.hero },
  { id: 'n2', title: 'Lễ dâng hương tri ân nhân Ngày Thương binh – Liệt sĩ 27/7', excerpt: 'Chính quyền và nhân dân xã Thư Lâm dâng hương, thắp nến tri ân tại Nghĩa trang Liệt sĩ Thụy Lâm và các nghĩa trang trên địa bàn.', date: '27/07/2025', category: 'Sự kiện', image: IMG.incense },
  { id: 'n3', title: 'Kêu gọi thân nhân bổ sung hình ảnh, kỷ vật liệt sĩ', excerpt: 'Ban quản lý mong nhận được ảnh chân dung, thư từ và kỷ vật để hoàn thiện hồ sơ tưởng niệm trực tuyến.', date: '02/08/2025', category: 'Thông báo', image: IMG.letters },
  { id: 'n4', title: 'Hướng dẫn tra cứu thông tin liệt sĩ trên cổng thông tin', excerpt: 'Các bước tìm kiếm theo họ tên, năm sinh, quê quán và cách xem vị trí phần mộ trên sơ đồ nghĩa trang.', date: '10/08/2025', category: 'Hướng dẫn', image: IMG.cemetery },
  { id: 'n5', title: 'Đoàn viên thanh niên chăm sóc phần mộ liệt sĩ', excerpt: 'Hoạt động dọn dẹp, trồng hoa và thắp hương được duy trì định kỳ tại các nghĩa trang trên địa bàn.', date: '24/08/2025', category: 'Hoạt động', image: IMG.panorama },
  { id: 'n6', title: 'Số hoá sơ đồ phần mộ các nghĩa trang liệt sĩ', excerpt: 'Sơ đồ khu, hàng, mộ được số hoá để thân nhân dễ dàng xác định vị trí trước khi đến viếng.', date: '05/09/2025', category: 'Thông báo', image: IMG.dinh },
]

export type MediaItem = {
  id: string
  title: string
  kind: 'Ảnh' | 'Video' | 'Tài liệu' | 'Ghi âm'
  year: string
  source: string
  image: string
}

export const MEDIA: MediaItem[] = [
  { id: 'd1', title: 'Kỷ vật được gia đình gửi tặng nhà truyền thống', kind: 'Ảnh', year: '2025', source: 'Nhà truyền thống xã', image: IMG.artifacts },
  { id: 'd2', title: 'Thư từ gia đình lưu giữ', kind: 'Tài liệu', year: 'Chưa xác định', source: 'Gia đình hiến tặng', image: IMG.letters },
  { id: 'd3', title: 'Toàn cảnh Nghĩa trang Liệt sĩ Thụy Lâm', kind: 'Ảnh', year: '2025', source: 'Ban quản lý nghĩa trang', image: IMG.panorama },
  { id: 'd4', title: 'Lễ dâng hương tri ân 27/7', kind: 'Video', year: '2025', source: 'Đài truyền thanh xã', image: IMG.incense },
  { id: 'd5', title: 'Kiến trúc đình Thụy Lôi', kind: 'Ảnh', year: '2024', source: 'Tư liệu địa phương', image: IMG.dinh },
  { id: 'd6', title: 'Lời kể của thân nhân liệt sĩ', kind: 'Ghi âm', year: '2025', source: 'Dự án lịch sử truyền miệng', image: IMG.home },
  { id: 'd7', title: 'Cảnh quan làng quê bên đầm sen', kind: 'Ảnh', year: '2024', source: 'Tư liệu địa phương', image: IMG.lotus },
  { id: 'd8', title: 'Hàng bia mộ liệt sĩ lúc chiều muộn', kind: 'Ảnh', year: '2025', source: 'Ban quản lý nghĩa trang', image: IMG.cemetery },
]

export type MapPoint = {
  id: string
  kind: 'cemetery' | 'red' | 'family'
  name: string
  note: string
  x: number
  y: number
}

export const MAP_POINTS: MapPoint[] = [
  { id: 'c1', kind: 'cemetery', name: NT_THUY_LAM, note: '264 phần mộ', x: 46, y: 22 },
  { id: 'c2', kind: 'cemetery', name: NT_VAN_HA, note: '168 phần mộ', x: 76, y: 46 },
  { id: 'c3', kind: 'cemetery', name: NT_LIEN_HA, note: '192 phần mộ', x: 66, y: 76 },
  { id: 'c4', kind: 'cemetery', name: NT_XUAN_NON, note: '120 phần mộ', x: 24, y: 58 },
  { id: 'r1', kind: 'red', name: 'Đài Tổ quốc ghi công – NTLS Thụy Lâm', note: 'Đài tưởng niệm', x: 49, y: 18 },
  { id: 'r2', kind: 'red', name: 'Cụm di tích đền Sái – đền Thượng – chùa Sái', note: 'Di tích quốc gia', x: 40, y: 12 },
  { id: 'r3', kind: 'red', name: 'Đình Thụy Lôi', note: 'Di tích quốc gia', x: 54, y: 28 },
  { id: 'r4', kind: 'red', name: 'Đình Đào Thục – quê hương múa rối nước', note: 'Di tích quốc gia', x: 32, y: 34 },
  { id: 'f1', kind: 'family', name: 'Gia đình ông Nguyễn Văn Hùng', note: 'Gia đình liệt sĩ', x: 58, y: 16 },
  { id: 'f3', kind: 'family', name: 'Gia đình ông Lê Văn Dũng', note: 'Gia đình có công', x: 28, y: 40 },
  { id: 'f4', kind: 'family', name: 'Gia đình bà Phạm Thị Hoa', note: 'Gia đình Mẹ VNAH', x: 62, y: 38 },
]
