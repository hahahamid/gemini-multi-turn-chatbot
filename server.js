const PORT = 8080; 

const express = require('express')
const cors = require('cors');
const { configDotenv } = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express()

app.use(cors())
app.use(express.json())

const genAI = new GoogleGenerativeAI("AIzaSyCPvaDnapLxlYdMr12-64acWQcNVbE9Nwc")

app.post('/gemini', async(req, res) => {
    
    const model = genAI.getGenerativeModel({model: 'gemini-pro'})
    const chat = model.startChat({
        history: req.body.history,
    })
    const msg = req.body.message

    const result = await chat.sendMessage(msg);
    const response =  result.response; 
    const text = response.text();
    res.send(text); 
})


app.listen(PORT, () => {
    console.log(`running on port ${PORT}`);
})
