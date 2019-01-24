import React, { Component } from 'react'
import ClassNames from 'classnames'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

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
    const navBarCollapse = ClassNames({
      'navbar-collapse': true,
      collapse: !this.state.navBarOpen
    })

    return (
      <div>
        <div className='navbar navbar-default navbar-fixed-top'>
          <div className='container'>
            <div className='navbar-header'>
              <Link className='navbar-brand' to='/'>
                <img className='navbar-logo' src='/media/logo-square.png' alt='' />
                <span className='navbar-brand-label'>Huayra</span>
              </Link>
              <button className='navbar-toggle collapsed' onClick={this.toggleMenu.bind(this)}>
                <span className='icon-bar' />
                <span className='icon-bar' />
                <span className='icon-bar' />
              </button>
            </div>
            <div className={navBarCollapse}>
              <ul className='nav navbar-nav'>
                <li className={this.tabClass('/account')}>
                  <Link to='/account'> 首頁
                  </Link>
                </li>
                <li className={this.tabClass('/account/setting')}>
                  <Link to='/account/setting'> 設定
                  </Link>
                </li>
              </ul>
              <ul className='nav navbar-nav navbar-right'>
                <li>
                  <Link to='/logout'> 登出
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div>
          {this.props.children}
        </div>
        <div className='footer'>
          <div className='container'>
            <span className='copyright pull-right'>© {year} Makee</span>
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
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.index.user,
  authenticated: state.index.authenticated
})

export default connect(mapStateToProps, null)(Default)
