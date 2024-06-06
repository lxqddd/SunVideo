import { BrowserWindow, dialog, ipcMain } from "electron"
import path from 'node:path'
import mime from 'mime'

interface ISourceTree {
  name: string
  children: {
    name: string
    path: string
    type: string
    dir: string
  }[]
}

export function selectFile(win: BrowserWindow) {
  ipcMain.handle('select:video', async () => {
    const result = await dialog.showOpenDialog(win, {
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'videos', extensions: ['mp4', 'avi', 'mkv'] }],
    })
    const paths = result.filePaths
    if (result.canceled) {
      return []
    }
    else {
      const ret: ISourceTree[] = []
      paths.forEach(_path => {
        const { name, dir } = path.parse(_path)
        const dirName = path.basename(dir)
        const find = ret.find(item => item.name === dirName)
        if (find) {
          find.children.push({
            path: _path,
            type: mime.getType(_path),
            name,
            dir
          })
        } else {
          ret.push({
            name: dirName,
            children: [{
              path: _path,
              type: mime.getType(_path),
              name,
              dir
            }]
          })
        }
      })
      return ret
    }
  })
}

export function selectDir(win: BrowserWindow) {
  ipcMain.handle('select:dir', async () => {
    console.log('select dir')
  })
}