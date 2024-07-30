import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Container, Row, Col } from 'reactstrap'
import { useParams } from 'react-router-dom'
import { get } from '../../utils/httpAgent'
import DetailsForm from './details-form'
import UserForm from './user-form'
import PasswordForm from './password-form'

const UserSettingsPage = () => {
  const { aid, uid } = useParams()
  const [last, setLast] = useState('')
  const [first, setFirst] = useState('')
  const [company, setCompany] = useState('')
  const [phone, setPhone] = useState('')
  const [zip, setZip] = useState('')
  const [roles, setRoles] = useState('account')
  const [isActive, setIsActive] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const response = await get(`/1/admin/account/${aid}`)
        if (response.success && response.data) {
          setLast(response.data.name.last)
          setFirst(response.data.name.first)
          setCompany(response.data.company)
          setPhone(response.data.phone)
          setZip(response.data.zip)
        }
      } catch (error) {
        console.error(error)
      }
    }

    const fetchUserData = async () => {
      try {
        const response = await get(`/1/admin/user/${uid}`)
        if (response.success && response.data) {
          setUsername(response.data.username)
          setEmail(response.data.email)
          setRoles(response.data.roles.admin ? 'admin' : 'account')
          setIsActive(response.data.isActive)
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchAccountData()
    fetchUserData()
  }, [])

  return (
    <Container>
      <Helmet>
        <title>{username} 帳號設定</title>
      </Helmet>

      <h1 className='page-header'>{username} 帳號設定</h1>
      <Row>
        <Col sm={6}>
          <DetailsForm
            aid={aid}
            lastCurrent={last}
            firstCurrent={first}
            companyCurrent={company}
            phoneCurrent={phone}
            zipCurrent={zip}
          />
          <UserForm
            uid={uid}
            usernameCurrent={username}
            emailCurrent={email}
            rolesCurrent={roles}
            isActiveCurrent={isActive}
          />
          <PasswordForm uid={uid} />
        </Col>
      </Row>
    </Container>
  )
}

export default UserSettingsPage
