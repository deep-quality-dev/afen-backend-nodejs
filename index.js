const express = require('express')
const { path } = require('express/lib/application')
const {create} = require('ipfs-http-client')

const ipfs = create("http://localhost:5001")
const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    return res.send('Welcome to my IPFS app')
})

app.post('/upload', async (req, res) => {
    const data = req.body
    
    const fileHash = await addFile(data)
    return res.send(`https://gateway.ipfs.io/ipfs/${fileHash}`)
})

const addFile = async ({path, content}) => {
    console.log(path, content)
    const file = {path: path, content: Buffer.from(content)}
    const filesAdded = await ipfs.add(file)
    console.log(filesAdded)
    // QmYarjYDXfwcCBFmrk9RKAEfZ9NGYHokrtXRJkw1bkbsJv
    return filesAdded.cid
}

app.listen(3000, () => {
    console.log('Server is listening on port 3000')
})
