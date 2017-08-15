import React, { Component } from 'react'; 
import './App.css';

const list = [
  {
    title: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
}, {
    title: 'Redux',
    url: 'https://github.com/reactjs/redux',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
}, ];


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
  const { value, onChange, children } = props;
  return (
    <form>
      {children}
      <input type="text" value={value} onChange={onChange} /> 
    </form>
  ); 
}

function Table(props) {
  const {list, pattern, onDismiss} = props;
  return (
    <div className="table">
      {
        list.filter(isSearched(pattern)).map(item =>
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
      list: list,
      searchTerm: ""
    };
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this)
  }

  onDismiss(id){
    const updatedList = this.state.list.filter(item => item.objectID !== id);
    this.setState({ list: updatedList });
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  render() {
    const { searchTerm, list } = this.state;
    return (
      <div className="page">
        <div className="interactions">
          <Search value={searchTerm} 
                  onChange={this.onSearchChange}>
              Search - 
          </Search>
        </div>
        <Table list={list} 
               pattern={searchTerm} 
               onDismiss={this.onDismiss}/>
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