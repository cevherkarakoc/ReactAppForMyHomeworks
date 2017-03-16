import React, { Component } from 'react';
import TimeAgo from 'react-timeago'
import turkishStrings from 'react-timeago/lib/language-strings/tr'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'

const formatter = buildFormatter(turkishStrings)

class ReactGalleryApp extends Component {
  mainUrl = 'http://php.ceveka.com/api/gallery';
  constructor(props){
    super(props);
    this.state = {
      isLoad : false,
      gallery : [],
      users : [],
      page: Number(props.page),
      perPage: Number(props.perPage),
      pageCount : 1,
      code:200
    };
  }
  
  fetchData(){
    if(this.state.page>this.state.pageCount) {
      this.setState({
        page : this.state.page-1,
        isLoad : true
      });
      return;
    };
    var url = this.mainUrl + "?page=" + this.state.page + "&per_page=" + this.state.perPage;
    console.log("Fetch : ",url);
    fetch(url,{
      method: "GET",
      credentials: "same-origin"
    })
    .then( response => response.json() )
    .then( data => {
      if(data.meta.status===200){
        var _gallery = this.state.gallery;
        _gallery = _gallery.concat(data.data);

        var _users = Object.assign({},this.state.users, data.included.users);
        this.setState({
          isLoad: true,
          gallery: _gallery,
          users: _users,
          pageCount: data.page_count,
          code:200
        });
      }else if(data.meta.status===403){
        this.setState({
          code:403
        })
      }
    }
    ).catch(function(err) {
      console.log(err);
    });
  }

  componentDidMount () {
    window.addEventListener('scroll', this.scrollHandler.bind(this));
    this.fetchData();
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.scrollHandler.bind(this));
  }
  
  scrollHandler(){
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      this.setState({
        isLoad: false,
        page: this.state.page+1,
      }, this.fetchData);
    }
  }

  renderLoading(){
    if(this.state.isLoad){
      return null;
    }else{
      return <img src='http://php.ceveka.com/public/media/gif/ring.gif' className="App-logo" alt="logo" />;
    }
  }
  
  render() {
    if(this.state.code===403){
      return <div className="alert alert-danger text-center">
                <strong>İçeriği görüntülemek için giriş yapmalısınız.</strong>
             </div>
    }
    return (
      <div className='col-md-12'>           
        <div className='row' >
          { this.state.gallery.map( image => 
              <div  key={image.id} id={'image_'+image.id} >
                <div className="panel panel-default" style={{marginBottom:7}}>
                  <div className="panel-heading">
                    <a style={{fontWeight:600}} href="#">{this.state.users[image.user_id].firstName} {this.state.users[image.user_id].lastName}</a>
                    <TimeAgo style={{float:"right"}} date={image.created_at} formatter={formatter}/>                  
                  </div>
                  <div>
                    <img src={image.url} className="img-responsive" style={{width:"100%"}} alt={image.body} />
                  </div>
                  <div className="panel-footer" style={{color:"#262626", fontWeight:500, overflowWrap:"break-word"}}>
                    {image.body}
                  </div>
                </div>
              </div>)
          }
        </div>
        <div className="text-center">
        {this.renderLoading()}
        </div>
      </div>
    )
  }
}

export default ReactGalleryApp;
