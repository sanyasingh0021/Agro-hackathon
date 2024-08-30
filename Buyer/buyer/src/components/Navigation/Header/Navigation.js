import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

// import { Form, FormControl, Button } from 'react-bootstrap';

import NavLinks from './NavLinks';
import logo from '../../images/sprout.png';

import './Navigation.css';

const Navigation = props => {
    return (
        <Navbar className="header-nav" sticky="top" expand="lg">
            <Navbar.Brand href="#home">
                <img src={logo} alt="Logo" />
                AgriSeva
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <NavLinks />
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
};

export default Navigation;
