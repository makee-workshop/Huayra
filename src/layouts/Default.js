import React, { Component } from 'react'
import ClassNames from 'classnames'
import { Link, NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { Navbar, Collapse, Nav, NavItem, NavbarText, NavbarToggler, Container } from 'reactstrap'
import config from '../config'

const year = new Date().getFullYear()

class Default extends Component {
  constructor (props) {
    super(props)
    this.state = {
      navBarOpen: false
    }
  }

  compomentDidUpdate () {
    this.setState({ navBarOpen: false })
  }

  tabClass (tab) {
    return ClassNames({
      active: this.props.children.props.location.pathname === tab
    })
  }

  toggleMenu () {
    this.setState({ navBarOpen: !this.state.navBarOpen })
  }

  render () {
    let roleElement = []
    let signupElement = []

    if (this.props.authenticated === true) {
      roleElement =
        <NavLink to='/account'>
          <i className='lnr lnr-user' />
          {this.props.user}
        </NavLink>

      if (this.props.role === 'admin') {
        roleElement =
          <NavLink to='/admin' >
            <i className='lnr lnr-user' />
            {this.props.user}
          </NavLink>
      }
    } else {
      signupElement =
        <NavItem>
          <NavLink to='/signup' activeClassName='active' className='nav-link'>
            註冊
          </NavLink>
        </NavItem>
      roleElement =
        <NavLink to='/login'>
          登入
        </NavLink>
    }

    return (
      <div>
        <Navbar color='light' light expand='md' className='fixed-top'>
          <Container>
            <Link to='/' className='navbar-brand'>
              <img className='navbar-logo' src='/media/logo-square.png' alt='' />
              <span className='navbar-brand-label'>{config.projectName}</span>
            </Link>
            <NavbarToggler onClick={this.toggleMenu.bind(this)} />
            <Collapse isOpen={!this.state.navBarOpen} navbar>
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

        {this.props.children}

        <div className='footer'>
          <Container>
            <span className='copyright float-right'>© {year} {config.companyName}</span>
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
}

const mapStateToProps = state => ({
  user: state.index.user,
  authenticated: state.index.authenticated,
  role: state.index.role
})

export default connect(mapStateToProps, null)(Default)
