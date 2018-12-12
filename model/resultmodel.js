var mongoose = require('mongoose');

var resultSchema = mongoose.Schema({

    result_id:{
      type:Number
    },
    userName:{
        type: String
    },
    latex_op:{
        type: String
    },
    date:{
        type: Date
    },
    img: { data: Buffer, contentType: String }

    });

module.exports = mongoose.model('results', resultSchema);
