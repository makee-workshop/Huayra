import React, { useState, useEffect } from 'react'
import Moment from 'moment'
import { Helmet } from 'react-helmet'
import { Container, Row, Col, Card } from 'reactstrap'
import styles from './css/account.module.css'

const AccountHome = () => {
  const [time, setTime] = useState(getThisMoment())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getThisMoment())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  function getThisMoment () {
    const thisMoment = Moment()

    return {
      second: thisMoment.format('ss'),
      minute: thisMoment.format('mm'),
      hour: thisMoment.format('HH'),
      day: thisMoment.format('DD'),
      month: thisMoment.format('MM'),
      year: thisMoment.format('YYYY')
    }
  }

  return (
    <Container>
      <Helmet>
        <title>我的帳號</title>
      </Helmet>
      <Row>
        <Col sm={7}>
          <h1 className='page-header'>我的帳號</h1>
          <div className='row'>
            <Col sm={4}>
              <Card body className={`well text-center ${styles['stat-card']}`}>
                <div className={styles['stat-value']}>{time.hour}</div>
                <div className={styles['stat-label']}>時</div>
              </Card>
            </Col>

            <Col sm={4}>
              <Card body className={`well text-center ${styles['stat-card']}`}>
                <div className={styles['stat-value']}>{time.minute}</div>
                <div className={styles['stat-label']}>分</div>
              </Card>
            </Col>

            <Col sm={4}>
              <Card body className={`well text-center ${styles['stat-card']}`}>
                <div className={styles['stat-value']}>{time.second}</div>
                <div className={styles['stat-label']}>秒</div>
              </Card>
            </Col>

            <Col sm={4}>
              <Card body className={`well text-center ${styles['stat-card']}`}>
                <div className={styles['stat-value']}>{time.year}</div>
                <div className={styles['stat-label']}>年</div>
              </Card>
            </Col>

            <Col sm={4}>
              <Card body className={`well text-center ${styles['stat-card']}`}>
                <div className={styles['stat-value']}>{time.month}</div>
                <div className={styles['stat-label']}>月</div>
              </Card>
            </Col>

            <Col sm={4}>
              <Card body className={`well text-center ${styles['stat-card']}`}>
                <div className={styles['stat-value']}>{time.day}</div>
                <div className={styles['stat-label']}>日</div>
              </Card>
            </Col>
          </div>
        </Col>
        <Col sm={5} className='text-center'>
          <h1 className='page-header'>時間表</h1>
          <i className='lnr lnr-chart-bars bamf' />
        </Col>
      </Row>
    </Container>
  )
}

export default AccountHome
