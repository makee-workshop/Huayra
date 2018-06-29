import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import './css/home.min.css'

class index extends Component {
  render() {

    return (
      <section className="section-home container">
        <Helmet>
          <title>Huayra</title>
        </Helmet>
        <div className="jumbotron">
          <h1>Success</h1>
          <p className="lead">您的網站及會員系統已建置成功！</p>
        </div>
        <div className="row">
          <div className="col-sm-4">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">關於我們</h3>
              </div>
              <div className="panel-body">
                <p>
                  Bicycle rights jean shorts la croix
                  vexillologist hell of kitsch. Photo booth
                  craft beer fixie raw denim hot chicken.
                  Pickled adaptogen sartorial brooklyn tilde
                  bay area.
                </p>
                <Link to="/about" className="btn btn-info btn-block">
                  瞭解更多
                </Link>
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">註冊會員</h3>
              </div>
              <div className="panel-body">
                <p>
                  Health goth skateboard tousled umami, tofu
                  squid organic freegan +1 keytar brunch
                  post-ironic. Copper mug selfies tattooed
                  chicharrones short ribs yolo cardigan.
                </p>
                <Link to="/signup" className="btn btn-success btn-block">
                  瞭解更多
                </Link>
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">連絡我們</h3>
              </div>
              <div className="panel-body">
                <p>
                  Roof party readymade tote bag hot chicken
                  blog. Fam readymade raclette hella quinoa.
                  Cred pour-over yuccie williamsburg shabby
                  chic ramps chartreuse messenger bag.
                </p>
                <Link to="/contact" className="btn btn-warning btn-block">
                  瞭解更多
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

export default index
