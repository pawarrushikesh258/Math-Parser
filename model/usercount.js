var mongoose = require('mongoose');

var countSchema = mongoose.Schema({

    userCount:{
        type:Number
    },
    userName:{
        type: String
    }

});

module.exports = mongoose.model('count', countSchema);