require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Define Contact schema and model
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
});

const Contact = mongoose.model('users', contactSchema);

// Routes
app.get('/contacts', async (req, res) => {
    try {
      const { name, email, phone } = req.query;
      const contacts = await Contact.find({ name, email, phone });
      res.status(200).json(contacts);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching contacts', error });
    }
  });

  app.get('/contacts/:email', async (req, res) => {
    try {
      const { email } = req.params;
      const contact = await Contact.findOne({ email });
      if (contact) {
        res.status(200).json(contact);
      } else {
        res.status(404).json({ message: 'Contact not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching contact', error });
    }
  });

  app.post('/contacts', async (req, res) => {
    try {
      const { name, email, phone } = req.body;
      const newContact = new Contact({ name, email, phone });
      await newContact.save();
      res.status(201).json(newContact);
    } catch (error) {
      res.status(500).json({ message: 'Error adding contact', error });
    }
  });
  

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
