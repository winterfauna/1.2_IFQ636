//Get conferences. Still requires a functional model?

const Conference = require('../models/Conference'); 
const getConferences = async (req, res) => { 
try { 
const Conferences = await Conference.find({ userId: req.user.id }); 
res.json(Conferences); 
} catch (error) { 
res.status(500).json({ message: error.message }); 
} 
};


//Add Conference. 
const addConference = async (req, res) => {
const { title, description, date } = req.body;
try {
const conference = await Conference.create({ userId: req.user.id, title, description, 
date });
res.status(201).json(conference);
} catch (error) {
res.status(500).json({ message: error.message });
}
};

//update conference
const updateConference = async (req, res) => {
const { title, description, completed, date } = req.body;
try {
const conference = await Conference.findById(req.params.id);
if (!conference) return res.status(404).json({ message: 'Conference not found' });
conference.title = title || conference.title;
conference.description = description || conference.description;
conference.completed = completed ?? conference.completed;
conference.date = date || conference.date;
const updatedConference = await conference.save();
res.json(updatedConference);
} catch (error) {
res.status(500).json({ message: error.message });
}
};


//delete conference
const deleteConference = async (req, res) => {
try {
const conference = await Conference.findById(req.params.id);
if (!conference) return res.status(404).json({ message: 'Conference not found' });
await conference.remove();
res.json({ message: 'Conference deleted' });
} catch (error) {
res.status(500).json({ message: error.message });
}
};
module.exports = { getConferences, addConference, updateConference, deleteConference };