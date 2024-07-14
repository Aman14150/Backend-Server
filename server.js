const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

let contacts = []; // In-memory data storage for example purposes

// Route to get contacts
app.get('/contacts', (req, res) => {
  res.status(200).json({ data: contacts });
});

// Route to add a new contact
app.post('/contacts', (req, res) => {
  const { name, email, phone } = req.body;
  const newContact = { id: contacts.length + 1, name, email, phone };
  contacts.push(newContact);
  res.status(201).json({ message: 'Contact added successfully', data: newContact });
});

// Route to delete a contact
app.delete('/contacts/:id', (req, res) => {
  const { id } = req.params;
  contacts = contacts.filter(contact => contact.id !== parseInt(id, 10));
  res.status(200).json({ message: 'Contact deleted successfully' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
