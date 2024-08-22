function generarResetToken() {
    const token = Math.floor(Math.random() * 899000)+100000;

    return token;
}

export default generarResetToken
