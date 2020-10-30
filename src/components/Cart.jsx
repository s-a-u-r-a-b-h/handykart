import React, { Component } from 'react';
import CartService from '../services/CartService';
import CookieService from '../services/CookieService';
import Loader from './common/Loader';
import ServiceUnavailable from './common/ServiceUnavailable';

class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cartItems: [],
            serviceUnavailable: false
        }
        this.viewCart = this.viewCart.bind(this);
    }

    viewCart(id) {
        this.props.history.push('/cart');
    }

    componentDidMount() {
        if (document.cookie) {
            var result = CookieService.getUserDtls();

            if(result.isUserLoggedIn) {
                Promise.all(
                    [CartService.getCart(result.userEmail)]
                ).then(
                    (res) => {
                        //console.log(res);
                        this.setState({
                            cartItems: res[0].data.prodDetails
                        });
                        document.getElementById('shipping').style.display = "none";
                    }
                ).catch(
                    err => {
                        this.setState({ serviceUnavailable: true })
                        console.log(err.code);
                        console.log(err.message);
                        console.log(err.stack);
                    }
                )
            }
        }
    }
    /*
    reduceQnty(obj) {
        var payload = {
            itemId: obj,
            qntyChange: -1
        };
        this.updateCart(obj);
    }

    addQnty(obj) {
        var payload = {
            itemId: obj,
            qntyChange: 1
        };
        this.updateCart(payload);
    }
    */
    updateCart(payload) {
        CartService.createCart(payload).then(
            (res) => {
                console.log('cart updated');
            }
        ).catch(
            err => {
                this.setState({ serviceUnavailable: true })
                console.log(err.code);
                console.log(err.message);
                console.log(err.stack);
            }
        );
    }

    renderCartTotal() {
        return(
            <table className="table">
                <thead className="thead-light">
                    <tr>
                        <th scope="col"><h3>Total Amount</h3></th>
                        <th scope="col"><h3>₹ {this.state.cartItems[0].price * this.state.cartItems[0].qty}</h3></th>
                    </tr>
                </thead>
            </table>
        );
    }

    renderCartItemsTable() {
        return(
            <table className="table">
                <thead className="thead-light">
                    <tr>
                        <th scope="col"><h5>Product</h5></th>
                        <th scope="col"><h5>Unit Price</h5></th>
                        <th scope="col"><h5>Quantity</h5></th>
                        <th scope="col"><h5>Price</h5></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{this.state.cartItems[0].title}</td>
                        <td>₹ {this.state.cartItems[0].price}</td>
                        <td>
                            <svg onClick={() => this.reduceQnty(this)} width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-dash-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                                <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                            </svg>
                            &nbsp;&nbsp;&nbsp;
                            <input id={this.state.cartItems[0].itemId} className="quantity" defaultValue={this.state.cartItems[0].qty} readOnly={true}></input>
                            &nbsp;&nbsp;&nbsp;
                            <svg onClick={() => this.addQnty(this.state.cartItems[0].itemId)} width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-plus-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                                <path fillRule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                            </svg>
                        </td>
                        <td>
                            ₹ {this.state.cartItems[0].price * this.state.cartItems[0].qty}
                            <input type="hidden" id="orderTotal" value={this.state.cartItems[0].price * this.state.cartItems[0].qty} />
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }

    renderShippingForm() {
        return(
            <div className="shipping-form" id="shipping">
                <br></br>
                <h3>Shipping Details:</h3>
                <hr></hr>
                <form>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="inputAddress">Address Line 1</label>
                            <input type="text" className="form-control" id="inputAddress" placeholder="1234 Main St" />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="inputAddress2">Address Line 2</label>
                            <input type="text" className="form-control" id="inputAddress2" placeholder="Apartment, studio, or floor" />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="inputCity">City</label>
                            <input type="text" className="form-control" id="inputCity" />
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="inputState">State</label>
                            <input type="text" className="form-control" id="inputState" />
                        </div>
                        <div className="form-group col-md-2">
                        <label htmlFor="inputZip">Zip</label>
                        <input type="text" className="form-control" id="inputZip" />
                        </div>
                    </div>
                    <br></br>
                    <button type="button" className="btn btn-success" onClick={() => this.placeOrder()}>Place your Order 👍</button>
                </form>
            </div>
        );
    }

    placeOrder() {
        if (document.cookie) {
            var result = CookieService.getUserDtls();
            var cartItems = this.state.cartItems;
            var today = new Date().toISOString().slice(0, 10)
            var someNumber = Math.floor((Math.random() * 9999999) + 1);;
            
            if(result.isUserLoggedIn) {
                var payload = {   
                    userId: result.userEmail,
                    productList: [cartItems[0].itemId],
                    orderAmt: document.getElementById("orderTotal").value,
                    orderId: someNumber,
                    orderDate: today,
                    qtyList:  [2]
                };
                
                CartService.createOrder(payload).then(
                    (res) => {
                        console.log('Order created');
                        this.props.history.push('/order/' + someNumber);
                    }
                ).catch(
                    err => {
                        this.setState({ serviceUnavailable: true })
                        console.log(err.code);
                        console.log(err.message);
                        console.log(err.stack);
                    }
                );
            }
        }
    }

    showShippingForm() {
        if(document.getElementById('shipping').style.display === "none") {
            document.getElementById('shipping').style.display = "block";
            document.getElementById('cart').style.marginBottom = "0";
        }
        else {
            document.getElementById('shipping').style.display = "none";
            document.getElementById('cart').style.marginBottom = "140px";
        }
    }

    render() {
        if(this.serviceUnavailable === true) {
            return(<ServiceUnavailable />);
        } else {
            if(this.state.cartItems.length > 0) {
                return(
                    <div>
                        <div className="cart-table" id="cart">
                            <br></br>
        
                            {this.renderCartItemsTable()}
    
                            <hr></hr>
                            <hr></hr>
                            
                            {this.renderCartTotal()}
                            
                            <div>
                                <a href="#shipping-form"><button type="button" className="btn btn-success" onClick={() => this.showShippingForm()}>
                                Proceed to Checkout</button></a>
                            </div>
                        </div>
                        {this.renderShippingForm()}
                    </div>
                );
            } else {
                return(<Loader />);
            }
        }
    }
}

export default Cart

/**
<div className="service-unavailable">
    <br></br>
    It seems, there are no items in the Cart yet 😟
    <br></br>
    Have a look into our Collection.
</div>
 */