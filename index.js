const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const bodyParser = require('body-parser')



const app = express();
const port = '8000';
const filePath = path.join('contacts.json');

// parse application/json
app.use(bodyParser.json())
// app.use(express.json())

async function readFileData() {
    try{
        const fileContent = await fs.readFile(filePath, 'utf8');
        return JSON.parse(fileContent);
    }
    catch(error){
        return [];
    }
}

app.get('/', async (req, res) => {
    try {
        const fileData = await readFileData();
        // console.log('thakur: ', fileData, Array.isArray(fileData), fileData.length)
        if(fileData.length === 0) {
            res.json({message: 'No contacts found'})
        }
        res.json(fileData);
    } catch(err){
        // 404- indicates server unable to find the resource on server.
        // 403 - indicates unable to authorize the user.
        res.status(404).json({message: 'Error Data Not Found'}); 
    }
    
});

app.post('/addContact', async (req, res) => {
    console.log('newcontact: ',  req.url);

    try {
        const fileData = await readFileData();
        const newContact = req.body;
        console.log('newcontact: ', newContact, req.body);

    } catch(err){
        return res.status(500).json({message: 'Internal Server Error'});
    }
});

app.listen(port, () => console.log('contacts app running on 8000'));