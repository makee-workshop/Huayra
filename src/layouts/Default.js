import React, { Component } from 'react'
import ClassNames from 'classnames'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

const year = new Date().getFullYear()

class Default extends Component {
  constructor(props) {
    super(props)
    this.state = {
      navBarOpen: false
    }
  }

  componentWillReceiveProps() {
    this.setState({ navBarOpen: false })
  }

  tabClass(tab) {
    return ClassNames({
      active: this.props.children.props.location.pathname === tab
    })
  }

  toggleMenu() {
    this.setState({ navBarOpen: !this.state.navBarOpen })
  }

  render() {
    let roleElement =[]
    let signupElement =[]

    if(this.props.authenticated === true) {
      roleElement = <ul className="nav navbar-nav navbar-right">
                      <li className={this.tabClass('/account')}>
                        <Link to="/account" ><i className="fa fa-user"></i> {this.props.user}</Link>
                      </li>
                    </ul>
    } else {
      signupElement = <li className={this.tabClass('/signup')}>
                        <Link to="/signup" >註冊</Link>
                      </li>
      roleElement = <ul className="nav navbar-nav navbar-right">
                      <li className={this.tabClass('/login')}>
                        <Link to="/login" ><i className="fa fa-user"></i> 登入</Link>
                      </li>
                    </ul>
    }

    const navBarCollapse = ClassNames({
      'navbar-collapse': true,
      collapse: !this.state.navBarOpen
    })

    return (
      <div>
        <div className="navbar navbar-default navbar-fixed-top">
          <div className="container">
            <div className="navbar-header">
              <Link className="navbar-brand" to="/">
                <img className="navbar-logo" src="/media/logo-square.png"  alt=""/>
                <span className="navbar-brand-label">Huayra</span>
              </Link>
              <button
                className="navbar-toggle collapsed"
                onClick={this.toggleMenu.bind(this)}>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
            </button>
            </div>
            <div className={navBarCollapse}>
              <ul className="nav navbar-nav">
                <li className={this.tabClass('/')}>
                  <Link to="/" >首頁</Link>
                </li>
                <li className={this.tabClass('/about')}>
                  <Link to="/about" >關於我們</Link>
                </li>
                {signupElement}
                <li className={this.tabClass('/contact')}>
                  <Link to="/contact" >連絡我們</Link>
                </li>
              </ul>
              {roleElement}
            </div>
          </div>
        </div>
        
        <div>
          {this.props.children}
        </div>

        <div className="footer">
          <div className="container">
            <span className="copyright pull-right">
              &copy; {year} Makee
            </span>
            <ul className="links">
              <li><Link to="/" >首頁</Link></li>
              <li><Link to="/contact" >連絡我們</Link></li>
            </ul>
            <div className="clearfix"></div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.index.user,
  authenticated: state.index.authenticated,
})

export default connect(mapStateToProps, null)(Default)