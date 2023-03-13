import * as fs from 'fs/promises'

export type AcceptOptions = {
}

export type Conf = {
  id: string,
  token: string,
  timeout: number,
  enginePath: string,
  acceptOptions: AcceptOptions
}

export async function read_conf() {
  return fs.readFile('./conf.json', 'utf8').then(_ => JSON.parse(_) as Conf)
}
