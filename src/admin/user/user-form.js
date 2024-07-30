import React, { useState, useEffect } from 'react'
import { put } from '../../utils/httpAgent'
import Alert from '../../shared/alert'
import Button from '../../components/button'
import Spinner from '../../components/spinner'
import ControlGroup from '../../components/control-group'
import TextControl from '../../components/text-control'
import SelectControl from '../../components/select-control'

const UserForm = ({
  uid,
  usernameCurrent = '',
  emailCurrent = '',
  rolesCurrent = 'account',
  isActiveCurrent = false
}) => {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(undefined)
  const [hasError, setHasError] = useState({})
  const [help, setHelp] = useState({})
  const [username, setUsername] = useState(usernameCurrent)
  const [email, setEmail] = useState(emailCurrent)
  const [roles, setRoles] = useState(rolesCurrent)
  const [isActive, setIsActive] = useState(isActiveCurrent)

  useEffect(() => {
    setUsername(usernameCurrent)
    setEmail(emailCurrent)
    setRoles(rolesCurrent)
    setIsActive(isActiveCurrent)
  }, [usernameCurrent, emailCurrent, rolesCurrent, isActiveCurrent])

  const handleSubmit = async (event) => {
    event.preventDefault()
    event.stopPropagation()

    setLoading(true)
    setError(undefined)
    setSuccess(false)
    setHasError({})
    setHelp({})

    try {
      const response = await put(`/1/admin/user/${uid}`, {
        username,
        email,
        roles,
        isActive
      })

      if (response.success === true) {
        setSuccess(true)
        setError('')
        setHasError({})
      } else {
        const state = {
          success: false,
          error: '',
          hasError: {},
          help: {}
        }

        for (const key in response.errfor) {
          state.hasError[key] = true
          state.help[key] = response.errfor[key]
        }

        if (response.errors[0] !== undefined) {
          state.error = response.errors[0]
        }

        setHasError(state.hasError)
        setHelp(state.help)
        setError(state.error)
      }
    } catch (error) {
      console.error(error)
      setError('出現錯誤，請稍後再試。')
    } finally {
      setLoading(false)
    }
  }

  let alerts = []

  if (success) {
    alerts = <Alert type='success' message='帳號資料更新成功' />
  } else if (error) {
    alerts = <Alert type='danger' message={error} />
  }

  return (
    <form onSubmit={handleSubmit}>
      <legend>帳號資料</legend>
      {alerts}
      <TextControl
        name='username'
        label='帳號'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        hasError={hasError.username}
        help={help.username}
        disabled={loading}
      />
      <TextControl
        name='email'
        label='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        hasError={hasError.email}
        help={help.email}
        disabled={loading}
      />
      <SelectControl
        name='roles'
        label='權限'
        value={roles}
        onChange={(e) => setRoles(e.target.value)}
        hasError={hasError.roles}
        help={help.roles}
        disabled={loading}
      >
        <option value='account'>一般</option>
        <option value='admin'>管理者</option>
      </SelectControl>
      <SelectControl
        name='isActive'
        label='是否啟用'
        value={isActive}
        onChange={(e) => setIsActive(e.target.value)}
        hasError={hasError.isActive}
        help={help.isActive}
        disabled={loading}
      >
        <option value>啟用</option>
        <option value={false}>關閉</option>
      </SelectControl>
      <ControlGroup hideLabel hideHelp>
        <Button
          type='submit'
          inputClasses={{ 'btn-primary': true }}
          disabled={loading}
        >
          更新
          <Spinner space='left' show={loading} />
        </Button>
      </ControlGroup>
    </form>
  )
}

export default UserForm
