const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;
const mongoUri = process.env.MONGODB_URI;

app.use(express.json());
app.use(cors());

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected...'))
  .catch((err) => console.error(err));

const courseSchema = new mongoose.Schema({
  courseId: Number,
  title: String,
  description: String,
  duration: String,
});

const Course = mongoose.model('Course', courseSchema, 'courses');

const subscriptionSchema = new mongoose.Schema({
  courseId: Number,
  title: String,
  description: String,
  duration: String,
});

const Subscription = mongoose.model('Subscription', subscriptionSchema, 'subscribed');

app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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

app.delete('/api/courses/:courseId', async (req, res) => {
  try {
    const course = await Course.findOneAndDelete({ courseId: req.params.courseId });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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

app.delete('/api/subscribed/:courseId', async (req, res) => {
  try {
    const subscription = await Subscription.findOneAndDelete({ courseId: req.params.courseId });
    if (!subscription) return res.status(404).json({ message: 'Subscription not found' });
    res.json({ message: 'Subscription deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/subscribed', async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.json(subscriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
