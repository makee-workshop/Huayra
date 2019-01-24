import React, { Component } from 'react'
import cx from 'classnames'
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
    fetch('/1/admin/count', { credentials: 'include', mode: 'cors' })
      .then(r => r.json())
      .then(r => {
        if (r.success === true) {
          this.setState({ ...r.data })
        }
      }).catch(e => {
        console.error(e)
      })
  }

  render () {
    return (
      <section className='section-home container'>
        <div className='row'>
          <div className='col-md-6'>
            <h1 className='page-header'>系統資訊</h1>
            <div className='row'>
              <div className='col-md-6'>
                <div className={cx(styles.well, 'well', 'text-center')}>
                  <div className={styles['stat-value']}>
                    {this.state.User}
                  </div>
                  <div className={styles['stat-label']}>使用者</div>
                </div>
              </div>
              <div className='col-md-6'>
                <div className={cx(styles.well, 'well', 'text-center')}>
                  <div className={styles['stat-value']}>
                    {this.state.Admin}
                  </div>
                  <div className={styles['stat-label']}>管理者</div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-md-6 text-center'>
            <h1 className='page-header'>儀表板</h1>
            <i className='fa fa-dashboard bamf' />
          </div>
        </div>
      </section>
    )
  }
}

export default index
