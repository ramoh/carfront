import React from 'react';
import SkyLight from 'react-skylight';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';


class AddCar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            brand: '',
            model: '',
            year: '',
            color: '',
            price: ''
        }
    }

    showModal = () => {

        this.setState({
            brand: '',
            model: '',
            year: '',
            color: '',
            price: ''
        });
        this.refs.addDialog.show();
    }


    render() {
        return (
            <div>
                <SkyLight hideOnOverlayClicked ref='addDialog'>
                    <h3>New Car</h3>
                    <form>
                        <TextField type="text" label="Brand" name="brand" onChange={this.handleChange}
                               value={this.state.brand}/><br/>
                        <TextField type="text" label="Model" name="model" onChange={this.handleChange}
                               value={this.state.model}/><br/>
                        <TextField type="text" label="Color" name="color" onChange={this.handleChange}
                               value={this.state.color}/><br/>
                        <TextField type="text" label="Year" name="year" onChange={this.handleChange}
                               value={this.state.year}/><br/>
                        <TextField type="text" label="Price" name="price" onChange={this.handleChange}
                               value={this.state.price}/><br/><br/>
                        <Button variant="outlined" color="primary" onClick={this.handleSumbit}>Save</Button> <Button
                        variant="outlined" color="secondary" onClick={this.cancelSubmit}>Cancel</Button>
                    </form>
                </SkyLight>
                <div>
                    <Button variant="contained" color="primary" style={{'margin': '10px'}}
                            onClick={() => this.showModal()}>New Car </Button>

                </div>
            </div>
        );
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    //save the car and close the model form
    handleSumbit = (event) => {
        event.preventDefault();
        var newCar = {
            brand: this.state.brand,
            model: this.state.model,
            color: this.state.color,
            year: this.state.year,
            price: this.state.price
        };

        this.props.addCar(newCar);
        this.refs.addDialog.hide();
    }
    //Cancel and close the model form
    cancelSubmit = (event) => {
        event.preventDefault();
        this.refs.addDialog.hide();
    }
}

export default AddCar;