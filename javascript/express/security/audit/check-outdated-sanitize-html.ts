const sanitizeHtml = require('sanitize-html')

export const sendNotification = function (challenge: { difficulty?: number, key: any, name: any, description?: any }, isRestore: boolean) {
  if (!notSolved(challenge)) {
    const notification = {
      key: challenge.key,
      name: challenge.name,

      //ruleid: check-outdated-sanitize-html
      challenge: challenge.name + ' (' + entities.decode(sanitizeHtml(challenge.description, { allowedTags: [], allowedAttributes: [] })) + ')',
      flag: flag,
      hidden: !config.get('challenges.showSolvedNotifications'),
      isRestore: isRestore
    }
  }
}