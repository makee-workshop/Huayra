import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

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
    const page = state.page + 1
    const limit = state.pageSize

    this.setState({
      loading: true
    })

    fetch('/1/admin/users?page=' + page + '&limit=' + limit)
      .then(r => r.json())
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
      }).catch(e => {
        console.error(e)
      })
  }

  render () {
    const columns = [
      {
        Header: 'ID',
        accessor: '_id',
        width: 240,
        Cell: row => (
          <span><Link to={`/admin/user/${row.value}/${row.original.roles.account._id}/${row.original.username}`} className='btn'> <i className='fa fa-edit' /> </Link> <span>{row.value}</span></span>
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
          <span><span style={{ color: row.value === 'yes' ? '#0000FF' : row.value === 'no' ? '#FF0000' : '#000', transition: 'all .3s ease' }}>&#x25cf</span>
            {row.value === 'yes' ? '啟用'
              : row.value === 'no' ? '關閉'
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
        accessor: 'timeCreated'
      }]

    return (
      <section className='container'>
        <Helmet>
          <title>
            用戶管理
          </title>
        </Helmet>
        <h1 className='page-header'>用戶管理</h1>
        <div className='row'>
          <div className='col-md-12'>
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
          </div>
        </div>
      </section>
    )
  }
}

export default UsersPage
