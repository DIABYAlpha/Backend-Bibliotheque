const mongoose = require('mongoose')
//---------------- la création du schéma ( un objet avec 3 champs qui sont des chaines de caractéres)-----------------//

const schema = mongoose.Schema({
    titre: {
        type: String,
        minlength: 3
    },
    auteur: String,
    genre: { 
        type :String, 
        default : "roman"
    },
    image : String,
    price :{
        type : Number,
    } 
})

module.exports = mongoose.model('livre', schema)    // pour transformer le schéma en model 