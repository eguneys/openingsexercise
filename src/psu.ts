import { Conf } from './conf'
import * as at from './apil'
import { PlayOnTurn, IPlayer } from './play'
import { EnginePlayer } from './engine'
import { Book } from './book'

export class Psu implements IPlayer {


  static make = (conf: Conf) => new Psu(conf)

  stockfish: IPlayer
  book: IPlayer

  constructor(conf: Conf) {
    this.stockfish = EnginePlayer.make(conf.enginePath)
    this.book = Book.make(conf)
  }


  async init() {
    await this.stockfish.init()
    await this.book.init()
  }


  async move(ctx: PlayOnTurn, position: string, moves: Array<string>) {

    let handled;
    
    try {
      handled = await this.book.move(ctx, position, moves)
    } catch (e) {
      ctx.chat(`I lost the book.`);
      ctx.offerDrawNextMove = true;
      console.warn(e);
      handled = false;
    }
    
    if (!handled) {
      return await this.stockfish.move(ctx, position, moves);
    }
    return handled;
  }
  
  async chat(ctx: PlayOnTurn, chat: at.ChatLine) {
    this.book.chat(ctx, chat);
  }
  
  async abort(ctx: PlayOnTurn, status: at.GameStatus) {
    this.book.abort(ctx, status);
    this.stockfish.abort(ctx, status);
  }  


}
