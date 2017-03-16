import React, { Component } from 'react';

class App extends Component {
  mainUrl = 'http://php.ceveka.com/api/homeworks';
  constructor(props){
    super(props);
    this.state = {
      isLoad : false,
      homeworks : [],
      page: Number(props.page),
      perPage: Number(props.perPage),
      pageCount : 0
    };
  }
  
  fetchData(){
    if( this.state.homeworks["page_"+this.state.page] !== undefined ){
      this.setState({ isLoad : true });
      return;
    } 
    var url = this.mainUrl + "?page=" + this.state.page + "&per_page=" + this.state.perPage;
    console.log("Fetch : ",url);
    fetch(url)
    .then( response => response.json() )
    .then( data => {
      var _homeworks = this.state.homeworks;
      _homeworks["page_"+this.state.page] = data.data;
      this.setState({
        isLoad: true,
        homeworks: _homeworks,
        pageCount: data.page_count
      });
    }
    ).catch(function(err) {
      // Error :(
    });
  }

  componentDidMount () {
    this.fetchData();
  }

  changePage(pageNumber){
    this.setState({
        isLoad: false,
        page: pageNumber
    }, this.fetchData);
  }

  renderPaginator(){
    if(this.state.pageCount>1 && this.state.isLoad)
      return (
        <div className='col-md-12 text-center' >
          <ul className="pagination pagination-lg" style={{ margin:0 }}>
            {[...Array(this.state.pageCount)].map( (_,indis) => 
              <li key={indis} className={ this.state.page === (indis+1) ? "active" : ""}>
                <a href="#" onClick={ e => {
                  e.preventDefault();
                  this.changePage(indis+1);
                  }}>{indis+1}</a>
              </li> 
            )}
          </ul>
        </div>
      )
    else return null;
  }
  
  render() {
    var result = <img src='http://php.ceveka.com/public/media/gif/ring.gif' className="App-logo" alt="logo" />;
    if(this.state.isLoad){
      result = 
        this.state.homeworks["page_"+this.state.page].map( homework =>
          <div className='col-sm-6 col-md-4' key={homework.id} id={'homework_'+homework.id} >
            <div className="thumbnail">
              <div className="caption">
                <a href={homework.path}><h3>{homework.title}</h3></a>
                <p>{homework.description}</p>
              </div>
            </div>
          </div>
        );
      }

    return (
      <div className='col-md-12 text-center'>
        {this.renderPaginator()}                
        <div className='row'> {result} </div>
      </div>
    )
  }
}

export default App;
