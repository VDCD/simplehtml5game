//This is a logger, giving whats sent from server to user and how much time it took.
module.exports = (request, response, next) => {
  const start = +new Date();
  const stream = process.stdout;
  const url = request.url;
  const methode = request.method;

  response.on('finish', function () {
    const duration = +new Date() - start;
    const message = methode + ' to ' + url + '\ntook ' + duration + ' ms \n\n';
    stream.write(message); // Ecris le message.
  });

  next();
}
