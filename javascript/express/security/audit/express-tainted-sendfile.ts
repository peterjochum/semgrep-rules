module.exports = function servePublicFiles () {
  return ({ params, query }: Request, res: Response, next: NextFunction) => {
    const file = params.file

    if (!file.includes('/')) {
      verify(file, res, next)
    } else {
      res.status(403)
      next(new Error('File names cannot contain forward slashes!'))
    }
  }

  function verify (file, res, next) {
    if (file && (endsWithAllowlistedFileType(file) || (file === 'incident-support.kdbx'))) {
      // ruleid: express-tainted-sendfile
      res.sendFile(path.resolve('ftp/', file))
    } else {
      res.status(403)
      next(new Error('Only .md and .pdf files are allowed!'))
    }
  }
}

module.exports = function servePublicFiles2 () {
  return ({ params, query }: Request, res: Response, next: NextFunction) => {
    const file = params.file

    if (!file.includes('/')) {
      verify2(file, res, next)
    } else {
      res.status(403)
      next(new Error('File names cannot contain forward slashes!'))
    }
  }

  function verify2 (file, res, next) {
    if (file && (endsWithAllowlistedFileType(file) || (file === 'incident-support.kdbx'))) {
      // ok
      res.sendFile(path.resolve('ftp/'))
    } else {
      res.status(403)
      next(new Error('Only .md and .pdf files are allowed!'))
    }
  }
}
