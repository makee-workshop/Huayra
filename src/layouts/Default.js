import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { Navbar, Collapse, Nav, NavItem, NavbarText, NavbarToggler, Container } from 'reactstrap'
import config from '../config'

const Default = (props) => {
  const [navBarOpen, setNavBarOpen] = useState(false)

  const toggleMenu = () => {
    setNavBarOpen(!navBarOpen)
  }

  let roleElement = []
  let signupElement = []

  if (props.authenticated === true) {
    roleElement = (
      <NavLink to='/account'>
        <i className='lnr lnr-user' />
        {props.user}
      </NavLink>
    )

    if (props.role === 'admin') {
      roleElement = (
        <NavLink to='/admin'>
          <i className='lnr lnr-user' />
          {props.user}
        </NavLink>
      )
    }
  } else {
    signupElement = (
      <NavItem>
        <NavLink to='/signup' activeClassName='active' className='nav-link'>
          註冊
        </NavLink>
      </NavItem>
    )
    roleElement = (
      <NavLink to='/login'>
        登入
      </NavLink>
    )
  }

  return (
    <div>
      <Navbar color='light' light expand='md' className='fixed-top'>
        <Container>
          <Link to='/' className='navbar-brand'>
            <img className='navbar-logo' src='/media/logo-square.png' alt='' />
            <span className='navbar-brand-label'>{config.projectName}</span>
          </Link>
          <NavbarToggler onClick={toggleMenu} />
          <Collapse isOpen={!navBarOpen} navbar>
            <Nav className='mr-auto' navbar>
              <NavItem>
                <NavLink exact to='/' activeClassName='active' className='nav-link'>
                  首頁
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink exact to='/about' activeClassName='active' className='nav-link'>
                  關於我們
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink exact to='/contact' activeClassName='active' className='nav-link'>
                  連絡我們
                </NavLink>
              </NavItem>
              {signupElement}
            </Nav>
          </Collapse>
          <NavbarText>
            {roleElement}
          </NavbarText>
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
              <Link to='/contact'> 連絡我們
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
  authenticated: state.index.authenticated,
  role: state.index.role
})

export default connect(mapStateToProps, null)(Default)
