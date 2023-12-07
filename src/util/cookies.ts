export const getMaxAge = () => {
  let tokenExpiresString = process.env.JWT_EXPIRES_IN
  const numericPart = tokenExpiresString!.match(/\d+/)
  if (numericPart) {
    const tokenExpiresNum = parseInt(numericPart[0], 10)
    return tokenExpiresNum * 24 * 60 * 60 * 1000
  } else {
    return 14 * 24 * 60 * 60 * 1000
  }
}

export const ONE_DAY_AGE = 60 * 24 * 60 * 100
