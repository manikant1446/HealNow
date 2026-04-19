const express = require('express');
const { protect } = require('../middleware/auth');
const Contact = require('../models/Contact');
const User = require('../models/User');
const Consultation = require('../models/Consultation');

const router = express.Router();

/**
 * @route   GET /api/contacts
 * @desc    Get all contacts for the current user
 */
router.get('/', protect, async (req, res) => {
  try {
    const contacts = await Contact.find({ userId: req.user._id })
      .populate('contactUserId', 'name email role walletAddress specialty hospital avatar');
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contacts' });
  }
});

/**
 * @route   POST /api/contacts
 * @desc    Add a contact by email
 */
router.post('/', protect, async (req, res) => {
  try {
    const { email, nickname, trustLevel } = req.body;

    const contactUser = await User.findOne({ email: email.toLowerCase() });
    if (!contactUser) {
      return res.status(404).json({ message: 'User not found with that email' });
    }
    if (contactUser._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot add yourself as a contact' });
    }

    const existingContact = await Contact.findOne({
      userId: req.user._id,
      contactUserId: contactUser._id
    });
    if (existingContact) {
      return res.status(400).json({ message: 'Contact already exists' });
    }

    const contact = await Contact.create({
      userId: req.user._id,
      contactUserId: contactUser._id,
      nickname: nickname || contactUser.name,
      trustLevel: trustLevel || 3
    });

    const populated = await contact.populate('contactUserId', 'name email role walletAddress specialty hospital avatar');
    res.status(201).json(populated);
  } catch (error) {
    console.error('Add contact error:', error);
    res.status(500).json({ message: 'Error adding contact' });
  }
});

/**
 * @route   DELETE /api/contacts/:id
 * @desc    Remove a contact
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    await Contact.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ message: 'Contact removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing contact' });
  }
});

/**
 * @route   GET /api/contacts/trust-check/:doctorId
 * @desc    Check if any of user's contacts have visited a specific doctor
 *          This implements the Trust-Based Discovery feature
 */
router.get('/trust-check/:doctorId', protect, async (req, res) => {
  try {
    const doctorId = req.params.doctorId;

    // Get all of the user's contacts
    const contacts = await Contact.find({ userId: req.user._id });
    const contactUserIds = contacts.map(c => c.contactUserId);

    // Find consultations where those contacts were treated by this doctor
    const trustedVisits = await Consultation.find({
      patientId: { $in: contactUserIds },
      doctorId: doctorId,
      status: 'treated'
    }).populate('patientId', 'name email');

    // Get the contact names who visited this doctor
    const trustedContacts = trustedVisits.map(v => ({
      name: v.patientId.name,
      date: v.date,
      category: v.category
    }));

    res.json({
      hasTrustedVisits: trustedContacts.length > 0,
      count: trustedContacts.length,
      contacts: trustedContacts
    });
  } catch (error) {
    console.error('Trust check error:', error);
    res.status(500).json({ message: 'Error performing trust check' });
  }
});

module.exports = router;
