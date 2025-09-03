import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { FaTimes, FaSave, FaEdit, FaUpload, FaMapMarkerAlt } from 'react-icons/fa';
import MapPicker from './MapPicker';
import { GOOGLE_MAPS_API_KEY } from '../../config/mapConfig';

const PropertyModal = ({ isOpen, onClose, onSave, property, mode }) => {
  const [formData, setFormData] = useState({
    name: '',
    descriptions: '',
    email: '',
    phoneNumber: '',
    cities: '',
    capacity: 1,
    categories: 'Room',
    price: '',
    deposit: '',
    bathroomType: 'Private',
    bedroomCount: 1,
    BathRoomCount: 1,
    preferences: [],
    isAvailable: true,
    photo: 'https://via.placeholder.com/300x200',
    imageFile: null,
    location: {
      latitude: '',
      longitude: ''
    },
    address: {
      street: '',
      unit: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    }
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [mapInteractive, setMapInteractive] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);

  useEffect(() => {
    if (property && (mode === 'edit' || mode === 'view')) {
      setFormData({
        name: property.name || '',
        descriptions: property.descriptions || '',
        email: property.email || '',
        phoneNumber: property.phoneNumber || '',
        cities: property.cities || '',
        capacity: property.capacity || 1,
        categories: property.categories || 'Room',
        price: property.price || '',
        deposit: property.deposit || '',
        bathroomType: property.bathroomType || 'Private',
        bedroomCount: property.bedroomCount || 1,
        BathRoomCount: property.BathRoomCount || 1,
        preferences: property.preferences || [],
        isAvailable: property.isAvailable !== false,
        photo: property.photo || 'https://via.placeholder.com/300x200',
        imageFile: null,
        location: property.location || {
          latitude: '',
          longitude: ''
        },
        address: property.address || {
          street: '',
          unit: '',
          city: property.cities || '',
          state: '',
          zipCode: '',
          country: 'United States'
        }
      });
      setImagePreview(null);
    } else if (mode === 'create') {
      setFormData({
        name: '',
        descriptions: '',
        email: '',
        phoneNumber: '',
        cities: '',
        capacity: 1,
        categories: 'Room',
        price: '',
        deposit: '',
        bathroomType: 'Private',
        bedroomCount: 1,
        BathRoomCount: 1,
        preferences: [],
        isAvailable: true,
        photo: 'https://via.placeholder.com/300x200',
        imageFile: null,
        location: {
          latitude: '',
          longitude: ''
        },
        address: {
          street: '',
          unit: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'United States'
        }
      });
      setImagePreview(null);
    }
  }, [property, mode, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle address fields (they will have name format like "address.street")
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      // Handle regular fields
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked :
                name === 'capacity' || name === 'bedroomCount' || name === 'BathRoomCount' || name === 'price' || name === 'deposit' 
                  ? parseFloat(value) || 0 
                  : value
      }));
    }
  };
  
  // Generate map URL based on address or coordinates
  const mapUrl = useMemo(() => {
    if (mode === 'view') return null;
    
    // If we have valid coordinates, use those for the map
    if (formData.location && formData.location.latitude && formData.location.longitude) {
      const { latitude, longitude } = formData.location;
      return `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
    }
    
    // Otherwise use the address
    if (formData.address) {
      const { street, city, state, zipCode, country } = formData.address;
      if (!street || !city) return null;
      
      const addressString = encodeURIComponent(
        `${street}, ${city}${state ? `, ${state}` : ''}${zipCode ? ` ${zipCode}` : ''}${country ? `, ${country}` : ''}`
      );
      
      return `https://maps.google.com/maps?q=${addressString}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }
    
    return null;
  }, [formData.address, formData.location, mode]);
  
  // Function to handle map click and open the map picker
  const handleMapClick = () => {
    if (mode === 'view') return;
    setShowMapPicker(true);
  };
  
  // Handle location selection from the map picker
  const handleLocationSelect = (locationData) => {
    // Update coordinates
    setFormData(prev => ({
      ...prev,
      location: {
        latitude: locationData.coordinates.lat.toString(),
        longitude: locationData.coordinates.lng.toString()
      },
      // Update address fields from reverse geocoding
      address: {
        ...prev.address,
        street: locationData.address.street || prev.address.street,
        unit: locationData.address.unit || prev.address.unit,
        city: locationData.address.city || prev.address.city,
        state: locationData.address.state || prev.address.state,
        zipCode: locationData.address.zipCode || prev.address.zipCode,
        country: locationData.address.country || prev.address.country
      }
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        imageFile: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode !== 'view') {
      onSave(formData);
    }
  };

  const getModalTitle = () => {
    switch (mode) {
      case 'create':
        return 'Add New Property';
      case 'edit':
        return 'Edit Property';
      case 'view':
        return 'Property Details';
      default:
        return 'Property';
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen} onClick={(e) => {
      // Only close if clicking directly on the overlay, not its children
      if (e.target === e.currentTarget && !showMapPicker) {
        onClose();
      }
    }}>
      {showMapPicker && (
        <MapPicker
          apiKey={GOOGLE_MAPS_API_KEY}
          initialLocation={formData.location.latitude && formData.location.longitude ? {
            lat: parseFloat(formData.location.latitude),
            lng: parseFloat(formData.location.longitude)
          } : null}
          address={formData.address}
          onLocationSelect={handleLocationSelect}
          onClose={() => setShowMapPicker(false)}
        />
      )}
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{getModalTitle()}</ModalTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormRow>
              <FormGroup>
                <Label>Property Name</Label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter property name"
                  required
                  disabled={mode === 'view'}
                />
              </FormGroup>
            </FormRow>

            <FormSection>
              <SectionTitle>Address Information</SectionTitle>
              <FormRow>
                <FormGroup>
                  <Label>Street Address</Label>
                  <Input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleChange}
                    placeholder="123 Main St"
                    required
                    disabled={mode === 'view'}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Unit/Apt # (Optional)</Label>
                  <Input
                    type="text"
                    name="address.unit"
                    value={formData.address.unit}
                    onChange={handleChange}
                    placeholder="Apt 4B"
                    disabled={mode === 'view'}
                  />
                </FormGroup>
              </FormRow>
              
              <FormRow>
                <FormGroup>
                  <Label>City</Label>
                  <Input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    required
                    disabled={mode === 'view'}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>State/Province</Label>
                  <Input
                    type="text"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleChange}
                    placeholder="CA"
                    required
                    disabled={mode === 'view'}
                  />
                </FormGroup>
              </FormRow>
              
              <FormRow>
                <FormGroup>
                  <Label>ZIP/Postal Code</Label>
                  <Input
                    type="text"
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleChange}
                    placeholder="90210"
                    required
                    disabled={mode === 'view'}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Country</Label>
                  <Select
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleChange}
                    disabled={mode === 'view'}
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="Other">Other</option>
                  </Select>
                </FormGroup>
              </FormRow>
              
              
              {mode !== 'view' && (
                <MapPickerButton type="button" onClick={handleMapClick}>
                  <FaMapMarkerAlt /> Select Location on Map
                </MapPickerButton>
              )}
              
              {mapUrl && (
                <MapPreviewContainer>
                  <MapPreviewTitle>
                    <FaMapMarkerAlt /> Location Preview
                  </MapPreviewTitle>
                  <MapFrame 
                    src={mapUrl}
                    frameBorder="0"
                    scrolling="no"
                    loading="lazy"
                    title="Google Maps Location Preview"
                    onLoad={() => setMapLoaded(true)}
                  />
                  <MapNote>
                    {formData.location.latitude && formData.location.longitude 
                      ? (
                        <>
                          <strong>Selected Location:</strong> 
                          <CoordinateDisplay>
                            {formData.location.latitude}, {formData.location.longitude}
                          </CoordinateDisplay>
                        </>
                      ) 
                      : "This preview is based on the address you entered"}
                  </MapNote>
                </MapPreviewContainer>
              )}
            </FormSection>

            <FormRow>
              <FormGroup>
                <Label>City (Display Name)</Label>
                <Input
                  type="text"
                  name="cities"
                  value={formData.cities}
                  onChange={handleChange}
                  placeholder="Enter city for display"
                  required
                  disabled={mode === 'view'}
                />
              </FormGroup>
              <FormGroup>
                <Label>Category</Label>
                <Select
                  name="categories"
                  value={formData.categories}
                  onChange={handleChange}
                  disabled={mode === 'view'}
                >
                  <option value="Room">Room</option>
                  <option value="Whole place">Whole place</option>
                  <option value="Co-living">Co-living</option>
                  <option value="Co-housing">Co-housing</option>
                  <option value="RV Space">RV Space</option>
                  <option value="Other Type">Other Type</option>
                </Select>
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label>Price ($)</Label>
                <Input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0"
                  required
                  disabled={mode === 'view'}
                />
              </FormGroup>
              <FormGroup>
                <Label>Deposit ($)</Label>
                <Input
                  type="number"
                  name="deposit"
                  value={formData.deposit}
                  onChange={handleChange}
                  placeholder="0"
                  disabled={mode === 'view'}
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label>Bedroom Count</Label>
                <Select
                  name="bedroomCount"
                  value={formData.bedroomCount}
                  onChange={handleChange}
                  disabled={mode === 'view'}
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Bathroom Count</Label>
                <Select
                  name="BathRoomCount"
                  value={formData.BathRoomCount}
                  onChange={handleChange}
                  disabled={mode === 'view'}
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </Select>
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label>Capacity</Label>
                <Input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="1"
                  min="1"
                  disabled={mode === 'view'}
                />
              </FormGroup>
              <FormGroup>
                <Label>Bathroom Type</Label>
                <Select
                  name="bathroomType"
                  value={formData.bathroomType}
                  onChange={handleChange}
                  disabled={mode === 'view'}
                >
                  <option value="Private">Private</option>
                  <option value="Shared">Shared</option>
                </Select>
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@example.com"
                  disabled={mode === 'view'}
                />
              </FormGroup>
              <FormGroup>
                <Label>Phone Number</Label>
                <Input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+1234567890"
                  disabled={mode === 'view'}
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <AvailabilityContainer>
                  <CheckboxInput
                    type="checkbox"
                    id="isAvailable"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleChange}
                    disabled={mode === 'view'}
                  />
                  <CheckboxLabel htmlFor="isAvailable">
                    Available for rent
                  </CheckboxLabel>
                </AvailabilityContainer>
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label>Property Image</Label>
                {mode !== 'view' && (
                  <>
                    <ImageUploadContainer>
                      <ImageUploadInput
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <ImageUploadLabel htmlFor="image-upload">
                        <FaUpload />
                        Choose Image
                      </ImageUploadLabel>
                    </ImageUploadContainer>
                    {imagePreview && (
                      <ImagePreview>
                        <img src={imagePreview} alt="Preview" />
                      </ImagePreview>
                    )}
                  </>
                )}
                {mode === 'view' && formData.photo && (
                  <ImagePreview>
                    <img src={formData.photo} alt="Property" />
                  </ImagePreview>
                )}
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label>Description</Label>
                <TextArea
                  name="descriptions"
                  value={formData.descriptions}
                  onChange={handleChange}
                  placeholder="Enter property description"
                  rows="4"
                  disabled={mode === 'view'}
                />
              </FormGroup>
            </FormRow>

            {property && mode === 'view' && (
              <ViewOnlyInfo>
                <InfoRow>
                  <InfoLabel>Status:</InfoLabel>
                  <InfoValue status={property.isAvailable ? 'available' : 'unavailable'}>
                    {property.isAvailable ? 'Available' : 'Unavailable'}
                  </InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Created:</InfoLabel>
                  <InfoValue>
                    {property.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                  </InfoValue>
                </InfoRow>
              </ViewOnlyInfo>
            )}

            {mode !== 'view' && (
              <FormActions>
                <CancelButton type="button" onClick={onClose}>
                  Cancel
                </CancelButton>
                <SaveButton type="submit">
                  {mode === 'create' ? <FaSave /> : <FaEdit />}
                  {mode === 'create' ? 'Create Property' : 'Update Property'}
                </SaveButton>
              </FormActions>
            )}
          </Form>
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    max-width: 95vw;
    margin: 10px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px;
  border-bottom: 1px solid #e9ecef;
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  color: #666;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;

  &:hover {
    background: #f8f9fa;
  }
`;

const ModalBody = styled.div`
  padding: 25px;

  @media (max-width: 480px) {
    padding: 20px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
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

  &:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
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

  &:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #cb54f8;
  }

  &:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
  }
`;

const ViewOnlyInfo = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-top: 10px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: #666;
`;

const InfoValue = styled.span`
  color: ${props => {
    if (props.status) {
      switch (props.status) {
        case 'available': return '#28a745';
        case 'unavailable': return '#dc3545';
        default: return '#333';
      }
    }
    return '#333';
  }};
  font-weight: ${props => props.status ? '600' : '500'};
`;

const AvailabilityContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CheckboxInput = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-weight: 600;
  color: #333;
  cursor: pointer;
  font-size: 14px;
`;

const FormActions = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const CancelButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #5a6268;
  }
`;

const SaveButton = styled.button`
  background: #cb54f8;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;

  &:hover {
    background: #b13be0;
  }
`;

const ImageUploadContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
`;

const ImageUploadInput = styled.input`
  display: none;
`;

const ImageUploadLabel = styled.label`
  background: #cb54f8;
  color: white;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  transition: background-color 0.2s;

  &:hover {
    background: #b13be0;
  }
`;

const FormSection = styled.div`
  margin-bottom: 24px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #e1e5e9;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e1e5e9;
`;

const MapPreviewContainer = styled.div`
  margin-top: 20px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  overflow: hidden;
`;

const MapPreviewTitle = styled.div`
  background: #f0f0f0;
  padding: 10px 16px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg {
    color: #cb54f8;
  }
`;

const MapFrame = styled.iframe`
  width: 100%;
  height: 300px;
  border: none;
`;

const MapNote = styled.div`
  padding: 8px 16px;
  background: #f9f9f9;
  color: #666;
  font-size: 12px;
  font-style: italic;
`;

const CoordinateDisplay = styled.span`
  font-family: monospace;
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
  margin-left: 5px;
  color: #333;
  font-weight: 600;
  font-style: normal;
`;

const MapInteractButton = styled.button`
  margin-left: auto;
  background: #cb54f8;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 10px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.2s;
  
  &:hover {
    background: #b13be0;
  }
`;

const MapPickerButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #cb54f8;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 16px;
  margin-bottom: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  svg {
    font-size: 16px;
  }
  
  &:hover {
    background: #b13be0;
  }
`;

const ImagePreview = styled.div`
  margin-top: 10px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e1e5e9;
  max-width: 300px;

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    display: block;
  }
`;

export default PropertyModal;
