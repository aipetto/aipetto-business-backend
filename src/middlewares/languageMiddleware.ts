export function languageMiddleware(req, res, next) {
  req.language = req.headers['accept-language'] || 'pt-BR';
  return next();
}
