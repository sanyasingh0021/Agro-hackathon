import React, { useState, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import FilterSidediv from '../Filter/FilterSidediv';
import AllProducts from './AllProducts';
import SearchBar from './SearchBar';
import { ShopContext } from '../Context/shop-context';

const Shop = () => {
    const [maxDistance, setMaxDistance] = useState(10000);
    const [maxPrice, setMaxPrice] = useState(999);

    const handleDistanceChange = (distance) => {
        console.log("Handle distance change");
        setMaxDistance(distance);
        console.log("Shop", distance);
    };

    const handlePriceChange = (price) => {
        console.log("Handle price change");
        setMaxPrice(price);
        console.log("Shop", price);
    };

    const shopContext = useContext(ShopContext);
    const handleInput = (e) => {
        console.log("handle input");
        shopContext.searched(e.target.value);
    };

    return (
        <React.Fragment>
            <Container className="shopping-content">
                <Row>
                    <Col xl={3} lg={3} md={3} className="filter-sidebar">
                        <FilterSidediv
                            onDistanceChange={handleDistanceChange}
                            onPriceChange={handlePriceChange}
                        />
                    </Col>
                    <Col>
                        <SearchBar handleInput={handleInput} />
                        <AllProducts maxDistance={maxDistance} maxPrice={maxPrice} />
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    );
};

export default Shop;
