import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
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
    const pad = (n) => String(n).padStart(2, '0')
    const d = new Date()

    return {
      second: pad(d.getSeconds()),
      minute: pad(d.getMinutes()),
      hour: pad(d.getHours()),
      day: pad(d.getDate()),
      month: pad(d.getMonth() + 1),
      year: String(d.getFullYear())
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
          <div className='row g-3'>
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
