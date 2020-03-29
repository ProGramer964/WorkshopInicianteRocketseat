// Usei o express para criar e configurar meu servidor 
const express = require('express') //Importa o modulo "express" do arquivo package.json
const server = express()

const db = require("./db.js")


// Configurar arquivos estáticos  express (css,scripts,imagens)
server.use(express.static("public"))

// Habilitar uso do req.body
server.use(express.urlencoded({ extended: true }))

// Configuração do nunjucks
const nunjucks = require("nunjucks")
nunjucks.configure("views", {
    express: server, //Linka com express através da variavel server
    noCache: true, //boolean
})



// Criei uma rota /
// E capturo o pedido do cliente para responder
server.get("/", function (req, res) {

    db.all(`SELECT * FROM ideas`, function (err, rows) { //Seleciona todos os registros de "ideas" //Captura erros e rows(linhas)
        if (err) {
            console.log(err)
            return res.send("Erro no banco de dados!")
        }

        const reversedIdeas = [...rows].reverse() // Todo o conteudo de "rows" é revertido e jogado para a variavel reversedIdeas

        let lastIdeas = []   //Let permite que o valor da variavel seja modificado
        for (let idea of reversedIdeas) {
            if (lastIdeas.length < 2) {
                lastIdeas.push(idea)
            }
        }

        return res.render("index.html", { ideas: lastIdeas })
    })

})



server.get("/ideias", function (req, res) {



    db.all(`SELECT * FROM ideas`, function (err, rows) {
        if (err) {
            console.log(err)
            return res.send("Erro no banco de dados!")
        }

        const reversedIdeas = [...rows].reverse()

        return res.render("ideias.html", { ideas: reversedIdeas })
    })
})

server.post("/", function (req, res) {
    // Inserir dado na tabela
    const query = `

    INSERT INTO ideas(
        image,
        title,
        category,
        description,
        link

    ) VALUES(?,?,?,?,?);     
 `

    const values = [
        req.body.image,
        req.body.title,
        req.body.category,
        req.body.description,
        req.body.link
    ]

    db.run(query, values, function (err) {
        if (err) {
            console.log(err)
            return res.send("Erro no banco de dados!")
        }

        return res.redirect("/ideias")

    })


})

// liguei meu servidor na porta 3000
server.listen(3000)



