import React, { useEffect, useState } from 'react';
import CourseItem from './CourseItem';
const CourseList = ({ onSubscribe }) => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch('/api/courses') // Assuming your API for courses
      .then((res) => res.json())
      .then((data) => setCourses(data));
  }, []);

  return (
    <div>
      <h2>Available Courses</h2>
      <div className="course-list">
        {courses.map((course) => (
          <CourseItem key={course.id} course={course} onSubscribe={onSubscribe} />
        ))}
      </div>
    </div>
  );
};

export default CourseList;
