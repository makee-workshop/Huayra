import React, { useState, useEffect } from 'react'
import { get, put } from '../utils/httpAgent'
import Alert from '../shared/alert'
import Button from '../components/button'
import Spinner from '../components/spinner'
import ControlGroup from '../components/control-group'
import TextControl from '../components/text-control'

const DetailsForm = () => {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(undefined)
  const [hasError, setHasError] = useState({})
  const [help, setHelp] = useState({})
  const [last, setLast] = useState('')
  const [first, setFirst] = useState('')
  const [company, setCompany] = useState('')
  const [phone, setPhone] = useState('')
  const [zip, setZip] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    get('/1/account').then((response) => {
      if (response.data) {
        setLast(response.data.name.last)
        setFirst(response.data.name.first)
        setCompany(response.data.company)
        setPhone(response.data.phone)
        setZip(response.data.zip)
      }
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    event.stopPropagation()

    setLoading(true)

    put('/1/account/settings/', {
      last,
      first,
      company,
      phone,
      zip
    }).then((response) => {
      if (response.success === true) {
        setSuccess(true)
        setError('')
        setLoading(false)
        setHasError({})
      } else {
        const newHasError = {}
        const newHelp = {}
        for (const key in response.errfor) {
          newHasError[key] = true
          newHelp[key] = response.errfor[key]
        }

        if (response.errors[0] !== undefined) {
          setError(response.errors[0])
        }
        setSuccess(false)
        setLoading(false)
        setHasError(newHasError)
        setHelp(newHelp)
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
      <fieldset>
        <legend>個人資料</legend>
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
          <Button type='submit' inputClasses={{ 'btn-primary': true }} disabled={loading}>
            更新
            <Spinner space='left' show={loading} />
          </Button>
        </ControlGroup>
      </fieldset>
    </form>
  )
}

export default DetailsForm
