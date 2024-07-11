import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Container, Row, Col, Form, Input, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import DataTable from 'react-data-table-component'
import { get, deleteItem } from '../utils/httpAgent'

const UsersPage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [totalRows, setTotalRows] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [targetText, setTargetText] = useState('')
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    fetchData(currentPage) // eslint-disable-next-line
  }, [])

  const fetchData = (page, limit = perPage, search = searchText) => {
    setLoading(true)
    setCurrentPage(page)
    setSearchText(search)
    get(`/1/admin/users?page=${page}&limit=${limit}&search=${search}`) // &sort=${sorted}
      .then(r => {
        if (r.success === true) {
          setData(r.data)
          setTotalRows(r.items.total)
          setLoading(false)
        }
      })
  }

  const handlePageChange = page => {
    fetchData(page)
  }

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage)
    fetchData(page, newPerPage)
  }

  const handleSearch = () => {
    fetchData(1, perPage, targetText)
  }

  const deleteUser = (uid, username) => {
    if (!window.confirm(`是否確定要刪除使用者 ${username}？`)) {
      return -1
    }

    deleteItem(`/1/admin/users/${uid}`).then((response) => {
      if (response.success === true) {
        fetchData(currentPage)
      }
    })
  }

  const columns = [
    {
      name: '操作',
      width: '70px',
      selector: row => (
        <span>
          <Link to={`/admin/user/${row._id}/${row.roles.account._id}/${row.username}`} className='btn btn-sm'>
            <i className='lnr lnr-pencil' />
          </Link>
        </span>
      )
    }, {
      name: '帳號',
      width: '100px',
      sortable: true,
      selector: row => row.username
    }, {
      name: '姓名',
      width: '100px',
      sortable: true,
      selector: row => row.roles.account.name.full
    }, {
      name: 'email',
      width: '200px',
      sortable: true,
      selector: row => row.email
    }, {
      name: '電話',
      width: '120px',
      sortable: true,
      selector: row => row.roles.account.phone
    }, {
      name: '是否啟用',
      width: '100px',
      selector: (row) => (
        <span>
          <span style={{
            color: row.isActive === true
              ? '#0000FF'
              : row.isActive === false
                ? '#FF0000'
                : '#000',
            transition: 'all .3s ease'
          }}
          >
            &#x25cf;
          </span>
          {row.isActive === true
            ? '啟用'
            : row.isActive === false
              ? '關閉'
              : '異常狀態'}
        </span>
      )
    }, {
      name: '權限',
      width: '80px',
      selector: (row) => (
        <span>{row.roles && row.roles.admin ? '管理者' : '一般'}</span>
      )
    }, {
      name: '創立時間',
      sortable: true,
      sortFunction: (rowA, rowB) => {
        if (rowA.timeCreated > rowB.timeCreated) return 1
        if (rowA.timeCreated < rowB.timeCreated) return -1
        return 0
      },
      selector: (row) => (
        <span>{new Date(row.timeCreated).toLocaleString('tw')}</span>
      )
    }, {
      name: '',
      width: '65px',
      selector: (row) => (
        <button className='btn btn-danger btn-sm' onClick={() => deleteUser(row._id, row.username)}>
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
        <Col md={12} className='mb-2'>
          <Form inline>
            <Link to='/admin/signup' className='btn btn-success mr-5'>
              建立用戶
            </Link>

            <Input
              name='search'
              className='mr-2'
              placeholder='帳號、email'
              onChange={e => setTargetText(e.target.value)}
            />
            <Button
              color='primary'
              onClick={handleSearch}
            >
              搜尋
            </Button>
          </Form>

        </Col>
        <Col md={12}>
          <DataTable
            title=''
            columns={columns}
            data={data}
            progressPending={loading}
            progressComponent={
              <div
                className='spinner-border text-primary'
                role='status'
                style={{ width: '5rem', height: '5rem' }}
              >
                <span className='sr-only'>Loading...</span>
              </div>
            }
            paginationTotalRows={totalRows}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handlePerRowsChange}
            pagination
            paginationServer
            paginationComponentOptions={{
              rowsPerPageText: '每頁顯示',
              rangeSeparatorText: '之'
            }}
            defaultSortFieldId={8}
            defaultSortAsc={false}
          />
        </Col>
      </Row>
    </Container>
  )
}

export default UsersPage
