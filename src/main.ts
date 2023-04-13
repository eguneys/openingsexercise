import { read_conf } from './conf'
import { accept_challenges } from './bot'
import { Psu } from './psu'
import { IPlayer } from './play'

async function app() {

  let conf = await read_conf()

  let timeout = conf.timeout * 60 * 1000

  //timeout = 1000

  let psu: IPlayer = Psu.make(conf)

  try {
    await psu.init()
  } catch(e) {
    console.log(`Failed loading default engine ${e}`)
    process.exit(1)
  }

  async function step() {
    console.log(`Listening challenges...`)
    try {
      let dispose = await accept_challenges(conf, psu)
      setTimeout(() => {
        dispose()
        step()
      }, timeout)
    } catch (e) {
      console.error(`Fail accept challenges ${e}`)
      process.exit(1)
    }
  }

  await step()
}


app()
