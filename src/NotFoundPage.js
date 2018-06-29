import React from 'react'
import { Helmet } from 'react-helmet'

class NotFoundPage extends React.Component {
  render() {
    return (
      <section className="container">
        <Helmet>
          <title>沒有此頁面</title>
        </Helmet>
        <h1 className="page-header">沒有此頁面</h1>
        <p>本平台沒有此頁面。</p>
      </section>
    )
  }
}

export default NotFoundPage
