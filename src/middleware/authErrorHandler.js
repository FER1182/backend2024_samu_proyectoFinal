function authErrorHandler(err, req, res, next) {
    if (err && err.message === 'Unauthorized') {
        res.status(403).render('unauthorized');
    } else {
        next(err); // Pasar al siguiente manejador de errores si es necesario
    }
}

export default authErrorHandler;