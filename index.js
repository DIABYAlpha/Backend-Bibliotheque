//------------------ la création de l'application ( API manipulant des livres) ------------//

// la declaration des variables se fait toujours au dessus ici 

const express = require("express")
const app = express()

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//-----------------Mise en place de la REST API--------------------//
const Livres = require('./livres'); // on importe notre model
const { restart } = require("nodemon");
const livres = require("./livres");


app.use(bodyParser.json())  // il faut déclarer avant les methodes 

//----------------------------l'endroit ou je dois rajouter l'autorisation -------------------//
// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
//------------------------Mise en place de la REST API ----------------------------------//

mongoose.connect(
    'mongodb+srv://alpha:18amadou@cluster0.99su1.mongodb.net/biblio?retryWrites=true&w=majority'
    , err => {
        if (err) throw 'erreur est : ', err;
        console.log('connected to MongoDB');
    });


//------------------------la création des routes --------------------------------------//
//-----------------------------Methode (Routes) Get----------------------------------------------//



app.get('/', async (req, res) => {
    res.send('<h1>Base de données</h1> <a href="/livres">Livres</a>'); // pour nommer ma base de données avec un h1
});

app.get('/livres', async (req, res) => {
    const livres = await Livres.find() // on recupére tous les livres
    res.json(livres)
});

app.get('/livres/:id', async (req, res) => {
    const id = req.params.id                          // On recupére la valeur dans l'URL 
    const livre = await Livres.findOne({ _id: id })    // oN recupére le livre grâce à l'id 
    res.json(livre)
})


//------------------------------------Methode Get par catégories (genre)----------------------------------------//

app.get('/livresByGenre', async (req, res) => {

    const genrerequest = req.query.genre  //Une constante que je récup dans ma requête(req) grâce au query 
    //genrequest est une variable quelconque que je choisi 
    // Je fais une recherche find by (par critere) dans mon objet 
    const findbycat = await Livres.find({
        genre: genrerequest
    })
    // J'envoie la reponse qui figure dans POSTMAN : http://localhost:3000/livresByGenre?genre=Policier 
    res.json(findbycat)
})



//---------------------------------Methode Get par min et max -------------------//
// properties ? min = 0 & max=10000

app.get('/livresByPrice', async (req, res) => {

    const min = req.query.min;
    const max = req.query.max;
    console.log(min, max);

    const findbyprice = await Livres.find({
        price: { $gte: min, $lte: max }        // gte >= ou lte : <=
    });
    res.json(findbyprice);

});

//----------------------------Methode Get par mots clés------------------------------------------//
app.get('/livresByKeyword', async (req, res) => {  // je app.get ('/je choisis le nom de route ou le type de recherche)

    const FindKeyWord = req.query.motCles

    const keyWord = await Livres.find({
    $or: [                                       // or permet de pouvoir utiliser plusieurs prop du model ( titre, auteur, genre)
        { 'titre': new RegExp(FindKeyWord, 'i')},         //  Un objet RegExp est utilisé pour étudier les correspondances
            { 'auteur': new RegExp(FindKeyWord, 'i')},    //  d'un texte avec un motif donné. Il évite de taper le mot en 
            { 'genre': new RegExp(FindKeyWord, 'i')},     // entier et peux trouver à partir des suggestions.
    ]
    })

    res.json(keyWord)

});

//-----------------------------Methode (Route) Post----------------------------------------------//
app.post('/livres', async (req, res) => {
    const titre = req.body.titre; // recuperation des variables du body 
    const auteur = req.body.auteur;
    const genre = req.body.genre;
    const image = req.body.image;
    const price = req.body.price


    const nouveau_livre = new Livres({ // création d'un objet representant notre model 
        titre: titre,
        auteur: auteur,
        genre: genre,
        image: image,
        price: price
    })

    await nouveau_livre.save() // Sauvegarde asynchrone du nouveau livre 
    res.json(nouveau_livre)
})


//----------------------------Methode Delete -------------------------------------------------//

app.delete('/livres/:id', async (req, res) => {
    const id = req.params.id
    const suppr = await Livres.deleteOne({ _id: id })
    res.json(suppr)

})

//------------------------------La méthode Patch- (put pour que ce soit identique à mon front end) -------------------------------------------//

app.put("/livres/:id", async (req, res) => {
    const id = req.params.id
    const livre = await Livres.findOne({ _id: id })

    // On recupére les valeurs potentiellement modifiées 

    const titre = req.body.titre;
    const auteur = req.body.auteur;
    const genre = req.body.genre;
    const image = req.body.image;
    const price = req.body.price

    // On vérifie maintenant si les valeurs sont remplies, si elles sont en 

    if (titre) {
        livre.titre = titre
    }
    if (auteur) {
        livre.auteur = auteur
    }
    if (genre) {
        livre.genre = genre
    }
    if (image) {
        livre.image = image
    }
    if (price) {
        livre.price = price
    }

    await livre.save() // On sauvegarde les modifications 
    res.json(livre)

})

//------------------ la création du serveur web-----------------------------//

// app.get('/', function (req, res) {  // creation de la route sous le verbe get
//     res.send('Hello World !')       // envoi de helloworld à l'utilisateur 
// })

app.listen(3000, () => {
    console.log('le serveur fonctionne');
}) 


