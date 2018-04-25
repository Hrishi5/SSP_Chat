const mongoose = require('mongoose')

mongoose.Promise = global.Promise ;
mongoose.connect('mongodb://localhost:27017/conversations') ;
exp = module.exports ;
var model = mongoose.model('conversations',{
    from:{
        type:String,
        required:true,
        minlength:1,
        trim:true
    },
    to:{
        type:String,
        required:true,
        minlength:1,
        trim:true
    },
    text : {
    type:String,
    required:true,
    minlength:1,
    trim:true
    },
    time:{
        type:Number,
        required:true,
        minlength:1
    }

})

exp.insertChat = function(chat) {
    chat.time = new Date() ;
    var newChat = new model(chat) ;
    newChat.save().then(function(doc)
    {
        return ;
    },function(error){
        return console.log(JSON.stringify(error))
    }) ;
}

exp.getChats = function(from,to) {
    model.find({
        from:from,
        to:to
    }).then(function(conv){
        return conv ;
    }) ;
}

return exp ;