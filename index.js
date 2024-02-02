const express = require('express');
const fs = require('fs').promises;
const path = require('path');



const app = express();
const port = '8000';
const filePath = path.join('contacts.json');

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
    
})

app.listen(port, () => console.log('contacts app running on 8000'));