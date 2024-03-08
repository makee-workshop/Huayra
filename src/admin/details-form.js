import React, { useState, useEffect } from 'react'
import { get, put } from '../utils/httpAgent'
import Alert from '../shared/alert'
import Button from '../components/button'
import Spinner from '../components/spinner'
import ControlGroup from '../components/control-group'
import TextControl from '../components/text-control'

const DetailsForm = ({ aid }) => {
  const [formData, setFormData] = useState({
    loading: false,
    success: false,
    error: undefined,
    hasError: {},
    help: {},
    last: '',
    first: '',
    company: '',
    phone: '',
    zip: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    get(`/1/admin/account/${aid}`).then((response) => {
      setFormData({
        ...formData,
        last: response.data.name.last,
        first: response.data.name.first,
        company: response.data.company,
        phone: response.data.phone,
        zip: response.data.zip
      })
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    event.stopPropagation()

    setFormData({ ...formData, loading: true })

    put(`/1/admin/account/${aid}`, {
      last: formData.last,
      first: formData.first,
      company: formData.company,
      phone: formData.phone,
      zip: formData.zip
    }).then((response) => {
      if (response.success === true) {
        setFormData({
          ...formData,
          success: true,
          error: '',
          loading: false,
          hasError: {}
        })
      } else {
        const state = {
          success: false,
          error: '',
          loading: false,
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
        setFormData(state)
      }
    })
  } // end handleSubmit

  let alerts = []

  if (formData.success) {
    alerts = <Alert type='success' message='個人資料更新成功' />
  } else if (formData.error) {
    alerts = <Alert type='danger' message={formData.error} />
  }

  return (
    <form onSubmit={handleSubmit}>
      <legend> 個人資料 </legend>
      {alerts}
      <TextControl
        name='last'
        label='姓氏'
        value={formData.last}
        onChange={(e) => setFormData({ ...formData, last: e.target.value })}
        hasError={formData.hasError.last}
        help={formData.help.last}
        disabled={formData.loading}
      />
      <TextControl
        name='first'
        label='名字'
        value={formData.first}
        onChange={(e) => setFormData({ ...formData, first: e.target.value })}
        hasError={formData.hasError.first}
        help={formData.help.first}
        disabled={formData.loading}
      />
      <TextControl
        name='company'
        label='公司'
        value={formData.company}
        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
        hasError={formData.hasError.company}
        help={formData.help.company}
        disabled={formData.loading}
      />
      <TextControl
        name='phone'
        label='電話'
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        hasError={formData.hasError.phone}
        help={formData.help.phone}
        disabled={formData.loading}
      />
      <TextControl
        name='zip'
        label='郵遞區號'
        value={formData.zip}
        onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
        hasError={formData.hasError.zip}
        help={formData.help.zip}
        disabled={formData.loading}
      />
      <ControlGroup hideLabel hideHelp>
        <Button
          type='submit'
          inputClasses={{ 'btn-primary': true }}
          disabled={formData.loading}
        >
          更新
          <Spinner space='left' show={formData.loading} />
        </Button>
      </ControlGroup>
    </form>
  )
}

export default DetailsForm
