import express from 'express'
import http from "http"
import net from 'node:net'

let server: http.Server
let port: number = 3180
let staticServerUrl: string = ''

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

async function startStaticServer(sourcePath: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const app = express()
    app.use('/static', express.static(sourcePath))
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

export async function restartStaticServer(sourcePath: string) {
  if (server) {
    server.close(async () => {
      staticServerUrl = await startStaticServer(sourcePath)
    })
  } else {
    staticServerUrl = await startStaticServer(sourcePath)
  }
  console.log(staticServerUrl)
}