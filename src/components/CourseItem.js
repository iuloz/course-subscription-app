import React from 'react';

const CourseItem = ({ course, onSubscribe }) => {
  return (
    <div className="course-card">
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      <p>Duration: {course.duration} hours</p>
      <button onClick={() => onSubscribe(course)}>Subscribe</button>
    </div>
  );
};

export default CourseItem;
