import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { Container, Row, Col } from 'reactstrap'
import { Link } from 'react-router-dom'
import ReactTable from 'react-table'
import { get, deleteItem } from '../utils/httpAgent'

class UsersPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      success: false,
      error: undefined,
      hasError: {},
      data: [],
      pages: null
    }
    this.fetchUserList = this.fetchUserList.bind(this)
  }

  fetchUserList (state) {
    const page = state ? state.page + 1 : 1
    const limit = state ? state.pageSize : 10

    this.setState({
      loading: true
    })

    get('/1/admin/users?page=' + page + '&limit=' + limit)
      .then(r => {
        if (r.success === true) {
          this.setState({
            loading: false,
            success: true,
            error: '',
            data: r.data,
            pages: r.pages.total
          })
        } else {
          let state = {
            loading: false,
            success: false,
            error: '',
            hasError: {},
            help: {}
          }

          if (r.errors[0] !== undefined) {
            state.error = r.errors[0]
          }
          this.setState(state)
        }
      })
  }

  deleteUser (uid, username) {
    if (!window.confirm(`是否確定要刪除使用者 ${username}？`)) {
      return -1
    }

    deleteItem('/1/admin/users/' + uid)
      .then(r => {
        if (r.success === true) {
          this.fetchUserList()
        }
      })
  }

  render () {
    const columns = [
      {
        Header: '操作',
        accessor: '_id',
        width: 55,
        Cell: row => (
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
        Cell: row => (
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
        Cell: row => (
          <span>{row.value.account.phone}</span>
        )
      }, {
        Header: '是否啟用',
        accessor: 'isActive',
        width: 100,
        Cell: row => (
          <span>
            <span style={{
              color: row.value === true ? '#0000FF'
                : row.value === false ? '#FF0000'
                  : '#000',
              transition: 'all .3s ease' }}>
              &#x25cf;
            </span>
            {row.value === true ? '啟用'
              : row.value === false ? '關閉'
                : '異常狀態'}
          </span>
        )
      }, {
        Header: '權限',
        accessor: 'roles',
        width: 60,
        Cell: row => (
          <span>{row.value && row.value.admin ? '管理者' : '一般'}</span>
        )
      }, {
        Header: '創立時間',
        accessor: 'timeCreated',
        Cell: row => (
          <span>{new Date(row.value).toLocaleString('tw')}</span>
        )
      }, {
        Header: '',
        accessor: '_id',
        width: 50,
        Cell: row => (
          <button className='btn btn-danger btn-sm' onClick={this.deleteUser.bind(this, row.value, row.original.username)}>
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
              data={this.state.data}
              pages={this.state.pages}
              loading={this.state.loading}
              onFetchData={this.fetchUserList}
              columns={columns}
              previousText='上一頁'
              nextText='下一頁'
              pageText='頁'
              ofText='/'
              rowsText='筆'
              className='-striped -highlight'
              defaultPageSize={10}
              defaultSorted={[ { id: 'createDate', desc: true } ]} />
          </Col>
        </Row>
      </Container>
    )
  }
}

export default UsersPage
