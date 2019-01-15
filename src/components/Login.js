import React, {Component} from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {SERVER_URL} from "../constants";
import Carlist from "./Carlist";
import Snackbar from "@material-ui/core/Snackbar";
import {Typography} from "@material-ui/core";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from "@material-ui/core/Toolbar";


class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            open: false,
            message: '',
            isAuthenticated: false
        }
    }

    //text event change
    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value})
    }

    //process logout event
    logout = () => {
        sessionStorage.removeItem("jwt");
        this.setState({
            username: '',
            password: '',
            isAuthenticated: false
        })
        ;
    }

    //process login event
    login = () => {
        const user = {username: this.state.username, password: this.state.password};
        fetch(SERVER_URL + 'login', {
            method: 'POST',
            body: JSON.stringify(user)
        }).then(res => {
            const jwtToken = res.headers.get('Authorization');
            if (jwtToken != null) {
                sessionStorage.setItem("jwt", jwtToken);
                this.setState({isAuthenticated: true});
            } else {
                this.setState({open: true, message: 'Check username and password'});
            }
        }).catch(err => {
            console.error(err);
            this.setState({open: true, message: 'Failed to get user details'});
        });
    }

    //snack bar close event
    handleClose = () => {
        this.setState({open: false})
    }

    //render component
    render() {
        return (
            <div className="App">
                <AppBar position="static" color="default">
                    <Toolbar>
                        <Typography variant="h6" color="inherit" style={{flexGrow: 1, textAlign: 'left'}}>Car
                            List</Typography>
                        {
                            this.state.isAuthenticated &&
                            <Button variant="contained" color="primary"
                                    onClick={this.logout}>Logout</Button>
                        }
                    </Toolbar>
                </AppBar>
                {this.state.isAuthenticated ? (<Carlist/>) : (
                    <div>
                        <div>
                            <br/><br/>
                            <TextField name="username" placeholder="Username" onChange={this.handleChange}/><br/>
                            <TextField name="password" type="password" placeholder="Password"
                                       onChange={this.handleChange}/><br/><br/>
                            <Button variant="contained" color="primary" onClick={this.login}>Login</Button>
                        </div>
                        <Snackbar open={this.state.open}
                                  style={{width: 300, color: 'green'}}
                                  anchorOrigin={{horizontal: 'center', vertical: 'top'}}
                                  onClose={this.handleClose}
                                  autoHideDuration={6500}
                                  message={this.state.message}
                        />
                    </div>
                )
                }
            </div>
        );
    }
}

export default Login;