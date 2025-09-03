import React, { useState } from 'react';
import styled from 'styled-components';
import { FaUser, FaBell, FaLock, FaPalette, FaSave, FaEdit } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    company: '',
    address: ''
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    weeklyReports: true,
    maintenanceAlerts: true,
    paymentReminders: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorAuth: false
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD'
  });

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleNotificationChange = (e) => {
    setNotificationSettings({
      ...notificationSettings,
      [e.target.name]: e.target.checked
    });
  };

  const handleSecurityChange = (e) => {
    setSecuritySettings({
      ...securitySettings,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
    });
  };

  const handleAppearanceChange = (e) => {
    setAppearanceSettings({
      ...appearanceSettings,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    // In real app, this would make an API call
    toast.success('Profile updated successfully');
  };

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    toast.success('Notification preferences updated');
  };

  const handleSaveSecurity = (e) => {
    e.preventDefault();
    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    toast.success('Security settings updated');
    setSecuritySettings({
      ...securitySettings,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleSaveAppearance = (e) => {
    e.preventDefault();
    toast.success('Appearance settings updated');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FaUser },
    { id: 'notifications', label: 'Notifications', icon: FaBell },
    { id: 'security', label: 'Security', icon: FaLock },
    { id: 'appearance', label: 'Appearance', icon: FaPalette }
  ];

  return (
    <SettingsContainer>
      <Header>
        <Title>Settings</Title>
      </Header>

      <SettingsContent>
        <Sidebar>
          {tabs.map(tab => (
            <TabButton
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon />
              <span>{tab.label}</span>
            </TabButton>
          ))}
        </Sidebar>

        <MainContent>
          {activeTab === 'profile' && (
            <SettingsSection>
              <SectionTitle>Profile Information</SectionTitle>
              <Form onSubmit={handleSaveProfile}>
                <FormRow>
                  <FormGroup>
                    <Label>Full Name</Label>
                    <Input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      placeholder="Enter your full name"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Email Address</Label>
                    <Input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      placeholder="Enter your email"
                    />
                  </FormGroup>
                </FormRow>
                <FormRow>
                  <FormGroup>
                    <Label>Phone Number</Label>
                    <Input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      placeholder="Enter your phone number"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Company</Label>
                    <Input
                      type="text"
                      name="company"
                      value={profileData.company}
                      onChange={handleProfileChange}
                      placeholder="Enter your company name"
                    />
                  </FormGroup>
                </FormRow>
                <FormRow>
                  <FormGroup>
                    <Label>Address</Label>
                    <TextArea
                      name="address"
                      value={profileData.address}
                      onChange={handleProfileChange}
                      placeholder="Enter your address"
                      rows="3"
                    />
                  </FormGroup>
                </FormRow>
                <SaveButton type="submit">
                  <FaSave /> Save Profile
                </SaveButton>
              </Form>
            </SettingsSection>
          )}

          {activeTab === 'notifications' && (
            <SettingsSection>
              <SectionTitle>Notification Preferences</SectionTitle>
              <Form onSubmit={handleSaveNotifications}>
                <SettingsGroup>
                  <GroupTitle>General Notifications</GroupTitle>
                  <CheckboxGroup>
                    <Checkbox>
                      <input
                        type="checkbox"
                        name="emailNotifications"
                        checked={notificationSettings.emailNotifications}
                        onChange={handleNotificationChange}
                      />
                      <CheckboxLabel>Email Notifications</CheckboxLabel>
                    </Checkbox>
                    <Checkbox>
                      <input
                        type="checkbox"
                        name="pushNotifications"
                        checked={notificationSettings.pushNotifications}
                        onChange={handleNotificationChange}
                      />
                      <CheckboxLabel>Push Notifications</CheckboxLabel>
                    </Checkbox>
                    <Checkbox>
                      <input
                        type="checkbox"
                        name="smsNotifications"
                        checked={notificationSettings.smsNotifications}
                        onChange={handleNotificationChange}
                      />
                      <CheckboxLabel>SMS Notifications</CheckboxLabel>
                    </Checkbox>
                  </CheckboxGroup>
                </SettingsGroup>

                <SettingsGroup>
                  <GroupTitle>Property Notifications</GroupTitle>
                  <CheckboxGroup>
                    <Checkbox>
                      <input
                        type="checkbox"
                        name="weeklyReports"
                        checked={notificationSettings.weeklyReports}
                        onChange={handleNotificationChange}
                      />
                      <CheckboxLabel>Weekly Reports</CheckboxLabel>
                    </Checkbox>
                    <Checkbox>
                      <input
                        type="checkbox"
                        name="maintenanceAlerts"
                        checked={notificationSettings.maintenanceAlerts}
                        onChange={handleNotificationChange}
                      />
                      <CheckboxLabel>Maintenance Alerts</CheckboxLabel>
                    </Checkbox>
                    <Checkbox>
                      <input
                        type="checkbox"
                        name="paymentReminders"
                        checked={notificationSettings.paymentReminders}
                        onChange={handleNotificationChange}
                      />
                      <CheckboxLabel>Payment Reminders</CheckboxLabel>
                    </Checkbox>
                  </CheckboxGroup>
                </SettingsGroup>

                <SaveButton type="submit">
                  <FaSave /> Save Notifications
                </SaveButton>
              </Form>
            </SettingsSection>
          )}

          {activeTab === 'security' && (
            <SettingsSection>
              <SectionTitle>Security Settings</SectionTitle>
              <Form onSubmit={handleSaveSecurity}>
                <SettingsGroup>
                  <GroupTitle>Change Password</GroupTitle>
                  <FormGroup>
                    <Label>Current Password</Label>
                    <Input
                      type="password"
                      name="currentPassword"
                      value={securitySettings.currentPassword}
                      onChange={handleSecurityChange}
                      placeholder="Enter current password"
                    />
                  </FormGroup>
                  <FormRow>
                    <FormGroup>
                      <Label>New Password</Label>
                      <Input
                        type="password"
                        name="newPassword"
                        value={securitySettings.newPassword}
                        onChange={handleSecurityChange}
                        placeholder="Enter new password"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Confirm New Password</Label>
                      <Input
                        type="password"
                        name="confirmPassword"
                        value={securitySettings.confirmPassword}
                        onChange={handleSecurityChange}
                        placeholder="Confirm new password"
                      />
                    </FormGroup>
                  </FormRow>
                </SettingsGroup>

                <SettingsGroup>
                  <GroupTitle>Two-Factor Authentication</GroupTitle>
                  <Checkbox>
                    <input
                      type="checkbox"
                      name="twoFactorAuth"
                      checked={securitySettings.twoFactorAuth}
                      onChange={handleSecurityChange}
                    />
                    <CheckboxLabel>Enable Two-Factor Authentication</CheckboxLabel>
                  </Checkbox>
                </SettingsGroup>

                <SaveButton type="submit">
                  <FaSave /> Update Security
                </SaveButton>
              </Form>
            </SettingsSection>
          )}

          {activeTab === 'appearance' && (
            <SettingsSection>
              <SectionTitle>Appearance & Preferences</SectionTitle>
              <Form onSubmit={handleSaveAppearance}>
                <FormRow>
                  <FormGroup>
                    <Label>Theme</Label>
                    <Select
                      name="theme"
                      value={appearanceSettings.theme}
                      onChange={handleAppearanceChange}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </Select>
                  </FormGroup>
                  <FormGroup>
                    <Label>Language</Label>
                    <Select
                      name="language"
                      value={appearanceSettings.language}
                      onChange={handleAppearanceChange}
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </Select>
                  </FormGroup>
                </FormRow>
                <FormRow>
                  <FormGroup>
                    <Label>Date Format</Label>
                    <Select
                      name="dateFormat"
                      value={appearanceSettings.dateFormat}
                      onChange={handleAppearanceChange}
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </Select>
                  </FormGroup>
                  <FormGroup>
                    <Label>Currency</Label>
                    <Select
                      name="currency"
                      value={appearanceSettings.currency}
                      onChange={handleAppearanceChange}
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="CAD">CAD ($)</option>
                    </Select>
                  </FormGroup>
                </FormRow>
                <SaveButton type="submit">
                  <FaSave /> Save Preferences
                </SaveButton>
              </Form>
            </SettingsSection>
          )}
        </MainContent>
      </SettingsContent>
    </SettingsContainer>
  );
};

const SettingsContainer = styled.div`
  padding: 0;
`;

const Header = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const SettingsContent = styled.div`
  display: flex;
  gap: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const Sidebar = styled.div`
  width: 250px;
  background: white;
  border-radius: 12px;
  padding: 20px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  height: fit-content;

  @media (max-width: 768px) {
    width: 100%;
    display: flex;
    overflow-x: auto;
    padding: 15px;
    gap: 10px;
  }
`;

const TabButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 20px;
  border: none;
  background: ${props => props.active ? '#f6e6fe' : 'transparent'};
  color: ${props => props.active ? '#cb54f8' : '#666'};
  font-size: 16px;
  font-weight: ${props => props.active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 3px solid ${props => props.active ? '#cb54f8' : 'transparent'};

  &:hover {
    background: #f9f1ff;
    color: #cb54f8;
  }

  @media (max-width: 768px) {
    width: auto;
    white-space: nowrap;
    border-left: none;
    border-bottom: 3px solid ${props => props.active ? '#cb54f8' : 'transparent'};
    border-radius: 8px;
    
    span {
      display: none;
    }
  }
`;

const MainContent = styled.div`
  flex: 1;
`;

const SettingsSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 25px 0;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const FormGroup = styled.div`
  flex: 1;
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

const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #cb54f8;
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #cb54f8;
  }
`;

const SettingsGroup = styled.div`
  padding: 20px 0;
  border-bottom: 1px solid #e9ecef;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const GroupTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 15px 0;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Checkbox = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
`;

const CheckboxLabel = styled.span`
  font-size: 16px;
  color: #333;
`;

const SaveButton = styled.button`
  background: #cb54f8;
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
  transition: background-color 0.2s;

  &:hover {
    background: #b13be0;
  }

  @media (max-width: 480px) {
    width: 100%;
    justify-content: center;
  }
`;

export default Settings;
