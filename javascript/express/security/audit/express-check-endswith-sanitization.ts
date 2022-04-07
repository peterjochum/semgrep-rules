// Don't push this out until chainted taint mode gets implemented.
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
    if (file && endsWithAllowlistedFileType(file)) {
      // ruleid: express-endswith-sanitization
      res.sendFile(path.resolve('ftp/', file))
    } else {
      res.status(403)
      next(new Error('Only .md and .pdf files are allowed!'))
    }
  }

  function endsWithAllowlistedFileType (param) {
    return utils.endsWith(param, '.md') || utils.endsWith(param, '.pdf')
  }
}
