import React from 'react';

const MyCourses = ({ subscribedCourses, onUnsubscribe }) => {
  return (
    <div>
      <h2>My Courses</h2>
      <ul>
        {subscribedCourses.length > 0 ? (
          subscribedCourses.map((course) => (
            <li key={course.id}>
              {course.title}
              <button onClick={() => onUnsubscribe(course)}>Unsubscribe</button>
            </li>
          ))
        ) : (
          <p>No subscribed courses yet.</p>
        )}
      </ul>
    </div>
  );
};

export default MyCourses;
