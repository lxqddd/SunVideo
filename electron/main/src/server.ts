import type http from 'node:http'
import net from 'node:net'
import path from 'node:path'
import { ipcMain } from 'electron'
import express from 'express'

let server: http.Server
let port: number = 3180
let staticServerUrl: string = ''
let currentStaticPath: string = ''

function checkPortInUse() {
  return new Promise((resolve, reject) => {
    const server = net.createServer().listen(port)
    server.once('error', (err) => {
      console.log(err)
      resolve(true)
    })
    server.once('listening', () => {
      server.close()
      resolve(false)
    })
  })
}

async function startStaticServer(): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const app = express()
    app.use('/static', express.static(currentStaticPath))
    while (await checkPortInUse()) {
      port += 1
    }
    server = app.listen(port, () => {
      resolve(`http://localhost:${port}/static/`)
      console.log(`the static source server is running on port ${port}`)
    })
    server.on('error', (error) => {
      console.log(error)
      reject(error)
    })
  })
}

async function restartStaticServer() {
  if (server) {
    server.close(async () => {
      staticServerUrl = await startStaticServer()
    })
  }
  else {
    staticServerUrl = await startStaticServer()
  }
  console.log(staticServerUrl)
}

export async function getVideoUrl() {
  ipcMain.handle('video:url', async (_e, dir: string, videoPath: string) => {
    console.log(dir, videoPath)
    if (dir !== currentStaticPath) {
      currentStaticPath = dir
      await restartStaticServer()
    }
    const basename = path.basename(videoPath)
    return `${staticServerUrl}${basename}`
  })
}
