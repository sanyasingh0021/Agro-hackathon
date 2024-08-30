import React, { useState, useEffect } from 'react';
import FilterAccordion from './FilterAccordion';

const FilterSidediv = ({ onDistanceChange, onPriceChange }) => {
    const [distance, setDistance] = useState(1000);

    const handleDistanceChange = (newDistance) => {
        setDistance(newDistance);
        if (onDistanceChange) {
            onDistanceChange(newDistance); // Notify the parent about the distance change
        }
    };

    // This useEffect is used to call the `onDistanceChange` prop with the initial distance value
    useEffect(() => {
        if (onDistanceChange) {
            onDistanceChange(distance);
        }
    }, [distance, onDistanceChange]);

    return (
        <React.Fragment>
            <div style={{ fontWeight: 300, fontSize: '19px', padding: '10px 0 10px 10px', color: '#555b54', display: 'block', fontFamily: 'Tahoma, Geneva, sans-serif' }}>
                FILTER
            </div>
            <hr style={{ marginTop: '2px', marginBottom: '5px' }}></hr>
            <FilterAccordion
                onDistanceChange={handleDistanceChange}
                onPriceChange={onPriceChange} // Pass the price change handler
            />
        </React.Fragment>
    );
};

export default FilterSidediv;
