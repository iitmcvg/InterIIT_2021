import React, { useState } from 'react';
import {Divider} from '@material-ui/core'
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    NavLink,
    NavItem,
    Nav
} from 'reactstrap';

const NavBar = (props) => {
    const [isOpen, setIsOpen] = useState(false)
    const toggle = () => setIsOpen(!isOpen);
    const list = () => {
        return([
            {path:"/auth", name:"Token"}
        ]);
    }
    return(
        <div style={{
            fontFamily:'Riona Sans,sans-serif',
            fontWeight: 'bolder',
            fontStyle: 'italic',
            backgroundColor: '#047BD5',
        }}>
            <Navbar style={{backgroundColor:'inherit'}} light expand="md">
                <NavbarBrand href="/" style={{color: 'white'}}>Inter-IIT Tech Meet 9.0</NavbarBrand>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="ml-auto" navbar>
                            {
                                list().map((data,key)=>(
                                    <NavItem className="ml-auto" key={key} style={{marginLeft:'10px'}}>
                                        <NavLink href={data.path} style={{color: 'white'}}>{data.name}</NavLink>
                                    </NavItem>
                                ))
                            }
                    </Nav>
                </Collapse>
            </Navbar>
            <Divider style={{backgroundColor:'black'}}></Divider>
        </div>
    )
}

export default NavBar;