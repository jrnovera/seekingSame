import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import PropertyModal from './PropertyModal';
import PropertyCard from './PropertyCard';
import { db, storage } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Properties = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [modalMode, setModalMode] = useState('create');

  // Simple Firestore subscription to fetch all properties
  useEffect(() => {
    const q = query(collection(db, 'property'), orderBy('name'));
    const unsub = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProperties(items);
      setFilteredProperties(items);
    }, (err) => {
      console.error(err);
      toast.error('Failed to load properties');
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    let filtered = properties;

    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.cities.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.categories.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(property => 
        filterStatus === 'available' ? property.isAvailable : !property.isAvailable
      );
    }

    setFilteredProperties(filtered);
  }, [properties, searchTerm, filterStatus]);

  const handleCreateProperty = () => {
    setSelectedProperty(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditProperty = (property) => {
    setSelectedProperty(property);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleViewProperty = (property) => {
    setSelectedProperty(property);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    try {
      await deleteDoc(doc(db, 'property', propertyId));
      toast.success('Property deleted successfully');
    } catch (e) {
      toast.error('Failed to delete property');
    }
  };

  const uploadImage = async (imageFile) => {
    if (!imageFile) return null;
    
    const imageRef = ref(storage, `properties/${Date.now()}_${imageFile.name}`);
    const snapshot = await uploadBytes(imageRef, imageFile);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  };

  const handleSaveProperty = async (propertyData) => {
    try {
      let imageUrl = propertyData.image || 'https://via.placeholder.com/300x200';
      
      // Upload image if a file was provided
      if (propertyData.imageFile) {
        toast.info('Uploading image...');
        imageUrl = await uploadImage(propertyData.imageFile);
      }

      if (modalMode === 'create') {
        const payload = {
          name: propertyData.name,
          descriptions: propertyData.descriptions || '',
          email: propertyData.email || '',
          phoneNumber: propertyData.phoneNumber || '',
          cities: propertyData.cities || '',
          capacity: Number(propertyData.capacity) || 1,
          categories: propertyData.categories || '',
          price: Number(propertyData.price) || 0,
          deposit: Number(propertyData.deposit) || 0,
          bathroomType: propertyData.bathroomType || 'Private',
          bedroomCount: Number(propertyData.bedroomCount) || 1,
          BathRoomCount: Number(propertyData.BathRoomCount) || 1,
          preferences: propertyData.preferences || [],
          isAvailable: propertyData.isAvailable !== false,
          photo: imageUrl,
          samplePhotos: propertyData.samplePhotos || [],
          location: propertyData.location || null,
          createdAt: serverTimestamp(),
          createdby: user ? doc(db, 'users', user.id) : null,
          listOfLikeUsers: [],
          roomMates: []
        };
        await addDoc(collection(db, 'property'), payload);
        toast.success('Property created successfully');
      } else if (modalMode === 'edit' && selectedProperty) {
        const ref = doc(db, 'property', selectedProperty.id);
        await updateDoc(ref, {
          name: propertyData.name,
          descriptions: propertyData.descriptions || '',
          email: propertyData.email || '',
          phoneNumber: propertyData.phoneNumber || '',
          cities: propertyData.cities || '',
          capacity: Number(propertyData.capacity) || 1,
          categories: propertyData.categories || '',
          price: Number(propertyData.price) || 0,
          deposit: Number(propertyData.deposit) || 0,
          bathroomType: propertyData.bathroomType || 'Private',
          bedroomCount: Number(propertyData.bedroomCount) || 1,
          BathRoomCount: Number(propertyData.BathRoomCount) || 1,
          preferences: propertyData.preferences || [],
          isAvailable: propertyData.isAvailable !== false,
          photo: imageUrl,
          samplePhotos: propertyData.samplePhotos || [],
          location: propertyData.location || null
        });
        toast.success('Property updated successfully');
      }
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
      toast.error('Failed to save property');
    }
  };

  return (
    <PropertiesContainer>
      <Header>
        <Title>Properties Management</Title>
        <CreateButton onClick={handleCreateProperty}>
          <FaPlus /> Add Property
        </CreateButton>
      </Header>

      <FiltersSection>
        <SearchWrapper>
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchWrapper>
        
        <FilterSelect
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </FilterSelect>
      </FiltersSection>

      <PropertiesGrid>
        {filteredProperties.map(property => (
          <PropertyCard
            key={property.id}
            property={property}
            onEdit={() => handleEditProperty(property)}
            onDelete={() => handleDeleteProperty(property.id)}
            onView={() => handleViewProperty(property)}
          />
        ))}
      </PropertiesGrid>

      {filteredProperties.length === 0 && (
        <EmptyState>
          <EmptyMessage>No properties found</EmptyMessage>
          <EmptySubtext>
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first property'
            }
          </EmptySubtext>
        </EmptyState>
      )}

      <PropertyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProperty}
        property={selectedProperty}
        mode={modalMode}
      />
    </PropertiesContainer>
  );
};

const PropertiesContainer = styled.div`
  padding: 0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 24px;
    text-align: center;
  }
`;

const CreateButton = styled.button`
  background: #cb54f8;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;

  &:hover {
    background: #b13be0;
  }

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const FiltersSection = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;

  @media (max-width: 768px) {
    max-width: none;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  font-size: 16px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #cb54f8;
  }
`;

const FilterSelect = styled.select`
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  background: white;
  cursor: pointer;
  min-width: 150px;

  &:focus {
    outline: none;
    border-color: #cb54f8;
  }
`;

const PropertiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
`;

const EmptyMessage = styled.div`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 10px;
`;

const EmptySubtext = styled.div`
  font-size: 16px;
`;

export default Properties;
