import React, { Component } from 'react'
import Login from './login/login'
import Forgot from './login/forgot'
import Logout from './login/logout'
import Reset from './login/reset'
import SignupPage from './login/signup'
import Store from './utils/reducer'
import Admin from './admin/home'
import AdminUsers from './admin/users'
import AdminUserSetting from './admin/user-setting'
import Account from './account/home'
import Setting from './account/setting'
import { Route, Switch, BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import Home from './home/home'
import About from './home/about'
import Contact from './home/contact'
import DefaultLayout from './layouts/Default'
import AdminLayout from './layouts/Admin'
import AccountLayout from './layouts/Account'
import NotFoundPage from './NotFoundPage'
import { requireAdminAuth } from './utils/requireAdminAuth'
import { requireAuthentication } from './utils/requireAuthentication'
import { requireWeakAuth } from './utils/requireWeakAuth'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-table/react-table.css'
import './App.css'

const AppRoute = ({ component: Component, layout: Layout, ...rest }) => (
  <Route
    {...rest} render={props => (
      <Layout>
        <Component {...props} />
      </Layout>
    )}
  />
)

class App extends Component {
  render () {
    return (
      <BrowserRouter>
        <Provider store={Store}>
          <Switch>
            <AppRoute exact path='/' layout={DefaultLayout} component={requireWeakAuth(Home)} />
            <AppRoute exact path='/about' layout={DefaultLayout} component={requireWeakAuth(About)} />
            <AppRoute exact path='/contact' layout={DefaultLayout} component={requireWeakAuth(Contact)} />
            <AppRoute exact path='/login' layout={DefaultLayout} component={requireWeakAuth(Login)} />
            <AppRoute exact path='/login/forgot' layout={DefaultLayout} component={requireWeakAuth(Forgot)} />
            <AppRoute exact path='/login/reset/:email/:key/' layout={DefaultLayout} component={requireWeakAuth(Reset)} />
            <AppRoute exact path='/signup' layout={DefaultLayout} component={requireWeakAuth(SignupPage)} />
            <AppRoute exact path='/account' layout={AccountLayout} component={requireAuthentication(Account)} />
            <AppRoute exact path='/account/setting' layout={AccountLayout} component={requireAuthentication(Setting)} />
            <AppRoute exact path='/logout' layout={AccountLayout} component={Logout} />
            <AppRoute exact path='/admin' layout={AdminLayout} component={requireAdminAuth(Admin)} />
            <AppRoute exact path='/admin/users' layout={AdminLayout} component={requireAdminAuth(AdminUsers)} />
            <AppRoute exact path='/admin/user/:uid/:aid/:username' layout={AdminLayout} component={requireAdminAuth(AdminUserSetting)} />
            <AppRoute exact layout={DefaultLayout} component={requireWeakAuth(NotFoundPage)} />
          </Switch>
        </Provider>
      </BrowserRouter>
    )
  }
}

export default App
