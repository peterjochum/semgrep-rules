module.exports = function resetPassword () {
  return ({ body, connection }: Request, res: Response, next: NextFunction) => {
    const email = body.email
    const answer = body.answer
    const newPassword = body.new
    const repeatPassword = body.repeat
    if (!email || !answer) {
      next(new Error('Blocked illegal activity by ' + connection.remoteAddress))
    } else if (!newPassword || newPassword === 'undefined') {
      res.status(401).send(res.__('Password cannot be empty.'))
    } else if (newPassword !== repeatPassword) {
      res.status(401).send(res.__('New and repeated password do not match.'))
    } else {
      models.SecurityAnswer.findOne({
        include: [{
          model: models.User,
          where: { email }
        }]
      }).then(data => {
        if (security.hmac(answer) === data.answer) {
          models.User.findByPk(data.UserId).then(user => {
            user.update({ password: newPassword }).then(user => {
              verifySecurityAnswerChallenges(user, answer)
              res.json({ user })
            }).catch((error: Error) => {
              next(error)
            })
          }).catch((error: Error) => {
            next(error)
          })
        } else {
          // ruleid: express-check-security-questions
          res.status(401).send(res.__('Wrong answer to security question.'))
        }
      }).catch((error: Error) => {
        next(error)
      })
    }
  }
}
