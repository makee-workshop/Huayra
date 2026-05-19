import React from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import Store from './utils/reducer'
import DefaultLayout from './layouts/Default'
import AdminLayout from './layouts/Admin'
import AccountLayout from './layouts/Account'
import Home from './home/home'
import About from './home/about'
import Contact from './home/contact'
import Login from './login/login'
import Forgot from './login/forgot'
import Logout from './login/logout'
import Reset from './login/reset'
import SignupPage from './login/signup'
import Admin from './admin/home'
import AdminUsers from './admin/user'
import AdminSignup from './admin/signup'
import AdminUserSetting from './admin/user/edit'
import Account from './account/home'
import Setting from './account/setting'
import NotFoundPage from './NotFoundPage'
import { requireAdminAuth } from './utils/requireAdminAuth'
import { requireAuthentication } from './utils/requireAuthentication'
import { requireWeakAuth } from './utils/requireWeakAuth'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

// 在模組頂層預先建立 HOC 包裝版本，避免在 render 中動態建立導致元件重新掛載
const WeakHome = requireWeakAuth(Home)
const WeakAbout = requireWeakAuth(About)
const WeakContact = requireWeakAuth(Contact)
const WeakLogin = requireWeakAuth(Login)
const WeakForgot = requireWeakAuth(Forgot)
const WeakReset = requireWeakAuth(Reset)
const WeakSignup = requireWeakAuth(SignupPage)
const WeakNotFound = requireWeakAuth(NotFoundPage)
const AuthAccount = requireAuthentication(Account)
const AuthSetting = requireAuthentication(Setting)
const AdminHome = requireAdminAuth(Admin)
const AdminUsersPage = requireAdminAuth(AdminUsers)
const AdminSignupPage = requireAdminAuth(AdminSignup)
const AdminUserSettingPage = requireAdminAuth(AdminUserSetting)

const App = () => (
  <BrowserRouter>
    <Provider store={Store}>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route index element={<WeakHome />} />
          <Route path='about' element={<WeakAbout />} />
          <Route path='contact' element={<WeakContact />} />
          <Route path='login' element={<WeakLogin />} />
          <Route path='login/forgot' element={<WeakForgot />} />
          <Route path='login/reset/:email/:key' element={<WeakReset />} />
          <Route path='signup' element={<WeakSignup />} />
          <Route path='*' element={<WeakNotFound />} />
        </Route>

        <Route element={<AccountLayout />}>
          <Route path='account' element={<AuthAccount />} />
          <Route path='account/setting' element={<AuthSetting />} />
          <Route path='logout' element={<Logout />} />
        </Route>

        <Route element={<AdminLayout />}>
          <Route path='admin' element={<AdminHome />} />
          <Route path='admin/users' element={<AdminUsersPage />} />
          <Route path='admin/signup' element={<AdminSignupPage />} />
          <Route path='admin/user/:uid/:aid' element={<AdminUserSettingPage />} />
        </Route>
      </Routes>
    </Provider>
  </BrowserRouter>
)

export default App
