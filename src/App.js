import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import './App.css';
import Grid from '@mui/material/Grid2';
import CourseList from './components/CourseList';
import Courses from './components/Courses';
import SubscriptionBasket from './components/SubscriptionBasket'; // Optional Drag and Drop

function App() {
  const [courses, setCourses] = useState([   // this is temporaty. Whe using backend, use CourseList component
    { id: '1', title: 'Course 1', description: 'Description 1', duration: 10 },
    { id: '2', title: 'Course 2', description: 'Description 2', duration: 8 },
    { id: '3', title: 'Course 3', description: 'Description 3', duration: 6 },
  ]);

  const [subscribedCourses, setSubscribedCourses] = useState([]);

  const handleOnDragEnd = (result) => {
    const { source, destination } = result;

    // Dropped outside any droppable area
    if (!destination) return;

    if (source.droppableId === 'courses' && destination.droppableId === 'subscribed') {
      // Moving from available courses to subscribed courses
      const draggedCourse = courses[source.index];
      if (!subscribedCourses.some((course) => course.id === draggedCourse.id)) {
        setSubscribedCourses([...subscribedCourses, draggedCourse]);
      }
    }
  };

  const handleSubscribe = (course) => {
    if (!subscribedCourses.some((c) => c.id === course.id)) {
      setSubscribedCourses([...subscribedCourses, course]);
    }
  };

  const handleUnsubscribe = (course) => {
    setSubscribedCourses(subscribedCourses.filter((c) => c.id !== course.id));
  };

  return (
    <div className="App">
      <h1>Course Subscription App</h1>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        {/* Droppable for available courses */}
        <Grid container>
          <Grid item size={6}>

            <Droppable droppableId="courses">
              {(provided) => (
                <div className="course-list" {...provided.droppableProps} ref={provided.innerRef}>
                  <h2>Available Courses</h2>
                  {courses.map((course, index) => (
                    <Draggable key={course.id} draggableId={course.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="course-card"
                        >
                          <h3>{course.title}</h3>
                          <p>{course.description}</p>
                          <p>Duration: {course.duration} hours</p>
                          <button onClick={() => handleSubscribe(course)}>Subscribe</button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </Grid>

          <Grid item size={6}>
            {/* Droppable for subscribed courses */}
            <Droppable droppableId="subscribed">
              {(provided) => (
                <div className="subscription-basket" {...provided.droppableProps} ref={provided.innerRef}>
                  <h2>Subscribed Courses</h2>
                  {subscribedCourses.length > 0 ? (
                    subscribedCourses.map((course, index) => (
                      <div key={course.id}>
                        <h3>{course.title}</h3>
                        <button onClick={() => handleUnsubscribe(course)}>Unsubscribe</button>
                      </div>
                    ))
                  ) : (
                    <p>No subscribed courses yet</p>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

          </Grid>
        </Grid>
      </DragDropContext>
    </div>
  );
}

export default App;
