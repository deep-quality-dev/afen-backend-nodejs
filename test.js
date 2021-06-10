const express = require('express')
const {create} = require('ipfs-http-client')
const expFileUpload = require('express-fileupload')
const fs = require('fs')

const ipfs = create('http://localhost:5001')
const app = express()
app.use(expFileUpload())

app.post('/upload', (req, res) => {
    let fileObj = {}
    if (req.files.inputFile) {
        const file = req.files.inputFile
        const fileName = file.name
        const filePath = __dirname + '/files/' + fileName
        file.mv(filePath, async (err) => {
            if(err) {
                console.log('Error: failed to download file')
                return res.status(500).send(err)
            }

            const fileHash = await addFile(fileName, filePath)
            console.log('File Hash received __>', fileHash)
            fs.unlink(filePath, (err) => {
                if(err) {
                    console.log("Error: Unable to delete file.", err)
                }
            })
            fileObj = {
                file: file,
                name: fileName,
                path: filePath
            }
            res.send(fileObj)
        })
    } else {
        res.send('file upload false')
    }
})

const addFile = async (fileName, filePath) => {
    const file = fs.readFileSync(filePath)
    const filesAdded = await ipfs.add({
        path: fileName,
        content: file
    },
    {
        progress: (len) => console.log('Uploading file ... ' + len)
    })
    console.log(filesAdded)
    const fileHash = filesAdded.cid.toString
    return fileHash
}

app.listen(3000, () => {
    console.log('Server is listening on the port 3000')
})