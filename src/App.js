import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import './App.css';
import Grid from '@mui/material/Grid2';

function App() {
  const [courses, setCourses] = useState([]);
  const [subscribedCourses, setSubscribedCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courseResponse = await fetch('http://localhost:5000/api/courses');
        const courseData = await courseResponse.json();
        setCourses(courseData);

        const subscribedResponse = await fetch('http://localhost:5000/api/subscribed');
        const subscribedData = await subscribedResponse.json();
        setSubscribedCourses(subscribedData);
      } catch (error) {
        console.error('Error fetching courses or subscriptions:', error);
      }
    };

    fetchCourses();
  }, []);

  const handleSubscribe = async (course) => {
    if (!subscribedCourses.some((c) => c.courseId === course.courseId)) {
      const response = await fetch('http://localhost:5000/api/subscribed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: course.courseId,
          title: course.title,
          description: course.description,
          duration: course.duration,
        }),
      });

      if (response.ok) {
        console.log("response is ok");
        console.log(`http://localhost:5000/api/courses/${course.courseId}`);

        // Remove from available courses
        await fetch(`http://localhost:5000/api/courses/${course.courseId}`, {
          method: 'DELETE',
        });

        setSubscribedCourses([...subscribedCourses, {
          courseId: course.courseId,
          title: course.title,
          description: course.description,
          duration: course.duration
        }]);

        console.log(courses.filter(c => c.courseId !== course.courseId));

        setCourses(courses.filter(c => c.courseId !== course.courseId));
      } else {
        console.error('Failed to subscribe:', await response.json());
      }
    }
  };


  const handleUnsubscribe = async (subscription) => {
    console.log(subscription.courseId);
    await fetch(`http://localhost:5000/api/subscribed/${subscription.courseId}`, {
      method: 'DELETE',
    });

    // Add the unsubscribed course back to available courses
    await fetch('http://localhost:5000/api/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        courseId: subscription.courseId,
        title: subscription.title,
        description: subscription.description,
        duration: subscription.duration,
      }),
    });

    setSubscribedCourses(subscribedCourses.filter((c) => c.courseId !== subscription.courseId));
    setCourses([...courses, {
      courseId: subscription.courseId,
      title: subscription.title,
      description: subscription.description,
      duration: subscription.duration
    }]);
  };

  const handleOnDragEnd = (result) => {
    const { source, destination } = result;

    // Dropped outside any droppable area
    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      // Handle reordering within the same list (either "courses" or "subscribed")
      if (source.droppableId === 'courses') {
        const reorderedCourses = Array.from(courses);
        const [movedCourse] = reorderedCourses.splice(source.index, 1);
        reorderedCourses.splice(destination.index, 0, movedCourse);
        setCourses(reorderedCourses);
      }
    } else if (source.droppableId === 'courses' && destination.droppableId === 'subscribed') {
      // Moving from available courses to subscribed courses
      const draggedCourse = courses[source.index];
      handleSubscribe(draggedCourse);
    }
  };

  return (
    <div className="App">
      <h1>Course Subscription App</h1>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Grid container>
          <Grid size={6}>
            <Droppable droppableId="courses">
              {(provided) => (
                <div className="course-list" {...provided.droppableProps} ref={provided.innerRef}>
                  <h2>Available Courses</h2>
                  {courses.map((course, index) => (
                    <Draggable key={index} draggableId={index.toString()} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="course-card"
                        >
                          <h3>{course.title}</h3>
                          <p>{course.description}</p>
                          <p>Duration: {course.duration}</p>
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

          <Grid size={6}>
            <Droppable droppableId="subscribed">
              {(provided, snapshot) => (
                <div
                  className="subscription-basket"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    backgroundColor: snapshot.isDraggingOver ? 'lightblue' : 'white',
                    transition: 'background-color 0.3s ease',
                  }}
                >
                  <h2>My Courses</h2>
                  {subscribedCourses.length > 0 ? (
                    subscribedCourses.map((subscription, index) => (
                      <div key={index} className="subscribed-course-card">
                        <h3>{subscription.title}</h3>
                        <p>{subscription.description}</p>
                        <p>Duration: {subscription.duration}</p>
                        <button onClick={() => handleUnsubscribe(subscription)}>Unsubscribe</button>
                      </div>
                    ))
                  ) : (
                    <p>No subscribed courses.</p>
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
