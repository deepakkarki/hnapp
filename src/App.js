import React, { Component } from 'react'; 
import './App.css';


const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const DEFAULT_PAGE = 0;
const PARAM_PAGE = 'page=';
const DEFAULT_HPP = '10';
const PARAM_HPP = 'hitsPerPage=';

//const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}`;

function isSearched(searchTerm) {
  return function(item) {
    return !searchTerm ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase());
  } 
}

function Button(props) {
  const { onClick, className='', children} = props;
  return ( 
    <button onClick={onClick} className={className} type="button">
    {children}
    </button> 
  );
}

function Search(props){
  const { value, onChange, onSubmit, children } = props;
  return (
    <form onSubmit={onSubmit}>
      <input type="text" 
             value={value} 
             onChange={onChange} /> 
      <button type="submit">
        {children}
      </button>
    </form>
  ); 
}

function Table(props) {
  const {list, onDismiss} = props;
  return (
    <div className="table">
      {
        list.map(item =>
        <div key={item.objectID} className="table-row">
          <span style={{ width: '40%' }}>
            <a href={item.url}>{item.title}</a>
          </span>
          <span style={{ width: '30%' }}>
            {item.author}
          </span>
          <span style={{ width: '10%' }}>
            {item.num_comments}
          </span>
          <span style={{ width: '10%' }}>
            {item.points}
          </span>
          <span style={{ width: '10%' }}>
            <Button onClick={() => onDismiss(item.objectID)}
              className="button-inline">
              Dismiss
            </Button>
          </span>
        </div>
        )
      }
    </div>
  );
}

class App extends Component { 

  constructor(props){
    super(props);
    this.state = {
      result: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
    };
    this.setSearchTopstories = this.setSearchTopstories.bind(this);
    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.needsToSearchTopstories = this.needsToSearchTopstories.bind(this);
  }

  needsToSearchTopstories(searchTerm) {
    return !this.state.results[searchTerm];
  }


  onDismiss(id){
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];
    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);
    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    });
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
    console.log(this.state.searchTerm)
    console.log(event.target.value)
  }

  onSearchSubmit(ev) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    if (this.needsToSearchTopstories(searchTerm)) {
      this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
    }
    ev.preventDefault();
  }

  setSearchTopstories(result) {
    const { hits, page } = result;
    const { searchKey, results } = this.state;
    const oldHits = results && results[searchKey] ? results[searchKey].hits : [];

    const updatedHits = [ ...oldHits, ...hits ];
    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    });
  }
  
 fetchSearchTopstories(searchTerm, page) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopstories(result))
      .catch(e => e);
  }
  
  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
  }

  render() {

    const { searchTerm, results, searchKey } = this.state;

    const page = ( results && results[searchKey] 
                    && results[searchKey].page ) || 0;

    const list = ( results && results[searchKey] 
                    && results[searchKey].hits) || [];

    return (
      <div className="page">
        <div className="interactions">
          <Search value={searchTerm} 
                  onChange={this.onSearchChange}
                  onSubmit={this.onSearchSubmit}>
              Search
          </Search>
        </div>
        <Table
            list={list}
            onDismiss={this.onDismiss} />

        <div className="interactions">
          <Button onClick={() => this.fetchSearchTopstories(searchKey, page + 1)}>
            More
          </Button>
        </div>
      </div>
    ); 
  }
}

export default App;



/*
        <form>
          <input type="text" onChange={this.onSearchChange}/> 
        </form>
        {
          this.state.list
            .filter(isSearched(this.state.searchTerm))
            .map(item => {
              return (
                <div key={item.objectID} className="item">
                  <span>
                    <a href={item.url}> {item.title} </a>
                  </span>
                  <span> {item.author} </span>
                  <span> {item.num_comments} </span>
                  <span> {item.points}  </span>
                  <span>
                    <button onClick={() => this.onDismiss(item.objectID)} 
                      type="button"> Dismiss </button>
                  </span>
                </div>
              );
            })
        }
*/