const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb+srv://doadmin:J07269aVpoe35Bf4@db-mongodb-new-analytics-test-3a2744f1.mongo.ondigitalocean.com/admin?tls=true&authSource=admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected...'))
  .catch((err) => console.error(err));

// Course Schema
const courseSchema = new mongoose.Schema({
  courseId: Number,
  title: String,
  description: String,
  duration: String,
});

const Course = mongoose.model('Course', courseSchema, 'courses');

// Subscription Schema
const subscriptionSchema = new mongoose.Schema({
  courseId: Number,
  title: String,
  description: String,
  duration: String,
});

const Subscription = mongoose.model('Subscription', subscriptionSchema, 'subscribed');

// GET all available courses
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST to create a new course
app.post('/api/courses', async (req, res) => {
  const { courseId, title, description, duration } = req.body;

  const course = new Course({
    courseId,
    title,
    description,
    duration,
  });

  try {
    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE an available course
app.delete('/api/courses/:courseId', async (req, res) => {
  try {
    const course = await Course.findOneAndDelete({ courseId: req.params.courseId });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST to subscribe to a course
app.post('/api/subscribed', async (req, res) => {
  const { courseId, title, description, duration } = req.body;

  const subscription = new Subscription({
    courseId,
    title,
    description,
    duration,
  });

  try {
    const newSubscription = await subscription.save();
    console.log(newSubscription);
    res.status(201).json(newSubscription);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a subscription
app.delete('/api/subscribed/:courseId', async (req, res) => {
  try {
    const subscription = await Subscription.findOneAndDelete({ courseId: req.params.courseId });
    if (!subscription) return res.status(404).json({ message: 'Subscription not found' });
    res.json({ message: 'Subscription deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// GET all subscriptions
app.get('/api/subscribed', async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.json(subscriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
