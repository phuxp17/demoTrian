/** Lowercase and strip Vietnamese tone marks, so "nguyen van thanh" finds "Nguyễn Văn Thành". */
export function fold(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
}

/** True when every word of the query appears in the text, ignoring tone marks and case. */
export function matches(text: string, query: string): boolean {
  const words = fold(query).split(/\s+/).filter(Boolean)
  if (words.length === 0) return true
  const hay = fold(text)
  return words.every((w) => hay.includes(w))
}

/** Is a year string inside a range label like "1950 – 1954", "Trước 1945", "Sau 1954", "Không rõ"? */
export function inYearRange(year: string, range: string): boolean {
  if (range === 'Tất cả') return true
  const y = Number.parseInt(year, 10)
  if (range === 'Không rõ') return Number.isNaN(y)
  if (Number.isNaN(y)) return false
  const nums = range.match(/\d{4}/g)?.map(Number) ?? []
  if (range.startsWith('Trước')) return y < nums[0]
  if (range.startsWith('Sau')) return y > nums[0]
  return nums.length === 2 ? y >= nums[0] && y <= nums[1] : true
}
