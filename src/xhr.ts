import FormData from 'form-data'
import fetch from 'node-fetch'

export function xhr(endpoint: string, opts?: any) {
  let { headers, ...rest } = opts
  return fetch(endpoint, {
    headers: { ...headers },
    ...rest
  }).then(res => {
    return res.json()
  })
}

export function xhr_form(data: any): any {
  const form = new FormData()
  for (let key in data) {
    form.append(key, data[key])
  }
  return form
}
