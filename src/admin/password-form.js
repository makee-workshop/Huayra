import React, { useState, useRef } from 'react'
import { put } from '../utils/httpAgent'
import Alert from '../shared/alert'
import Button from '../components/button'
import Spinner from '../components/spinner'
import ControlGroup from '../components/control-group'
import TextControl from '../components/text-control'

const PasswordForm = ({ uid, loading }) => {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(undefined)
  const [hasError, setHasError] = useState({})
  const [help, setHelp] = useState({})

  const newPasswordInput = useRef(null)
  const confirmInput = useRef(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    event.stopPropagation()

    setError(undefined)
    setSuccess(false)
    setHasError({})
    setHelp({})

    try {
      const response = await put(`/1/admin/user/${uid}/password`, {
        newPassword: newPasswordInput.current.value(),
        confirm: confirmInput.current.value()
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
    }
  }

  let alerts = []

  if (success) {
    alerts = <Alert type='success' message='密碼更新成功' />
  } else if (error) {
    alerts = <Alert type='danger' message={error} />
  }

  return (
    <form onSubmit={handleSubmit}>
      <legend>重設密碼</legend>
      {alerts}
      <TextControl
        ref={newPasswordInput}
        name='newPassword'
        label='新密碼'
        type='password'
        hasError={hasError.newPassword}
        help={help.newPassword}
        disabled={loading}
      />
      <TextControl
        ref={confirmInput}
        name='confirm'
        label='再次輸入新密碼'
        type='password'
        hasError={hasError.confirm}
        help={help.confirm}
        disabled={loading}
      />
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

export default PasswordForm
