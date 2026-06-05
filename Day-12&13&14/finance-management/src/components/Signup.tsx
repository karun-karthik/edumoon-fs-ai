import { useState } from 'react';
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router';
import { useNavigate } from "react-router";
import AuthLayout from './AuthLayout';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    let navigate = useNavigate();

    const handleSignUp = () => {
        if (!email) {
            alert("Email is mandatory")
            return;
        }
        if (!password) {
            alert("Password is mandatory")
            return;
        }
        if (!confirmPassword) {
            alert("Password is not confirmed")
            return;
        }
        if (password !== confirmPassword) {
            alert("Passwords don't match!")
            return;
        }
        
        setLoading(true);
        
        const userItems = localStorage.getItem("users");
        let users = [];
        if (userItems != null) {
            users = JSON.parse(userItems);
        }
        
        // Check if email already exists
        if (users.some((user: { email: string }) => user.email === email)) {
            alert("Email already registered");
            setLoading(false);
            return;
        }
        
        users = [...users, {
            "email": email,
            "password": password
        }];
        localStorage.setItem("users", JSON.stringify(users))
        alert("Signup successful!")
        navigate("/login");
    }

    const isPasswordMatch = password === confirmPassword && confirmPassword !== '';

    return (
        <AuthLayout title="Create Account">
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
                        minLength={8} 
                        placeholder="Min 8 characters" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGroupConfirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Re-enter password" 
                        minLength={8} 
                        isInvalid={!isPasswordMatch && confirmPassword !== ''} 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={loading}
                    />
                    {!isPasswordMatch && confirmPassword !== '' && (
                        <Form.Control.Feedback type="invalid">
                            Passwords do not match
                        </Form.Control.Feedback>
                    )}
                </Form.Group>
                <div className="text-center">
                    <Button 
                        type="button" 
                        className="btn btn-primary" 
                        onClick={handleSignUp}
                        disabled={loading}
                    >
                        {loading ? 'Creating account...' : 'Sign up'}
                    </Button>
                </div>
                <div className="text-center">
                    <Link to={"/login"}>Already have an account? Click to login</Link>
                </div>
            </Form>
        </AuthLayout>
    )
}

export default Signup;