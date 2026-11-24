export type Layout = { rows: number; perRow: number }
export type V = [number, number, number]
export type Zone = { id: string; x0: number; y0: number; left: boolean }
export type GraveCell = { plot: string; x: number; y: number; unknown: boolean }
export type Site = ReturnType<typeof buildSite>
export type Proj = ReturnType<typeof makeProj>

export const TW = 26 // bề ngang một ô đất trên màn hình
export const TH = 13
export const ZH = 15 // một đơn vị chiều cao
export const COL = 1.1 // khoảng cách mộ trong hàng
export const ROW = 2.1 // khoảng cách giữa các hàng
export const MARGIN = 1.6
export const AXIS = 2.6
export const PLAZA = 7.6
export const CROSS = 2.4
export const FRONT = 4.6
export const MEM_Y = 3.6
export const AISLE = 1.05
export const SLAB = 0.7
export const LIP = 0.14 // viền cỏ trên mép sa bàn
export const PW = 0.36 // nửa bề rộng nấm mộ
export const PL = 0.62 // nửa chiều dài nấm mộ
export const PH = 0.2
export const HH = 0.9 // chiều cao bia
export const CAP = 0.08 // mũ bia
export const HEDGE = 0.35

export const MIN_ZOOM = 1
export const MAX_ZOOM = 3
export const clampZoom = (z: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, +z.toFixed(2)))

/** Chiếu isometric một điểm đã nằm trong hệ toạ độ đã xoay. */
export function Q(x: number, y: number, z: number): [number, number] {
  return [((x - y) * TW) / 2, ((x + y) * TH) / 2 - z * ZH]
}

export function ptsQ(vs: V[]) {
  return vs.map(([x, y, z]) => Q(x, y, z).map((n) => n.toFixed(1)).join(',')).join(' ')
}

/** Xoay mặt bằng (W × D) quanh tâm theo bước 90°, rồi chiếu. */
export function makeProj(rot: number, W: number, D: number) {
  const R = (x: number, y: number): [number, number] => {
    switch (rot) {
      case 1: return [D - y, x]
      case 2: return [W - x, D - y]
      case 3: return [y, W - x]
      default: return [x, y]
    }
  }
  const P = (x: number, y: number, z: number) => {
    const [a, b] = R(x, y)
    return Q(a, b, z)
  }
  return {
    rot,
    R,
    P,
    pts: (vs: V[]) => vs.map(([x, y, z]) => P(x, y, z).map((n) => n.toFixed(1)).join(',')).join(' '),
    /** Thứ tự vẽ: xa trước, gần sau. */
    depth: (x: number, y: number) => R(x, y).reduce((a, b) => a + b, 0),
    size: (rot % 2 ? [D, W] : [W, D]) as [number, number],
  }
}

export function viewBox(proj: Proj, site: { W: number; D: number }) {
  const [w, d] = proj.size
  const left = Q(0, d, 0)[0]
  const right = Q(w, 0, 0)[0]
  const top = Math.min(Q(0, 0, 0)[1], proj.P(site.W / 2, MEM_Y, 6.6)[1] - 26, proj.P(site.W / 2, site.D - 1, 3.3)[1] - 30)
  const bottom = Q(w, d, -SLAB)[1] + 34
  const pad = 30
  return { x: left - pad, y: top - pad, w: right - left + pad * 2, h: bottom - top + pad }
}

export function buildSite({ rows, perRow }: Layout) {
  const zoneW = perRow * COL
  const zoneD = rows * ROW
  const W = MARGIN * 2 + zoneW * 2 + AXIS
  const yBack = PLAZA
  const yFront = PLAZA + zoneD + CROSS
  const D = yFront + zoneD + FRONT
  const right = MARGIN + zoneW + AXIS
  const zones: Zone[] = [
    { id: 'A', x0: MARGIN, y0: yBack, left: true },
    { id: 'B', x0: right, y0: yBack, left: false },
    { id: 'C', x0: MARGIN, y0: yFront, left: true },
    { id: 'D', x0: right, y0: yFront, left: false },
  ]
  const graves: GraveCell[] = zones.flatMap((z, zi) =>
    Array.from({ length: rows }, (_, r) =>
      Array.from({ length: perRow }, (_, g) => ({
        plot: `Khu ${z.id} · Hàng ${r + 1} · Mộ ${String(g + 1).padStart(2, '0')}`,
        x: z.x0 + (g + 0.5) * COL,
        y: z.y0 + (r + 0.5) * ROW,
        unknown: (g * 7 + r * 3 + zi * 5 + perRow) % 11 === 0,
      })),
    ).flat(),
  )
  const cx = W / 2
  const axis: [number, number] = [cx - AXIS / 2 + 0.25, cx + AXIS / 2 - 0.25]
  const paths: [number, number, number, number][] = [
    [MARGIN, 0.8, W - MARGIN, PLAZA - 0.6],
    [axis[0], PLAZA - 0.6, axis[1], D - 0.2],
    [MARGIN - 0.4, yBack + zoneD + 0.5, W - MARGIN + 0.4, yFront - 0.5],
    [cx - 4, D - FRONT + 1.2, cx + 4, D - 0.2],
  ]
  // Mạch lát ngang trên lối giữa
  const joints: [number, number, number, number][] = []
  for (let y = PLAZA + 0.4; y < D - FRONT + 1.2; y += 1.2) joints.push([axis[0], y, axis[1], y])

  // Hàng rào cây thấp hai bên sân Đài, chia thành đoạn ngắn để xếp lớp đúng
  const hedges: [number, number, number, number][] = []
  for (let y = 1.4; y < PLAZA - 1.4; y += 1.3) {
    hedges.push([cx - 4.4, y, cx - 3.9, y + 1.1], [cx + 3.9, y, cx + 4.4, y + 1.1])
  }

  const trees: [number, number][] = [
    [MARGIN + 0.6, 1.6], [MARGIN + 0.6, 5.6], [W - MARGIN - 0.6, 1.6], [W - MARGIN - 0.6, 5.6],
    [cx - 5.4, D - 2.4], [cx + 5.4, D - 2.4],
  ]
  for (let ty = yBack + 1; ty < D - FRONT; ty += 4.2) trees.push([0.7, ty], [W - 0.7, ty])

  return { W, D, zoneW, zoneD, zones, graves, paths, joints, hedges, trees }
}

/** Lời chỉ đường bằng chữ, đi từ cổng chính vào. */
export function wayfinding(plot: string, layout: Layout) {
  const m = plot.match(/Khu (\w) · Hàng (\d+) · Mộ (\d+)/)
  if (!m) return ''
  const [, zone, row, num] = m
  const left = zone === 'A' || zone === 'C'
  const back = zone === 'A' || zone === 'B'
  const k = left ? layout.perRow - Number(num) + 1 : Number(num)
  return `Vào cổng chính, đi thẳng theo lối giữa${back ? ', qua lối ngang' : ''}. Đến Hàng ${row}, rẽ ${left ? 'trái' : 'phải'} — phần mộ thứ ${k} tính từ lối giữa.`
}
