/* Rate limiting */
app.use('/rest/user/reset-password', new RateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  // ruleid: express-check-rate-limiting-bypass-taint
  keyGenerator ({ headers, ip }) { return headers['X-Forwarded-For'] || ip }
}))

/* Rate limiting */
app.use('/reset-username', new RateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  // ok
  keyGenerator ({ ip }) { ip }
}))

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    // ruleid: express-check-rate-limiting-bypass-taint
    keyGenerator ({ headers, ip }) { return headers['Forwarded'] || ip }
})

// Apply the rate limiting middleware to all requests
app.use(limiter)
