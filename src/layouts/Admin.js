import React, { Component } from 'react'
import ClassNames from 'classnames'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

const year = new Date().getFullYear()

class Default extends Component {
  tabClass(tab) {

    return ClassNames({
      active: this.props.activeTab === tab
    })
  }

  render() {
    return (
      <div>
        <div className="navbar navbar-default navbar-fixed-top">
          <div className="container">
            <div className="navbar-header">
              <Link className="navbar-brand" to="/">
                <img className="navbar-logo" src="/media/logo-square.png" alt=""/>
                <span className="navbar-brand-label">Huayra</span>
              </Link>
            </div>
            <div className="navbar-collapse collapse">
              <ul className="nav navbar-nav">
                <li className={this.tabClass('home')}>
                  <Link to="/admin" >首頁</Link>
                </li>
                <li className={this.tabClass('about')}>
                  <Link to="/admin/users" >用戶管理</Link>
                </li>
              </ul>
              <ul className="nav navbar-nav navbar-right">
                <li>
                  <Link to="/logout" >登出</Link>
                </li>
              </ul>
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
              <li><Link to="/logout" >登出</Link></li>
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