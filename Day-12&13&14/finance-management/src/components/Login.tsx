import { useState } from 'react';
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router';
import AuthLayout from './AuthLayout';
import { userLogin } from '../utils/axios-utils';
import { useJwt } from "react-jwt";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    let navigate = useNavigate();

    const handleLogin = () => {
        if (!email) {
            alert("Email is mandatory")
            return;
        }
        if (!password) {
            alert("Password is mandatory")
            return;
        }
        
        setLoading(true);

        userLogin({email, password}).then((response: any) => {
            localStorage.setItem("token", response.data.token);
            // const { decodedToken } = useJwt(response.data.token);
            // localStorage.setItem("userInfo", JSON.stringify(decodedToken))
            navigate("/home");
        })
        .catch(err => {
            console.error(err);
            alert("Invalid password");
        })
        .finally(() => {
            console.log("Login API is complete");
            setLoading(false);
        });
    }

    return (
        <AuthLayout title="Welcome Back!">
            <Form>
                <Form.Group className="mb-3" controlId="formGroupEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control 
                        type="email" 
                        placeholder="Enter email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGroupPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                    />
                </Form.Group>
                <div className="text-center">
                    <Button 
                        type="button" 
                        className="btn btn-primary" 
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                </div>
                <div className="text-center">
                    <Link to={"/sign-up"}>New? Click to sign-up</Link>
                </div>
            </Form>
        </AuthLayout>
    )
}

export default Login;