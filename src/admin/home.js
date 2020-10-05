import React, { Component } from 'react'
import { Container, Row, Col, Card } from 'reactstrap'
import { Helmet } from 'react-helmet'
import { get } from '../utils/httpAgent'
import styles from './css/admin.module.css'

class index extends Component {
  constructor (props) {
    super(props)
    this.state = {
      User: 0,
      Admin: 0
    }
  }

  componentDidMount () {
    this.fetchData()
  }

  fetchData () {
    get('/1/admin/count')
      .then(r => {
        if (r.success === true) {
          this.setState({ ...r.data })
        }
      })
  }

  render () {
    return (
      <Container>
        <Helmet>
          <title>系統資訊</title>
        </Helmet>
        <Row>
          <Col md={6}>
            <h1 className='page-header'>系統資訊</h1>
            <Row>
              <Col md={6}>
                <Card body inverse className='dark-card text-center'>
                  <div className={styles['stat-value']}>
                    {this.state.User}
                  </div>
                  <div className={styles['stat-label']}>使用者</div>
                </Card>
              </Col>

              <Col md={6}>
                <Card body inverse className='dark-card text-center'>
                  <div className={styles['stat-value']}>
                    {this.state.Admin}
                  </div>
                  <div className={styles['stat-label']}>管理者</div>
                </Card>
              </Col>
            </Row>
          </Col>
          <Col md={6} className='text-center'>
            <h1 className='page-header'>儀表板</h1>
            <i className='lnr lnr-chart-bars bamf' />
          </Col>
        </Row>
      </Container>
    )
  }
}

export default index
