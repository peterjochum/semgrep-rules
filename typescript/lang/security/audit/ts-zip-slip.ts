import fs = require('fs')
const path = require('path')
const unzip = require('unzip')
const unzipper = require('unzipper')
const sanitize = require('sanitize-filename')

function unzipperBad ({ file }: Request, res: Response, next: NextFunction) {
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
                  const writefile_sanitized = path.basename(writefile)
                  const writefile_sanitized2 = sanitize(writefile)
                  // ruleid: ts-zip-slip
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

function unzipBad ({ file }: Request, res: Response, next: NextFunction) {
  fs.createReadStream(file)
    .pipe(unzip.Parse())
    .on('entry', function (entry) {
      var fileName = entry.path;
      if (fileName === "this IS the file I'm looking for") {
        // ruleid: ts-zip-slip
        entry.pipe(fs.createWriteStream('output/path' + fileName));
      } else {
        entry.autodrain();
      }
    });

  fs.createReadStream(file)
    .pipe(unzip.Parse())
    .on('entry', function (entry) {
      var fileName = entry.path;
      if (fileName === "this IS the file I'm looking for") {
        // ok
        entry.pipe(fs.createWriteStream('output/path'));
      } else {
        entry.autodrain();
      }
    });
}
