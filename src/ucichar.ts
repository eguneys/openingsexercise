type File = string
type Rank = string
type Pos = string
type Promotable = string
type OD = string


export type GMap<A extends string, B> = Record<A, B>
export const a_map = <A extends string, C>(fs: Array<A>, fn: (key: A) => C | undefined): GMap<A, C> => {
  let res: any = {}
  fs.forEach(key => {
    let _res = fn(key)
    if (_res) {
      res[key] = _res
    }
  })
  return res
}

export const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const
export const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'] as const
export const promotables = ['q', 'n', 'r', 'b'] as const

export const poss: Array<Pos> = files.flatMap((file: File) => ranks.map((rank: Rank) => `${file}${rank}` as Pos))


export const od_split = (od: OD): [Pos, Pos] => [od.slice(0, 2) as Pos, od.slice(2) as Pos]

export const uci_split = (uci: UCI): [OD, Promotable | undefined] => {
  return uci.split('=') as [OD, Promotable | undefined]
}


export type ODP = `${OD}=${Promotable}`
export type ODorP = OD | ODP
export type UCI = ODorP

export const isOd = (_: UCI): _ is OD => {
  return _.length === 4
}

export type UciChar = string

const charShift = 35
const voidChar = String.fromCharCode(33) // '!', skip 34 \"

const pos_hash = (pos: Pos) => poss.indexOf(pos) + 1
const pos2charMap = a_map(poss, pos => String.fromCharCode(pos_hash(pos) + charShift))

const pos_to2char = (pos: Pos) => pos2charMap[pos] || voidChar

const promotion2charMap = (() => {
  let res: any = {}

  promotables.map((role, i) => {
    files.map((file, i_file) => {
      let key = role + file
      let _res = String.fromCharCode(charShift + Object.keys(pos2charMap).length + i * 8 + i_file - 1)
      res[key] = _res
    })
  })
  return res
})()

const pos_to2char_p = (file: File, role: Promotable) => promotion2charMap[role+file] || voidChar

export const uci_char = (odp: UCI): UciChar => {
  let [od, p] = uci_split(odp)
  let [o, d]: [Pos, Pos] = od_split(od)
  if (p) {
    return pos_to2char(o) + pos_to2char_p(d[0] as File, p as Promotable)
  } else {
    return pos_to2char(o) + pos_to2char(d)
  }
}
