
var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://suleman:fbxlilt247@cluster0.nz5ar.mongodb.net/adminDB?retryWrites=true&w=majority', {useNewUrlParser: true});
var conn = mongoose.connection;
conn.on('connected', function() {
    console.log('database is connected successfully');
});
conn.on('disconnected',function(){
    console.log('database is disconnected successfully');
});
conn.on('error', console.error.bind(console, 'connection error:'));
module.exports = conn;
