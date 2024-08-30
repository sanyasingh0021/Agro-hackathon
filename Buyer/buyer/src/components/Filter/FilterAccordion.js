import React, { useState, useEffect } from 'react';
import Accordion from './Accordion';
import { Button, Form, InputGroup } from 'react-bootstrap';
import axios from 'axios'; // Assuming you use axios for HTTP requests

import './Accordion.css';

const FilterAccordion = ({ lat, lng, onDistanceChange, onPriceChange }) => {
    const [price, setPrice] = useState(999);
    const [distance, setDistance] = useState(10000);

    // Handle price change and notify parent component
    const handlePriceChange = (event) => {
        const newPrice = event.target.value;
        setPrice(newPrice);

        if (onPriceChange) {
            onPriceChange(newPrice); // Notify parent component
        }
    };

    // Handle distance change and notify parent component
    const handleDistanceChange = (event) => {
        const newDistance = event.target.value;
        setDistance(newDistance);

        if (onDistanceChange) {
            onDistanceChange(newDistance); // Notify parent component
        }
    };

    // Effect to fetch products based on distance
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`https://backend-cayg.onrender.com/api/products?lat=${lat}&lng=${lng}&dist=${distance}`);
                console.log('Fetched products:', response.data);
                // Handle the response here or update local state if needed
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [distance, lat, lng]); // Depend on distance, lat, and lng

    return (
        <div>
            <div className="clear-filter-div">
                <Button variant="outline-success">CLEAR ALL</Button>
            </div>
            <Accordion title="Price">
                <Form>
                    <Form.Group controlId="formPriceRange">
                        <Form.Label>Price (Up to {price} rupees)</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="range"
                                min="1"
                                max="999"
                                value={price}
                                onChange={handlePriceChange}
                            />
                        </InputGroup>
                    </Form.Group>
                </Form>
            </Accordion>
            <Accordion title="Location">
                <Form>
                    <Form.Group controlId="formDistanceRange">
                        <Form.Label>Distance (Up to {distance} km)</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="range"
                                min="0"
                                max="10000"
                                value={distance}
                                onChange={handleDistanceChange}
                            />
                        </InputGroup>
                    </Form.Group>
                </Form>
            </Accordion>
        </div>
    );
};

export default FilterAccordion;
