import React, { useState } from 'react';
import { Card, CardBody, Row, Container } from 'reactstrap';
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, increaseQuantity, decreaseQuantity } from "../Redux/cartSlice";
import { Link } from 'react-router-dom';
import axios from 'axios';


const Cart = () => {
    const [orderId, setOrderId] = useState(null);
    const dispatch = useDispatch()
    const cartItems = useSelector((state) => state.cart.items);
    const amount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const totalQuantity = cartItems.reduce((total, item) => { return total + item.quantity; }, 0);

    const handleRemoveItem = (productId) => {
        dispatch(removeFromCart(productId));
    }

    const handleIncreaseQuantity = (productId) => {
        dispatch(increaseQuantity(productId));
    };

    const handleDecreaseQuantity = (productId) => {
        dispatch(decreaseQuantity(productId));

    };

    const handleCheckout = async () => {
        try {
            const res = await axios.post("/order", { amount });
            const orderId = res.data.data.id;
            console.log("orderId:", orderId);
            setOrderId(orderId);

            const options = {
                key: 'rzp_test_hBcE1HSEv7PAgW',
                amount: amount * 100,
                currency: "INR",
                name: "T-Shirt Store",
                description: "Payment for your shopping.",
                order_id: orderId,
                handler: async () => {
                    try {
                        const orderVerify = await axios.post('/verify');
                        console.log(orderVerify);
                    } catch (error) {
                        console.log(error);
                    }
                },
                prefill: {
                    name: "Krishna Kumar",
                    email: "krishnakmr@968.com",
                    contact: "+917677263000",
                },
                notes: {
                    address: "Razorpay Corporate Office",
                },
                theme: {
                    color: "#61dafb",
                },
            };
            console.log(options);

            const rzp = new window.Razorpay(options);
            rzp.open();

            // function waitForRazorpay(callback) {
            //     console.log('Waiting for Razorpay...');
            //     if (window.Razorpay) {
            //         console.log('Razorpay loaded!');

            //         callback();
            //     } else {
            //         setTimeout(function () {
            //             waitForRazorpay(callback);
            //         }, 100);
            //     }
            // }
            // waitForRazorpay(function () {
            //     const rzp = new window.Razorpay(options);
            //     console.log(rzp);
            //     rzp.open();
            // });

        } catch (error) {
            console.log(`error in razorpay popup ${error}`);
        }
    };





    return (
        <>
            <Row>
                <Container className='col-md-8'>
                    {
                        cartItems && cartItems.length > 0 ? (
                            <Card className='m-3'>
                                <CardBody className='d-flex justify-content-around'>
                                    <div><b>IMAGE</b></div>
                                    <div><b>PRODUCT</b></div>
                                    <div><b>PRICE</b></div>
                                    <div><b>Quantity</b></div>
                                    <div><b>REMOVE</b></div>
                                </CardBody>
                            </Card>
                        ) :
                            ""
                    }
                    {
                        cartItems && cartItems.length === 0 ? (
                            <Card className='w-50 mx-auto mt-5 border border-2 border-warning'>
                                <CardBody>
                                    <h3>No items in your cart !</h3>
                                    <button className='btn btn-dark mt-3'> <Link to='/' className='text-decoration-none text-light'>Back Home</Link> </button>
                                </CardBody>
                            </Card>
                        ) : (
                            cartItems.map((product) => (
                                <Card key={product.id} className='m-3'>
                                    <CardBody className="d-flex justify-content-around">
                                        <img src={product.image} alt="cartImg" className='rounded' style={{ width: '4rem' }} />
                                        <div >
                                            <h5 className=' mx-3 mt-4'>{product.name}</h5>
                                        </div>
                                        <h5 className=' mx-3 mt-4' >${product.price}</h5>
                                        <h5 className=' mx-3 mt-4' >({product.quantity})</h5>
                                        <div className=' mx-3 mt-3'>
                                            <button className='btn btn-success mx-2' onClick={() => handleDecreaseQuantity(product.id)}>-</button>
                                            <button className='btn btn-primary' onClick={() => handleIncreaseQuantity(product.id)}>+</button>
                                            <button className="btn text-danger rounded-circle btn-lg" onClick={() => handleRemoveItem(product.id)}><i className="fas fa-trash fs-2"></i></button>
                                        </div>
                                    </CardBody>
                                </Card>
                            ))
                        )
                    }
                </Container>
                {
                    cartItems && cartItems.length > 0 ? (
                        <Container className='col-md-4 mt-3'>
                            <Card>
                                <CardBody>
                                    <h3 className='mb-4'>CART SUMMARY</h3>
                                    <div className='d-flex flex-row justify-content-around'>
                                        <div><h5 className='mt-4 mb-2'>Number Of Items :</h5></div>
                                        <div><h5 className='mt-4 mb-2'>{cartItems.length}</h5></div>
                                    </div>
                                    <div className='d-flex flex-row justify-content-around'>
                                        <div><h5 className='mt-4 mb-2'>Total Quantity :</h5></div>
                                        <div><h5 className='mt-4 mb-2'>{totalQuantity}</h5></div>
                                    </div>
                                    <div className='d-flex justify-content-around mb-3'>
                                        <div><h5 className='mt-4 mb-2'>Total Amount :</h5></div>
                                        <div><h5 className='mt-4 mb-2'><h2>${amount}</h2> </h5></div>
                                    </div>
                                    {/* <button className='btn btn-warning' onClick={handleCheckout}><h5>Checkout</h5></button> */}
                                    {orderId ? (
                                        <form action="/success" method="POST">
                                            <script
                                                src="https://checkout.razorpay.com/v1/checkout.js"
                                                data-key={'rzp_test_hBcE1HSEv7PAgW'}
                                                data-amount={amount * 100}
                                                data-currency="INR"
                                                data-order_id={orderId}
                                                data-buttontext="Pay with Razorpay"
                                            ></script>
                                        </form>
                                    ) : (
                                        <button className='btn btn-warning' onClick={handleCheckout}><h5>Checkout</h5></button>
                                    )}

                                </CardBody>
                            </Card>
                        </Container>
                    )
                        :
                        ""
                }
            </Row>
        </>
    );
}

export default Cart;
