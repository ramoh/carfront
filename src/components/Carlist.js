import React, {Component} from 'react';
import {SERVER_URL} from "../constants";
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import {confirmAlert} from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import AddCar from './AddCar';
import {CSVLink} from "react-csv";
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Snackbar from "@material-ui/core/Snackbar";

class Carlist extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cars: [],
            open: false,
            message: ''
        };
    }

    componentDidMount() {
        this.fetchCars();
    }

    render() {

        const columns = [
            {
                Header: 'Brand',
                accessor: 'brand',
                Cell: this.renderEdit
            },
            {
                Header: 'Model',
                accessor: 'model',
                Cell: this.renderEdit
            },
            {
                Header: 'Color',
                accessor: 'color',
                Cell: this.renderEdit
            }, {
                Header: 'Year',
                accessor: 'year',
                Cell: this.renderEdit
            },
            {
                Header: 'Price',
                accessor: 'price',
                Cell: this.renderEdit
            }, {
                id: 'savebutton',
                sortable: false,
                filterable: false,
                width: 100,
                accessor: '_links.self.href',
                Cell: ({value, row}) =>
                    (<Button size="small" variant="text" color="primary" onClick={() => {
                        this.updateCar(row, value)
                    }}>Save</Button>)
            }
            ,
            {
                id: 'delbutton',
                sortable: false,
                filterable: false,
                width: 100,
                accessor: '_links.self.href',
                Cell: ({value}) => (<Button size="small" variant="text" color="secondary" onClick={() => {
                    this.confirmDelete(value)
                }}>Delete</Button>)
            },
        ]

        return (
            <div className="App">
                <Grid container>
                    <Grid item>
                        <AddCar addCar={this.addCar} fetchCars={this.fetchCars} updateMessage={this.updateMessage}/>
                    </Grid>
                    <Grid item style={{padding: 20}}>
                        <CSVLink data={this.state.cars} filename="cars.csv">Export CSV</CSVLink>
                    </Grid>
                </Grid>
                <ReactTable data={this.state.cars} columns={columns} filterable={true} pageSize={5}/>
                <Snackbar open={this.state.open}
                          anchorOrigin={{horizontal: 'center', vertical: 'top'}}
                          style={{width: 300, color: 'green'}}
                          onClose={this.handleClose}
                          autoHideDuration={6500}
                          message={this.state.message}
                />
            </div>
        );
    }

    //fetch cars
    fetchCars = () => {
        //Read the token from session storage and include it in authorization header
        const token = sessionStorage.getItem('jwt');
        fetch(SERVER_URL + 'api/cars', {
            headers: {'Authorization': token}
        })
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({cars: responseData._embedded.cars});
            })
            .catch(err => console.error(err));
    }

    confirmDelete = (link) => {
        confirmAlert({
            message: 'Are you sure to delete ?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => this.onDelClick(link)
                },
                {
                    label: 'No'

                }]
        })
        ;
    }

    //Del link
    onDelClick(link) {
        //Read the token from session storage and include it in authorization header
        const token = sessionStorage.getItem('jwt');
        fetch(link, {
            method: 'DELETE',
            headers:{'Authorization': token}
        })
            .then(res => {
                this.setState({open: true, message: 'Car deleted'})
                this.fetchCars();
            })
            .catch(err => {
                this.setState({open: true, message: "Error in deleting"})
                console.error(err);
            });
    }

    updateMessage = (message) => {
        this.setState({open: true, message: message});
    }

    //Add a new car
    addCar(car) {
        //Read the token from session storage and include it in authorization header
        const token = sessionStorage.getItem('jwt');
        fetch(SERVER_URL + 'api/cars', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(car)
        }).then(res => {
            if (res.ok) {
                this.fetchCars();
                this.updateMessage("Car added successfully");
            } else {
                this.updateMessage("Error in adding");
            }
        }).catch(err => {
            this.updateMessage("Error in adding")
        });
    }

    renderEdit = (cellInfo) => {
        return (
            <div style={{backgroundColor: "#fafafa"}}
                 contentEditable
                 suppressContentEditableWarning
                 onBlur={e => {
                     const data = [...this.state.cars]
                     const oldValue = data[cellInfo.index][cellInfo.column.id];
                     const newValue = e.target.innerHTML;
                     console.log(oldValue, newValue);
                     if (oldValue != newValue) {
                         data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
                         this.setState({cars: data});
                     }
                 }}
                 dangerouslySetInnerHTML={{__html: this.state.cars[cellInfo.index][cellInfo.column.id]}}
            >

            </div>
        );
    }
    //update the car
    updateCar = (car, link) => {
        //Read the token from session storage and include it in authorization header
        const token = sessionStorage.getItem('jwt');
        fetch(link, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(car)
        })
            .then(res => {
                if (res.ok) {
                    this.setState({open: true, message: "Car details updated"})
                } else {
                    this.updateMessage('Error in updating');
                    this.fetchCars();
                }
            })
            .catch(err => this.setState({open: true, message: err.message}))
    }

    handleClose = (event, message) => {
        this.setState({open: false})
    }
}

export default Carlist;