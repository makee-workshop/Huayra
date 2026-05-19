import React, { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Navbar, Collapse, Nav, NavItem, NavbarToggler, Container } from 'reactstrap'
import config from '../config'

const navLinkClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`

const Admin = () => {
  const [navBarOpen, setNavBarOpen] = useState(false)

  const toggleMenu = () => setNavBarOpen(prev => !prev)

  return (
    <div>
      <Navbar color='dark' dark expand='md' className='fixed-top' container={false}>
        <Container>
          <Link to='/admin' className='navbar-brand'>
            <img className='navbar-logo' src='/media/logo-square.png' alt='' />
            <span className='navbar-brand-label'>{config.projectName}</span>
          </Link>
          <NavbarToggler onClick={toggleMenu} />
          <Collapse isOpen={navBarOpen} navbar>
            <Nav className='me-auto' navbar>
              <NavItem>
                <NavLink to='/admin' end className={navLinkClass}>首頁</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to='/admin/users' className={navLinkClass}>用戶管理</NavLink>
              </NavItem>
            </Nav>
            <Nav className='ms-auto' navbar>
              <NavItem>
                <NavLink to='/logout' className='nav-link'>登出</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Container>
      </Navbar>

      <Outlet />

      <div className='footer'>
        <Container>
          <span className='copyright float-end'>© {new Date().getFullYear()} {config.companyName}</span>
          <ul className='links'>
            <li><Link to='/'>首頁</Link></li>
            <li><Link to='/logout'>登出</Link></li>
          </ul>
          <div className='clearfix' />
        </Container>
      </div>
    </div>
  )
}

export default Admin
