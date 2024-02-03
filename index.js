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

app.get('/contact/searchByName/:name', async (req, res) => {
    try {
        const fileData = await readFileData();
        const searchString = req.params.name;

        const isContactFound = fileData.find(contact => contact.firstName === searchString || contact.lastName === searchString)

        if(!isContactFound) {
            return res.status(404).json({message:'contact not found'});
        }

        return res.json({data: isContactFound});

    } catch(err) {
        return res.status(500).json({message: 'Internal Server Error'});
    }
});

app.get('/contact/searchByPhoneNumber/:name', async (req, res) => {
    try {
        const fileData = await readFileData();
        const searchString = req.params.name;

        const isContactFound = fileData.find(contact => contact.phoneNumber === searchString)

        if(!isContactFound) {
            return res.status(404).json({message:'contact not found'});
        }

        return res.json({data: isContactFound});

    } catch(err) {
        return res.status(500).json({message: 'Internal Server Error'});
    }
});

app.post('/contact/add', async (req, res) => {
    try {
        const contactsData = await readFileData();
        const {firstName, lastName, phoneNumber} = req.body; // postbody data passed
        
        // check if the contact already exists.
        const isContactExists = contactsData.find(contact => contact.firstName === firstName && contact.lastName === lastName || contact.phoneNumber === phoneNumber );

        if(isContactExists) {
            return res.status(400).json({ status: 'error', message: 'Contact already exists' });
        }

        // contact doesn't exists add it to the contact.json file.
        contactsData.push({firstName, lastName, phoneNumber});

        fs.writeFile(filePath, JSON.stringify(contactsData), 'utf-8');
        res.status(200).json({message: 'Added data successfully.'})

    } catch(err){
        return res.status(500).json({message: 'Internal Server Error'});
    }
});

app.listen(port, () => console.log('contacts app running on 8000'));