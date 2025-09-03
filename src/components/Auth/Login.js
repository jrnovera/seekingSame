import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { FaEye, FaEyeSlash, FaHome } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      toast.error('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const result = await login(email, password);
      
      if (result.success) {
        toast.success('Login successful!');
        // Navigation will happen automatically via the useEffect when user state updates
        // No need to call navigate('/') here
      } else {
        toast.error(result.error || 'Login failed');
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.message || 'An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <Container>
      <FormWrapper>
        <Header>
          <LogoImage src="/assets/images/logo.png" alt="Logo" />
          <Title>seeking same</Title>
          <Subtitle>Sign in to your account</Subtitle>
        </Header>
        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Email Address</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>Password</Label>
            <PasswordWrapper>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </PasswordToggle>
            </PasswordWrapper>
          </InputGroup>

          <Button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </Form>

        <Footer>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </Footer>
      </FormWrapper>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #cb54f8;
  padding: 20px;
`;

const FormWrapper = styled.div`
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;

  @media (max-width: 480px) {
    padding: 30px 20px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: #333;
  margin: 10px 0 5px;
  font-size: 28px;
  font-weight: 700;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 16px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #333;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #cb54f8;
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;

  &:hover {
    color: #cb54f8;
  }
`;

const Button = styled.button`
  background: #cb54f8;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 10px;

  &:hover:not(:disabled) {
    background: #b13be0;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const Footer = styled.p`
  text-align: center;
  margin-top: 20px;
  color: #666;

  a {
    color: #cb54f8;
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const LogoImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 15px;
`;

export default Login;
