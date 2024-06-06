export interface ISourceTree {
  name: string
  children: {
    name: string
    path: string
    type: string
    dir: string
  }[]
}