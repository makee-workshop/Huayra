import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Container, Row, Col, Jumbotron, Card, CardTitle, CardText } from 'reactstrap'
import './css/home.min.css'

class index extends Component {
  render () {
    return (
      <Container>
        <Helmet>
          <title>Huayra</title>
        </Helmet>
        <Jumbotron>
          <Container fluid>
            <h1 className='display-3'>Success</h1>
            <p className='lead'>您的網站及會員系統已建置成功！</p>
          </Container>
        </Jumbotron>
        <Row>
          <Col sm='4'>
            <Card body>
              <CardTitle>
                <h4>關於我們</h4>
              </CardTitle>
              <CardText>
                Bicycle rights jean shorts la croix
                vexillologist hell of kitsch. Photo booth
                craft beer fixie raw denim hot chicken.
                Pickled adaptogen sartorial brooklyn tilde
                bay area.
              </CardText>
              <Link to='/about' className='btn btn-info btn-block'>
                瞭解更多
              </Link>
            </Card>
          </Col>

          <Col sm='4'>
            <Card body>
              <CardTitle>
                <h4>註冊會員</h4>
              </CardTitle>
              <CardText>
                Health goth skateboard tousled umami, tofu
                squid organic freegan +1 keytar brunch
                post-ironic. Copper mug selfies tattooed
                chicharrones short ribs yolo cardigan.
              </CardText>
              <Link to='/signup' className='btn btn-success btn-block'>
                瞭解更多
              </Link>
            </Card>
          </Col>

          <Col sm='4'>
            <Card body>
              <CardTitle>
                <h4>連絡我們</h4>
              </CardTitle>
              <CardText>
                Roof party readymade tote bag hot chicken
                blog. Fam readymade raclette hella quinoa.
                Cred pour-over yuccie williamsburg shabby
                chic ramps chartreuse messenger bag.
              </CardText>
              <Link to='/contact' className='btn btn-warning btn-block'>
                瞭解更多
              </Link>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default index
