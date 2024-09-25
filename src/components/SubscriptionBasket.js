import React from 'react';
import { useDrop } from 'react-dnd';

const SubscriptionBasket = ({ onDropCourse }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'course',
    drop: (course) => onDropCourse(course),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div ref={drop} className={`subscription-basket ${isOver ? 'hovered' : ''}`}>
      <h2>Subscription Basket</h2>
      <p>Drop courses here to subscribe</p>
    </div>
  );
};

export default SubscriptionBasket;
