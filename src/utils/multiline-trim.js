export default function trim(str: string): string {
  const match = /\n([ ]*)/.exec(str)
  const pad = match && match[1]
  str = str.trim()
  if (pad) {
    str = str.replace(new RegExp(`(\n)${pad}`, 'g'), '$1')
  }
  return str
}
