import { useState } from 'react';
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router';
import AuthLayout from './AuthLayout';

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
        
        const usersData = localStorage.getItem("users");
        if (!usersData) {
            alert("No users found");
            setLoading(false);
            return;
        }
        
        const users = JSON.parse(usersData);
        const userInfo = users.find((user: { email: string; password: string }) => user.email === email);
        
        if (!userInfo) {
            alert("User not found");
            setLoading(false);
            return;
        }
        
        if (userInfo.password === password) {
            localStorage.setItem("userInfo", JSON.stringify(userInfo))
            navigate("/home")
        } else {
            alert("Invalid password");
            setLoading(false);
        }
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