import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../Redux/authSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Container, Card, CardBody, Button, Input, Label } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
// import { set, get } from 'react-cookies';
import Cookie from 'js-cookie';

const Login = () => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("admin@admin.com");
    const [password, setPassword] = useState("password");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/login', { email, password });
            dispatch(login(res.data));
            Cookie.set('token', res.data.token, { httpOnly: true });
            localStorage.setItem("user", JSON.stringify(res.data.user));
            navigate("/");
            toast.success("Login Success");
        } catch (error) {
            console.error(error);
            toast.error("Invalid credentials");
        }
    };

    return (
        <>
            <ToastContainer />
            <Container className='mt-5' style={{ width: '30rem' }}>
                <Card className="border m-2 p-4 shadow-lg bg-white rounded">
                    <CardBody>
                        <h2>Login Form</h2>
                        <Form onSubmit={handleLogin} className='mt-5'>
                            <div className='d-flex flex-column justify-content-start align-items-start'>
                                <Label htmlFor="email">Email</Label>
                                <Input type="email" placeholder='Enter Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className='d-flex flex-column justify-content-start align-items-start mt-3'>
                                <Label htmlFor="password">Password</Label>
                                <Input type="password" placeholder='Enter Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <Button className='bg-primary mt-4 mb-3 w-100' type="submit">Login</Button>
                            <p>Don't have Account <Link to="/signup">Create New Account</Link></p>
                            <p><Link to='/forgetPassword'>Forget Password </Link></p>
                        </Form>
                    </CardBody>
                </Card>
            </Container>
        </>
    )

}

export default Login;
