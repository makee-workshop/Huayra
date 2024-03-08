import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import { Helmet } from 'react-helmet'

const About = () => {
  return (
    <Container>
      <Helmet>
        <title>關於我們</title>
      </Helmet>
      <Row>
        <Col sm={6}>
          <h1 className='page-header'>關於我們</h1>
          <div className='media'>
            <div className='pull-left'>
              <div className='media-object'>
                <i className='lnr lnr-flag fa-4x mr-2' />
              </div>
            </div>
            <div className='media-body'>
              <h4 className='media-heading'>簡介</h4>
              <p>
                Makee.io 主要提供實作工作坊分享平台，以及 Zero-to-One
                的學習指南，協助對 Maker、物聯網領域、科普教育有興趣的大
                朋友、小朋友，跨越技術門檻享受動手實作的樂趣。
              </p>
            </div>
          </div>
          <hr />
          <div className='media'>
            <div className='pull-left'>
              <div className='media-object'>
                <i className='lnr lnr-flag fa-4x mr-2' />
              </div>
            </div>
            <div className='media-body'>
              <h4 className='media-heading'>Our Story</h4>
              <p>
                Community - Not only will shoppers visit to see what is
                on display and meet the creative people who make things,
                but creative people will meet other creative people.
              </p>
              <p>
                Skills - Makee.io is the place to share knowledge, learn,
                explore possibilities and meet a bunch of great people.
                No matter you are hacker or maker.
              </p>
              <p>
                Inspire & Encourage - Makee.io brings people face to face.
              </p>
            </div>
          </div>
        </Col>
        <Col sm={6} className='text-center'>
          <h1 className='page-header'>Makee.io</h1>
          <p className='lead'>
            The maker we are, the world we change.
          </p>
          <i className='lnr lnr-rocket bamf' />
        </Col>
      </Row>
    </Container>
  )
}

export default About
