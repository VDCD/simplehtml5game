//This is a logger, giving whats sent from server to user and how much time it took.
module.exports = function(request, response, next){
    var start = +new Date();
    var stream = process.stdout;
    var url = request.url;
    var methode = request.method;

    response.on('finish', function(){
      var duration = +new Date() - start;
      var message = methode + ' to ' +url + '\ntook '+ duration + ' ms \n\n';
      stream.write(message); // Ecris le message.
    });

    next();
}
