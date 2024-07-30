import React, { useState, useEffect } from 'react'
import { put } from '../../utils/httpAgent'
import Alert from '../../shared/alert'
import Button from '../../components/button'
import Spinner from '../../components/spinner'
import ControlGroup from '../../components/control-group'
import TextControl from '../../components/text-control'

const DetailsForm = ({
  aid,
  lastCurrent,
  firstCurrent,
  companyCurrent,
  phoneCurrent,
  zipCurrent
}) => {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(undefined)
  const [hasError, setHasError] = useState({})
  const [help, setHelp] = useState({})
  const [last, setLast] = useState(lastCurrent)
  const [first, setFirst] = useState(firstCurrent)
  const [company, setCompany] = useState(companyCurrent)
  const [phone, setPhone] = useState(phoneCurrent)
  const [zip, setZip] = useState(zipCurrent)

  useEffect(() => {
    setLast(lastCurrent)
    setFirst(firstCurrent)
    setCompany(companyCurrent)
    setPhone(phoneCurrent)
    setZip(zipCurrent)
  }, [
    lastCurrent,
    firstCurrent,
    companyCurrent,
    phoneCurrent,
    zipCurrent
  ])

  const handleSubmit = (event) => {
    event.preventDefault()
    event.stopPropagation()

    setLoading(true)

    put(`/1/admin/account/${aid}`, {
      last,
      first,
      company,
      phone,
      zip
    }).then((response) => {
      setLoading(false)
      if (response.success === true) {
        setSuccess(true)
        setError('')
        setHasError({})
      } else {
        let error = ''
        const hasError = {}
        const help = {}

        for (const key in response.errfor) {
          hasError[key] = true
          help[key] = response.errfor[key]
        }

        if (response.errors[0] !== undefined) {
          error = response.errors[0]
        }

        setSuccess(false)
        setHasError(hasError)
        setHelp(help)
        setError(error)
      }
    })
  } // end handleSubmit

  let alerts = []

  if (success) {
    alerts = <Alert type='success' message='個人資料更新成功' />
  } else if (error) {
    alerts = <Alert type='danger' message={error} />
  }

  return (
    <form onSubmit={handleSubmit}>
      <legend> 個人資料 </legend>
      {alerts}
      <TextControl
        name='last'
        label='姓氏'
        value={last}
        onChange={(e) => setLast(e.target.value)}
        hasError={hasError.last}
        help={help.last}
        disabled={loading}
      />
      <TextControl
        name='first'
        label='名字'
        value={first}
        onChange={(e) => setFirst(e.target.value)}
        hasError={hasError.first}
        help={help.first}
        disabled={loading}
      />
      <TextControl
        name='company'
        label='公司'
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        hasError={hasError.company}
        help={help.company}
        disabled={loading}
      />
      <TextControl
        name='phone'
        label='電話'
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        hasError={hasError.phone}
        help={help.phone}
        disabled={loading}
      />
      <TextControl
        name='zip'
        label='郵遞區號'
        value={zip}
        onChange={(e) => setZip(e.target.value)}
        hasError={hasError.zip}
        help={help.zip}
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

export default DetailsForm
