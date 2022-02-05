const express = require('express')
const app = express()
const { randomUUID } = require("crypto")
const fs = require("fs")

//configs

//express
app.use(express.json())

let products = []

//file-system
fs.readFile("products.json", "utf-8", (error, data) => {
    if (error)
        console.log("there was an error: " + error)
    else
        products = JSON.parse(data)
})

function ProdFile() {
    fs.writeFile("products.json", JSON.stringify(products), (error) => {
        if (error)
            console.log("there was an error: " + error)
        else
            console.log("product added sucessfully.")
    })
}

//routes
app.get("/home", (req, res) => {
    res.send("Welcome to the home page")
})

app.post("/products", (req, res) => {
    const { name, price } = req.body
    const product = {
        name,
        price,
        id: randomUUID()
    }
    products.push(product)
    ProdFile()

    return res.json(product)
})

app.get("/products", (req, res) => {
    return res.json(products)
})

app.get("/products/:id", (req, res) => {
    const { id } = req.params
    const product = products.find((product) => product.id === id)
    return res.json(product)
})

app.put("/products/:id", (req, res) => {
    const { id } = req.params
    const { name, price } = req.body

    const productIndex = products.findIndex((product) => product.id === id)
    products[productIndex] = {
        id: products[productIndex].id,
        name,
        price,
    }
    ProdFile()
    return res.send("product updated sucessfully.")
})

app.delete("/products/:id", (req, res) => {
    const { id } = req.params
    const productIndex = products.findIndex((product) => product.id === id)
    products.splice(productIndex, 1)

    ProdFile()

    res.send("product removed sucessfully.")
})

app.listen(8081, () => {
    console.log("server is running in url http://localhost:8081")
})