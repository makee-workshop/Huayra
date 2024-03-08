import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { Container, Row, Col } from 'reactstrap'
import { Link } from 'react-router-dom'
import ReactTable from 'react-table'
import { get, deleteItem } from '../utils/httpAgent'

const UsersPage = () => {
  const [state, setState] = useState({
    loading: false,
    success: false,
    error: undefined,
    hasError: {},
    data: [],
    pages: null
  })

  const fetchUserList = (state) => {
    const page = state ? state.page + 1 : 1
    const limit = state ? state.pageSize : 10
    let sorted = state ? state.sorted ? state.sorted : [] : []

    if (sorted.length > 0) {
      sorted = `${sorted[0].desc ? '-' : ''}${sorted[0].id}`
    }

    setState({ ...state, loading: true })

    get(`/1/admin/users?page=${page}&limit=${limit}&sort=${sorted}`).then((response) => {
      if (response.success === true) {
        setState({
          ...state,
          loading: false,
          success: true,
          error: '',
          data: response.data,
          pages: response.pages.total
        })
      } else {
        const newState = {
          loading: false,
          success: false,
          error: '',
          hasError: {},
          help: {}
        }

        if (response.errors[0] !== undefined) {
          newState.error = response.errors[0]
        }
        setState(newState)
      }
    })
  }

  const deleteUser = (uid, username) => {
    if (!window.confirm(`是否確定要刪除使用者 ${username}？`)) {
      return -1
    }

    deleteItem(`/1/admin/users/${uid}`).then((response) => {
      if (response.success === true) {
        fetchUserList()
      }
    })
  }

  const columns = [
    {
      Header: '操作',
      accessor: '_id',
      width: 55,
      Cell: (row) => (
        <span>
          <Link to={`/admin/user/${row.value}/${row.original.roles.account._id}/${row.original.username}`} className='btn btn-sm'>
            <i className='lnr lnr-pencil' />
          </Link>
        </span>
      )
    }, {
      Header: '帳號',
      accessor: 'username',
      width: 100
    }, {
      Header: '姓名',
      accessor: 'roles',
      width: 100,
      Cell: (row) => (
        <span>{row.value.account.name.full}</span>
      )
    }, {
      Header: 'email',
      accessor: 'email',
      width: 200
    }, {
      Header: '電話',
      accessor: 'roles',
      width: 100,
      Cell: (row) => (
        <span>{row.value.account.phone}</span>
      )
    }, {
      Header: '是否啟用',
      accessor: 'isActive',
      width: 100,
      Cell: (row) => (
        <span>
          <span style={{
            color: row.value === true
              ? '#0000FF'
              : row.value === false
                ? '#FF0000'
                : '#000',
            transition: 'all .3s ease'
          }}
          >
            &#x25cf;
          </span>
          {row.value === true
            ? '啟用'
            : row.value === false
              ? '關閉'
              : '異常狀態'}
        </span>
      )
    }, {
      Header: '權限',
      accessor: 'roles',
      width: 60,
      Cell: (row) => (
        <span>{row.value && row.value.admin ? '管理者' : '一般'}</span>
      )
    }, {
      Header: '創立時間',
      accessor: 'timeCreated',
      Cell: (row) => (
        <span>{new Date(row.value).toLocaleString('tw')}</span>
      )
    }, {
      Header: '',
      accessor: '_id',
      width: 50,
      Cell: (row) => (
        <button className='btn btn-danger btn-sm' onClick={() => deleteUser(row.value, row.original.username)}>
          <i className='lnr lnr-cross' />
        </button>
      )
    }]

  return (
    <Container>
      <Helmet>
        <title>
          用戶管理
        </title>
      </Helmet>
      <h1 className='page-header'>用戶管理</h1>
      <Row>
        <Col md={12}>
          <ReactTable
            manual
            data={state.data}
            pages={state.pages}
            loading={state.loading}
            onFetchData={fetchUserList}
            columns={columns}
            previousText='上一頁'
            nextText='下一頁'
            pageText='頁'
            ofText='/'
            rowsText='筆'
            className='-striped -highlight'
            defaultPageSize={10}
            defaultSorted={[{ id: 'timeCreated', desc: true }]}
          />
        </Col>
      </Row>
    </Container>
  )
}

export default UsersPage
