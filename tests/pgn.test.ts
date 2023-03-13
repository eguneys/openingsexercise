import { it, expect } from 'vitest'

import { read_pgn, OPicker } from '../src/pgn'


const initial_fen = `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1`
const first_branch = `r2qkb1r/pp1npppp/2p2n2/8/2QP2b1/2N2N2/PP2PPPP/R1B1KB1R w KQkq - 3 7`
const e4 = `r2qkb1r/pp1npppp/2p2n2/8/2QPP1b1/2N2N2/PP3PPP/R1B1KB1R b KQkq - 0 7`
const bg5 = `r2qkb1r/pp1npppp/2p2n2/6B1/2QP2b1/2N2N2/PP2PPPP/R3KB1R b KQkq - 4 7`

const pgn = `
[Event "Classical Slav: 4th Move Alternatives 5.Qxc4 - Main Line"]
[Site "https://lichess.org/study/TCnt4Tx7/RIQSuuxt"]
  [Result "*"]
[UTCDate "2023.03.13"]
[UTCTime "10:48:33"]
[Variant "Standard"]
[ECO "D11"]
[Opening "Slav Defense: Modern Line"]
[Annotator "https://lichess.org/@/heroku"]

1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. Qc2 dxc4 5. Qxc4 Bg4 6. Nc3 Nbd7 7. e4 (7. Bg5 Qa5 8. Bd2 e6 9. e3 Be7 10. Be2 Qb6 11. Qb3 Qxb3 12. axb3 O-O)  (7. Bf4 Nb6 8. Qd3 Bxf3 9. gxf3 Nfd5 10. Nxd5 Nxd5 11. Bd2 e6 12. e4 Nb6 13. O-O-O Qc7) 7... e5 8. dxe5 (8. Nxe5 Nxe5 9. dxe5 Be6 10. Qd3 Ng4 11. Qxd8+ Rxd8 { [%cal Gc1f4,Gf8c5,Gf4g3,Gc5d4,Ga1d1,Gd4e5] } 12. f4 Bc5 13. Be2 Ne3 14. Bxe3 Bxe3 15. g3 Ke7 16. Rd1 Rxd1+ 17. Nxd1 Bd4 18. b3 Rd8)  (8. Be3 Qa5 9. O-O-O exd4 10. Bxd4 Be6 11. Qe2 Bc5 $15) 8... Bxf3 9. gxf3 (9. exf6 Qxf6 10. gxf3 Ne5 11. Qa4 Nxf3+ { [%cal Ge1e2,Gf3d4,Ge2e1,Gb7b5] } 12. Kd1 Rd8+ 13. Kc2 Nd4+ 14. Kb1 Qf3 15. Rg1 Qxf2 16. Rh1 Qf3 17. Rg1 Qf2)  (9. e6 Ne5 10. exf7+ Ke7 11. Qc5+ Ke6 12. Bc4+ Nd5 13. exd5+ cxd5 14. Qe3 Bxg2 15. Rg1 Bc5 16. Qe2 Bf3 17. Bxd5+ Qxd5 18. Nxd5 Bxe2 19. Nc7+ Kxf7 20. Kxe2 Rac8 $15) 9... Nxe5 10. Qe2 Bc5 11. Bd2 (11. Be3 Bxe3 12. fxe3 g5 13. f4 gxf4 14. exf4 Ng6 15. Qf3 h5 16. e5 Ng4 17. Rd1 Qb6)  (11. Rg1 Qb6 12. Rg5 Ng6 13. Bd2 Rd8 14. e5 Nd5 15. Na4 Qb4 16. Nxc5 Qxc5 17. Qc4 Qe7 18. O-O-O O-O) 11... Nh5 { [%cal Ge1c1,Gd8h4,Gd2e3,Gc5e7,Ge2c2] } 12. f4 Qxd2+ 13. Kxd2 Nxf4 14. Qd1 O-O-O+ 15. Nd5 cxd5 16. Kc2 (16. Qc1 dxe4+ 17. Kc2 Ned3 18. Bxd3 Nxd3 19. Qg5 Rd5 20. Qxg7 Bd4 21. Qxf7 Rc5+ 22. Kd2 Rd8 23. Rhg1 Bxb2 24. Ke3 Rc3 25. Qf5+ Kb8 $10) 16... Kb8 17. Qd2 Rc8 18. Kb3 g5 19. Qc3 Bd6 20. Qe3 dxe4 21. Rd1 Ned3 22. Bxd3 Nxd3 23. Rxd3 exd3 24. Qxd3 Be5 $10 *



`


it('should read pgn', async () => {
  let res = read_pgn(pgn)

  let p = new OPicker(res)

  function picks(fen: string) {
    return [...Array(10).keys()].map(_ => p.pick_move(fen))
  }


  console.log(picks(initial_fen))
  console.log(picks(first_branch))
  console.log('bg5', picks(bg5))
  console.log('e4', picks(e4))

  console.log(p.score(first_branch))
  console.log(p.score(e4))
  console.log(p.score(bg5))


  await (new Promise(resolve => setTimeout(resolve, 100)))
})
