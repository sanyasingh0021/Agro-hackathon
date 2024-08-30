import React, { useState } from 'react';
import bg_1 from '../images/bg_1.jpg';
import bg_2 from '../images/bg_2.jpg';
import bg_3 from '../images/bg_3.jpg';

import { Carousel } from 'react-bootstrap';

const ControlledCarousel = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(null);

  const handleSelect = (selectedIndex, event) => {
    console.log('Selected Index:', selectedIndex);
    console.log('Event:', event);

    setIndex(selectedIndex);

    if (event && event.direction) {
      console.log('Direction:', event.direction);
      setDirection(event.direction);
    } else {
      console.log('Direction is undefined');
    }
  };

  return (
    <Carousel activeIndex={index} direction={direction} onSelect={handleSelect}>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={bg_1}
          alt="First slide"
        />
        <Carousel.Caption>
          <h3>Freshest Products</h3>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={bg_2}
          alt="Second slide"
        />

        <Carousel.Caption>
          <h3>From your local farmers</h3>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={bg_3}
          alt="Third slide"
        />

        <Carousel.Caption>
          <h3>At the best prices available</h3>

        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default ControlledCarousel;
