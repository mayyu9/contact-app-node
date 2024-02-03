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

async function saveContacts(filePath, contactsObj) {
    try {
        await fs.writeFile(filePath, JSON.stringify(contactsObj), 'utf-8');

    } catch(err){
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

        // fs.writeFile(filePath, JSON.stringify(contactsData), 'utf-8');
        saveContacts(filePath, contactsData);
        res.status(200).json({message: 'Added data successfully.'})

    } catch(err){
        return res.status(500).json({message: 'Internal Server Error'});
    }
});

app.delete('/contact/delete/:str', async(req, res) => {
    try {
        const fileData = await readFileData();
        const searchString = req.params.str;

        // search for the string in the data and get the index.
        const idx = fileData.findIndex(contact => contact.firstName === searchString || contact.phoneNumber === searchString);

        if(idx == -1) {
            return res.status(404).json({ status: 'error', message: 'Contact not found' });
        }
  
        // remove the contact
        const deletedContact = fileData.splice(idx, 1);

        // fs.writeFile(filePath, JSON.stringify(fileData), 'utf-8');
        // res.status(200).json({message: 'Added data successfully.'})
        saveContacts(filePath, fileData);

        return res.status(200).json({message: `contact deleted successfully, ${deletedContact}`});

    } catch(err){
        return res.status(500).json({message: 'Internal Server Error'});
    }
});

app.listen(port, () => console.log('contacts app running on 8000'));