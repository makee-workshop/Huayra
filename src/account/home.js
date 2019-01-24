import React, { Component } from 'react'
import Moment from 'moment'
import { Helmet } from 'react-helmet'
import cx from 'classnames'
import styles from './css/account.module.css'

class index extends Component {
  constructor (props) {
    super(props)
    this.state = this.getThisMoment()
  }

  componentDidMount () {
    this.interval = setInterval(this.refreshTime.bind(this), 1000)
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  refreshTime () {
    this.setState(this.getThisMoment())
  }

  getThisMoment () {
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

  render () {
    return (
      <section className='section-home container'>
        <Helmet>
          <title>我的帳號</title>
        </Helmet>
        <div className='row'>
          <div className='col-sm-7'>
            <h1 className='page-header'>我的帳號</h1>
            <div className='row'>
              <div className='col-sm-4'>
                <div className={cx(styles.well, 'well', 'text-center')}>
                  <div className={styles['stat-value']}>
                    {this.state.hour}
                  </div>
                  <div className={styles['stat-label']}>時</div>
                </div>
              </div>
              <div className='col-sm-4'>
                <div className={cx(styles.well, 'well', 'text-center')}>
                  <div className={styles['stat-value']}>
                    {this.state.minute}
                  </div>
                  <div className={styles['stat-label']}>分</div>
                </div>
              </div>
              <div className='col-sm-4'>
                <div className={cx(styles.well, 'well', 'text-center')}>
                  <div className={styles['stat-value']}>
                    {this.state.second}
                  </div>
                  <div className={styles['stat-label']}>秒</div>
                </div>
              </div>
              <div className='col-sm-4'>
                <div className={cx(styles.well, 'well', 'text-center')}>
                  <div className={styles['stat-value']}>
                    {this.state.year}
                  </div>
                  <div className={styles['stat-label']}>年</div>
                </div>
              </div>
              <div className='col-sm-4'>
                <div className={cx(styles.well, 'well', 'text-center')}>
                  <div className={styles['stat-value']}>
                    {this.state.month}
                  </div>
                  <div className={styles['stat-label']}>月</div>
                </div>
              </div>
              <div className='col-sm-4'>
                <div className={cx(styles.well, 'well', 'text-center')}>
                  <div className={styles['stat-value']}>
                    {this.state.day}
                  </div>
                  <div className={styles['stat-label']}>日</div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-sm-5 text-center'>
            <h1 className='page-header'>時間表</h1>
            <i className='fa fa-dashboard bamf' />
          </div>
        </div>
      </section>
    )
  }
}

export default index
