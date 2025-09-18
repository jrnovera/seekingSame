import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { FaEye, FaEyeSlash, FaHome, FaUpload, FaIdCard } from 'react-icons/fa';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    idPhoto: null
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [idPreview, setIdPreview] = useState(null);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleIdUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a valid ID document (JPG, PNG, or PDF)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setFormData({
        ...formData,
        idPhoto: file
      });

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setIdPreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setIdPreview(null);
      }
    }
  };

  const uploadIdPhoto = async (file, userId) => {
    if (!file) return null;
    
    const idRef = ref(storage, `user-ids/${userId}_${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(idRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.phoneNumber) {
      toast.error('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (!formData.idPhoto) {
      toast.error('Please upload your ID document');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      // Upload ID photo first
      toast.info('Uploading ID photo...');
      const tempUserId = `temp_${Date.now()}`;
      const idUrl = await uploadIdPhoto(formData.idPhoto, tempUserId);
      
      // Create account with ID photo URL and phone number
      const result = await signup(formData.name, formData.email, formData.password, formData.phoneNumber, idUrl);
      
      if (result.success) {
        toast.success('Account created successfully with host role!');
        navigate('/');
      } else {
        toast.error(result.error || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An error occurred during signup');
    }
    
    setLoading(false);
  };

  return (
    <Container>
      <FormWrapper>
        <Header>
          <LogoImage src="/assets/images/logo.png" alt="Logo" />
          <Title>seeking same</Title>
          <Subtitle>Create your admin account</Subtitle>
        </Header>
        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Full Name</Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>Email Address</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>Phone Number</Label>
            <Input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>Password</Label>
            <PasswordWrapper>
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
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

          <InputGroup>
            <Label>Confirm Password</Label>
            <PasswordWrapper>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </PasswordToggle>
            </PasswordWrapper>
          </InputGroup>

          <InputGroup>
            <Label>
              <FaIdCard style={{ marginRight: '8px' }} />
              ID Document Upload
            </Label>
            <IdUploadContainer>
              <IdUploadInput
                type="file"
                id="id-upload"
                accept="image/*,.pdf"
                onChange={handleIdUpload}
                required
              />
              <IdUploadLabel htmlFor="id-upload">
                <FaUpload />
                {formData.idPhoto ? formData.idPhoto.name : 'Choose ID Document'}
              </IdUploadLabel>
            </IdUploadContainer>
            <IdUploadHint>
              Upload a clear photo of your government-issued ID (JPG, PNG, or PDF, max 5MB)
            </IdUploadHint>
            {idPreview && (
              <IdPreview>
                <img src={idPreview} alt="ID Preview" />
              </IdPreview>
            )}
            {formData.idPhoto && formData.idPhoto.type === 'application/pdf' && (
              <PdfInfo>
                <FaIdCard />
                PDF uploaded: {formData.idPhoto.name}
              </PdfInfo>
            )}
          </InputGroup>

          <Button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </Form>

        <Footer>
          Already have an account? <Link to="/login">Sign in</Link>
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

const IdUploadContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

const IdUploadInput = styled.input`
  display: none;
`;

const IdUploadLabel = styled.label`
  background: #f8f9fa;
  border: 2px dashed #e1e5e9;
  color: #666;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  flex: 1;
  justify-content: center;

  &:hover {
    background: #e9ecef;
    border-color: #cb54f8;
    color: #cb54f8;
  }
`;

const IdUploadHint = styled.p`
  font-size: 12px;
  color: #666;
  margin: 5px 0 10px 0;
  line-height: 1.4;
`;

const IdPreview = styled.div`
  margin-top: 10px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e1e5e9;
  max-width: 200px;

  img {
    width: 100%;
    height: 120px;
    object-fit: cover;
    display: block;
  }
`;

const PdfInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
  margin-top: 10px;
  color: #666;
  font-size: 14px;

  svg {
    color: #cb54f8;
  }
`;

const LogoImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 15px;
`;

export default Signup;
