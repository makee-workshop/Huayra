import React, { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Navbar, Collapse, Nav, NavItem, NavbarToggler, Container } from 'reactstrap'
import config from '../config'

// v6: NavLink className 接受函式，({ isActive }) 取代舊版 activeClassName prop
const navLinkClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`

const Default = () => {
  const [navBarOpen, setNavBarOpen] = useState(false)
  const authenticated = useSelector(state => state.index.authenticated)
  const user = useSelector(state => state.index.user)
  const role = useSelector(state => state.index.role)

  const toggleMenu = () => setNavBarOpen(prev => !prev)

  let roleElement
  let signupElement = null

  if (authenticated) {
    const accountPath = role === 'admin' ? '/admin' : '/account'
    roleElement = (
      <NavItem>
        <NavLink to={accountPath} className={navLinkClass}>
          <i className='lnr lnr-user' />
          {user}
        </NavLink>
      </NavItem>
    )
  } else {
    signupElement = (
      <NavItem>
        <NavLink to='/signup' className={navLinkClass}>註冊</NavLink>
      </NavItem>
    )
    roleElement = (
      <NavItem>
        <NavLink to='/login' className={navLinkClass}>登入</NavLink>
      </NavItem>
    )
  }

  return (
    <div>
      <Navbar color='light' light expand='md' className='fixed-top' container={false}>
        <Container>
          <Link to='/' className='navbar-brand'>
            <img className='navbar-logo' src='/media/logo-square.png' alt='' />
            <span className='navbar-brand-label'>{config.projectName}</span>
          </Link>
          <NavbarToggler onClick={toggleMenu} />
          <Collapse isOpen={navBarOpen} navbar>
            <Nav className='me-auto' navbar>
              <NavItem>
                {/* end prop 等同 v5 的 exact */}
                <NavLink to='/' end className={navLinkClass}>首頁</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to='/about' end className={navLinkClass}>關於我們</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to='/contact' end className={navLinkClass}>連絡我們</NavLink>
              </NavItem>
              {signupElement}
            </Nav>
            <Nav className='ms-auto' navbar>
              {roleElement}
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
            <li><Link to='/contact'>連絡我們</Link></li>
          </ul>
          <div className='clearfix' />
        </Container>
      </div>
    </div>
  )
}

export default Default
