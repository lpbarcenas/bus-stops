import React from 'react';
import axios from 'axios';
import BusstopList from './BusstopList';
import { BUS_STOPS_LIST_URL, API_USERNAME, API_PASSWORD, API_LOGIN_URL } from '../../constants/urls'

export default class Busstops extends React.Component {
  state = {
    buses: [],
    token: ''
  }

  async componentDidMount() {

    let token = localStorage.getItem("auth_token");

    if (!token) {
       const res = await axios.post(API_LOGIN_URL, { username: API_USERNAME, password: API_PASSWORD }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (res && res.data && res.data.status === "SUCCESS") {
          localStorage.setItem("auth_token", res.data.token)
          token = localStorage.getItem("auth_token");
        }
    }
    this.setState({token})
    const res2 = await axios.get(BUS_STOPS_LIST_URL, {
        headers: {
        'Authorization': `Bearer ${token}` 
      }}
    )
    if (res2 && res2.data) {
          this.setState({ buses: res2.data.results });
    }
  }

  render() {
    return (
        <BusstopList  busstops={this.state.buses} token={this.state.token} />
    )
  }
}