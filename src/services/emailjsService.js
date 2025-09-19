import emailjs from '@emailjs/browser';

// Initialize EmailJS with your service ID
const SERVICE_ID = 'service_qvuhtw7'; // Your EmailJS Service ID
const TEMPLATE_ID = 'template_577hpn8'; // Replace with your EmailJS Template ID (get this from Email Templates)
const PUBLIC_KEY = '4_WI4ymoMuYcyGhlM'; // Your EmailJS Public Key

// Initialize EmailJS
emailjs.init(PUBLIC_KEY);

// Send verification email when admin verifies a user
export const sendVerificationEmail = async (userEmail, userName) => {
  console.log("check userEmail:", userEmail)
  console.log("check userName:", userName)
  try {
    const templateParams = {
      email: userEmail,  // Changed from 'to_email' to 'email' to match template
      to_name: userName || 'Valued User',
      from_name: 'Seeking Same Admin',  // This will appear as the sender name
      app_url: process.env.REACT_APP_URL || window.location.origin,
      login_url: `${process.env.REACT_APP_URL || window.location.origin}/login`
    };

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams
    );

    console.log('Verification email sent:', response);
    return { success: true, messageId: response.text };
    
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error: error.message };
  }
};

// Test email configuration
export const testEmailConnection = async () => {
  try {
    // Test with a dummy email
    const result = await sendVerificationEmail('test@example.com', 'Test User');
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
};
