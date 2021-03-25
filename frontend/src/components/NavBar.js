import React, { useState } from 'react';
import { Divider } from '@material-ui/core';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  NavLink,
  NavItem,
  Nav,
} from 'reactstrap';

const NavBar = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const list = () => {
    return [
      { path: '/augment', name: 'AUGMENT' },
      { path: '/train', name: 'TRAIN' },
      { path: '/inference', name: 'INFERENCE' },
      { path: '/results', name: 'RESULTS' },
    ];
  };
  return (
    <div
      style={{
        fontFamily: 'Proxima Bold,sans-serif',
      }}
    >
      <Navbar style={{ backgroundColor: 'inherit' }} light expand='md'>
        <NavbarBrand href='/' style={{ color: '#E00420' }}>
          INTER - IIT TECH MEET 9.0
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className='ml-auto' navbar>
            {list().map((data, key) => (
              <NavItem
                className='ml-auto'
                key={key}
                style={{ marginLeft: '10px' }}
              >
                <NavLink href={data.path} style={{ color: '#E00420' }}>
                  {data.name}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
        </Collapse>
      </Navbar>
      <Divider style={{ backgroundColor: 'black' }}></Divider>
    </div>
  );
};

export default NavBar;
