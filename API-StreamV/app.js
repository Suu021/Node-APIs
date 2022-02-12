const express = require("express")
const app = express()
const fs = require("fs")
const { resolve } = require("path")


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/html/index.html")
})

app.get("/stream", (req, res) => {
    //const { videoName } = req.params
    var range = req.headers.range
    if (!range)
        range = 'bytes=0-'
    const videoPath = resolve(__dirname, "videos", "Kimetsu no Yaiba - Opening 3.mp4")
    const videoSize = fs.statSync(videoPath).size
    const ChunkSize = 9999
    const start = Number(range.replace(/\D/g, "").split('-')[0])
    const end = Math.min(start + ChunkSize, videoSize - 1)

    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": ChunkSize,
        "Content-Type": "video/mp4"
    }

    res.writeHead(206, headers)
    const videoStream = fs.createReadStream(videoPath, { start: start, end: end })
    videoStream.on("open", () => videoStream.pipe(res))
    videoStream.on("error", (streamErr) => res.end(streamErr))

})

app.listen(8081, () => {
    console.log("Server is running in url http://localhost:8081")
})