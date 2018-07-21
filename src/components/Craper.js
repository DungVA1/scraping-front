import React, { Component } from 'react';
import axios from 'axios';
import './craper.css';

class Craper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      err: undefined,
      pageNumber: 0,
      category: undefined,
      lsCate: [],
    }
  }

  componentWillMount() {
    axios.get('http://localhost:3001/book?offset=1&init=true').then(res => {
      this.setState({ data: res.data, loading: false });
      if (!this.state.lsCate.length) {
        this.setState({ lsCate: res.data.category });
      }
    }).catch(e => {
      this.setState({ err: 'Has error' });
    });
  }

  onHandleSubmit(e) {
    e.preventDefault();
    let url = 'http://localhost:3001/book?offset=1';
    if (this.state.pageNumber) {
      url = `http://localhost:3001/book?offset=${this.state.pageNumber}`
    } else {
      url = `http://localhost:3001/book?category=${this.state.category}`
    }

    axios.get(url).then(res => {
      this.setState({ data: res.data })
    }).catch(e => {
      this.setState({ err: 'Has error' });
    });
  }

  onHandleChange(e) {
    this.setState({ pageNumber: e.target.value });
  }

  onHandleSelect(e) {
    this.setState({ category: e.target.value, init: false });
  }

  render() {
    const { data, loading } = this.state;
    if (loading) return <h1>Loading .....</h1>
    else if (this.state.err) return <h1 id="error-label">Has Error</h1>
    else {
      return (
        <div>
          <div id="form">
            <h3>Search Form</h3>
            <input
              type="text"
              id="page-number"
              placeholder="Page Number"
              onChange={(e) => this.onHandleChange(e)}
            />
            <select onChange={(e) => this.onHandleSelect(e)}>
              {
                this.state.lsCate.map((c, i) => (
                  <option key={i} value={c.url}>{c.cateName}</option>
                ))
              }
            </select>
            <button type="submit" onClick={(e) => this.onHandleSubmit(e)}>GET</button>
          </div>
          <table id="data-container">
          <tbody>
            <tr className="theader">
              <th>Book Name</th>
              <th>Status</th>
              <th>Category</th>
              <th>Image</th>
              <th>Price</th>
            </tr>
          {
            data.book.map((b, i) => (
              <tr key={i}>
                <td>{b.bookName}</td>
                <td>{b.status}</td>
                <td>{b.category}</td>
                <td>{b.image}</td>
                <td>{b.price}</td>
              </tr>
            ))
          }
          </tbody>
        </table>
        </div>
      );
    }
  }
}

export default Craper;
