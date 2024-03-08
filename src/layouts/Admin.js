import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  Navbar,
  Collapse,
  Nav,
  NavItem,
  NavbarText,
  NavbarToggler,
  Container
} from 'reactstrap'
import config from '../config'

const Admin = (props) => {
  const [navBarOpen, setNavBarOpen] = useState(false)

  const toggleMenu = () => {
    setNavBarOpen(!navBarOpen)
  }

  return (
    <div>
      <Navbar color='dark' dark expand='md' className='fixed-top'>
        <Container>
          <Link to='/admin' className='navbar-brand'>
            <img className='navbar-logo' src='/media/logo-square.png' alt='' />
            <span className='navbar-brand-label'>{config.projectName}</span>
          </Link>
          <NavbarToggler onClick={toggleMenu} />
          <Collapse isOpen={!navBarOpen} navbar>
            <Nav className='mr-auto' navbar>
              <NavItem>
                <NavLink exact to='/admin' activeClassName='active' className='nav-link'>
                  首頁
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to='/admin/users' activeClassName='active' className='nav-link'>
                  用戶管理
                </NavLink>
              </NavItem>
            </Nav>
            <NavbarText>
              <NavLink to='/logout'>
                登出
              </NavLink>
            </NavbarText>
          </Collapse>
        </Container>
      </Navbar>

      {props.children}

      <div className='footer'>
        <Container>
          <span className='copyright float-right'>© {new Date().getFullYear()} {config.companyName}</span>
          <ul className='links'>
            <li>
              <Link to='/'> 首頁
              </Link>
            </li>
            <li>
              <Link to='/logout'> 登出
              </Link>
            </li>
          </ul>
          <div className='clearfix' />
        </Container>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  user: state.index.user,
  authenticated: state.index.authenticated
})

export default connect(mapStateToProps, null)(Admin)
