const path = require('path')
require('sanitize-filename')

function handleZipFileUpload ({ file }: Request, res: Response, next: NextFunction) {
  if (utils.endsWith(file?.originalname.toLowerCase(), '.zip')) {
    if (file?.buffer) {
      const buffer = file.buffer
      const filename = file.originalname.toLowerCase()
      const tempFile = path.join(os.tmpdir(), filename)
      fs.open(tempFile, 'w', function (err, fd) {
        if (err != null) { next(err) }
        fs.write(fd, buffer, 0, buffer.length, null, function (err) {
          if (err != null) { next(err) }
          fs.close(fd, function () {
            fs.createReadStream(tempFile)
              .pipe(unzipper.Parse())
              .on('entry', function (entry: any) {
                const writefile = entry.path
                const absolutePath = path.resolve('uploads/complaints/' + writefile)
                if (absolutePath.includes(path.resolve('.'))) {
                  const writefile_sanitized = path.resolve(writefile)
                  const writefile_sanitized2 = sanitize(writefile)
                  // ruleid: ts-file-overwrite
                  entry.pipe(fs.createWriteStream('uploads/complaints/' + writefile))
                  
                  // ok
                  entry.pipe(fs.createWriteStream('uploads/complaints/' + writefile_sanitized))

                  // ok
                  entry.pipe(fs.createWriteStream('uploads/complaints/' + writefile_sanitized2))
                } else {
                  entry.autodrain()
                }
              }).on('error', function (err) { next(err) })
          })
        })
      })
    }
  }
}


