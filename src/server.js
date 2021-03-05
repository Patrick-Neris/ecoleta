const express = require ("express")
const server = express ()

//pegar o banco de dados
const db = require("./database/db")

//configurar pasta publica
server.use (express.static("public"))

//habilitando o uso do req.body na aplicação 
server.use(express.urlencoded({ extended: true }))


//usando template engine
const nunjucks = require ("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})


server.listen (3000)


// configurar caminhos: ir pra pagina inicial
// req: requisição
// res: resposta
server.get ("/", function(req, res) {
    return res.render (__dirname + "/views/index.html", { title: "Um título"})
})




server.get ("/create-point", function(req, res) {

    //console.log (req.query)


    return res.render ("create-point.html")
})

server.post ("/savepoint", (req , res) => {

    console.log(req.body)

        const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
        `

    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]
    
    function afterInsertData(err) {
        if (err) {
            console.log(err)
            return res.send("Erro no cadastro!")
        }

        console.log ("Cadastrado com sucesso")
        console.log (this)

        return res.render("create-point.html", {saved: true})
    }

    db.run (query, values, afterInsertData)

})


server.get ("/search", function(req, res) {

    const search = req.query.search

    if (search == "") {
        //pesquisa vazia
        return res.render (__dirname + "/views/search-results.html", {total: 0})
    }





        // pegar os dados do banco de dados
    db.all (`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
        if (err) {
        return console.log(err)
        }

        const total = rows.length
            
        return res.render (__dirname + "/views/search-results.html", { places: rows, total: total})
        })


})
