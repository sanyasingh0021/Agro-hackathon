import React, { useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import MapChart from './MapChart';
import MapModal from './MapModal';
import AutoCompleteLocation from './AutoCompleteLocation';

import './AreaSelector.css';

const AreaSelector = () => {
    const [content, setContent] = useState("");
    const [STName, setSTName] = useState("");
    const [show, setShow] = useState(false);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const history = useHistory();

    const handleClose = () => setShow(false);

    const getLocationHandle = () => {
        console.log(navigator.geolocation)
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
            }, () => {
                console.log("Geolocation service failed.");
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    };

    const handleSubmit = () => {
        console.log("Handle submit")
        if (latitude && longitude) {
            history.push(`/shop?lat=${latitude}&lng=${longitude}`);
        } else {
            console.log("Latitude and Longitude must be provided.");
        }
    };

    return (
        <React.Fragment>
            <MapModal show={show} StateName={STName} closeModal={handleClose} />

            <Container className="map-container">
                <Row>
                    <Col sm={true}>
                        <Container className="area-selector-div">
                            <Row className="area-label">
                                <h3>Select your Area</h3>
                            </Row>
                            <div className="center">
                                <AutoCompleteLocation
                                    setLatitude={setLatitude}
                                    setLongitude={setLongitude}
                                />
                            </div>
                            <div className="center">
                                <button className="geolocation-button" onClick={getLocationHandle}>
                                    <p style={{ marginBottom: "5px" }}>
                                        <i className="fas fa-map-marker-alt"></i>
                                        &nbsp; Get current Location
                                    </p>
                                    <p style={{ color: "grey" }}>using GPS</p>
                                </button>
                            </div>
                            <div className="center">
                                <Button onClick={handleSubmit}>
                                    Submit
                                </Button>
                            </div>
                        </Container>
                    </Col>
                    <Col sm={true}>
                        <div className="map-chart">
                            <MapChart setTooltipContent={setContent} setStateName={setSTName} setShowDistrict={setShow} />
                            <ReactTooltip>{content}</ReactTooltip>
                        </div>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    );
}

export default AreaSelector;
