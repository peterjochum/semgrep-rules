const pug = require('pug')

fs.readFile('views/userProfile.pug', function (err, buf) {
    if (err != null) throw err
    const loggedInUser = security.authenticatedUsers.get(req.cookies.token)
    if (loggedInUser) {
        models.User.findByPk(loggedInUser.data.id).then(user => {
            let tainted = buf.toString()
            let username = user.dataValues.username
            if (username.match(/#{(.*)}/) !== null && !utils.disableOnContainerEnv()) {
                req.app.locals.abused_ssti_bug = true
                const code = username.substring(2, username.length - 1)
                try {
                    username = eval(code) // eslint-disable-line no-eval
                } catch (err) {
                    username = '\\' + username
                }
            } else {
                username = '\\' + username
            }
            const theme = themes[config.get('application.theme')]
            tainted = tainted.replace(/_username_/g, username)
            tainted = tainted.replace(/_emailHash_/g, security.hash(user.dataValues.email))
            tainted = tainted.replace(/_title_/g, entities.encode(config.get('application.name')))
            tainted = tainted.replace(/_favicon_/g, favicon())
            tainted = tainted.replace(/_bgColor_/g, theme.bgColor)
            tainted = tainted.replace(/_textColor_/g, theme.textColor)
            tainted = tainted.replace(/_navColor_/g, theme.navColor)
            tainted = tainted.replace(/_primLight_/g, theme.primLight)
            tainted = tainted.replace(/_primDark_/g, theme.primDark)
            tainted = tainted.replace(/_logo_/g, utils.extractFilename(config.get('application.logo')))

            // ruleid: tainted-pug-template2-compile
            const bad = pug.compile(tainted)


            let untainted = buf.toString()
            untainted = untainted.replace(/_title_/g, entities.encode(config.get('application.name')))
            untainted = untainted.replace(/_favicon_/g, favicon())
            untainted = untainted.replace(/_bgColor_/g, theme.bgColor)
            untainted = untainted.replace(/_textColor_/g, theme.textColor)
            untainted = untainted.replace(/_navColor_/g, theme.navColor)
            untainted = untainted.replace(/_primLight_/g, theme.primLight)
            untainted = untainted.replace(/_primDark_/g, theme.primDark)
            untainted = untainted.replace(/_logo_/g, utils.extractFilename(config.get('application.logo')))

            // ok
            const okay = pug.compile(untainted)
        })
    }
})
