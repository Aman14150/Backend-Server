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

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
});

const Contact = mongoose.model('contacts', contactSchema);

// Routes
// Get all contacts
app.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contacts', error });
  }
});

// Add a new contact
app.post('/contacts', async (req, res) => {
    try {
      const { name, email, phone } = req.body;
      const newContact = new Contact({ name, email, phone });
      await newContact.save();
      res.status(201).json({ message: 'Contact added successfully', data: newContact });
    } catch (error) {
      res.status(500).json({ message: 'Error adding contact', error });
    }
  });

// Delete a contact
app.delete('/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Contact.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({ message: 'Contact deleted successfully' });
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contact', error });
  }
});


// Update a contact
app.put('/contacts/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, phone } = req.body;
      const updatedContact = await Contact.findByIdAndUpdate(id, { name, email, phone }, { new: true });
      if (updatedContact) {
        res.status(200).json({ message: 'Contact updated successfully', data: updatedContact });
      } else {
        res.status(404).json({ message: 'Contact not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating contact', error });
    }
  });

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
