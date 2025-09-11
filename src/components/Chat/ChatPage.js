import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { getOtherParticipant, sendMessage, subscribeToMessages, subscribeToUserChats } from '../../services/chatService';
import { uploadChatImage, validateImageFile } from '../../services/imageService';
import { FiImage, FiSend, FiArrowLeft } from 'react-icons/fi';

const ChatPage = () => {
  const { user } = useAuth();
  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [otherParticipants, setOtherParticipants] = useState({});
  const [uploading, setUploading] = useState(false);
  const [showMessages, setShowMessages] = useState(false); // For mobile navigation
  const endRef = useRef(null);
  const fileInputRef = useRef(null);

  const isHost = user?.role === 'host' || user?.role === 'admin';
  const guard = !user ? 'login' : (!isHost ? 'home' : null);

  // Subscribe to user's chats
  useEffect(() => {
    if (!user?.id) return;
    const unsub = subscribeToUserChats(user.id, setChatList);
    return () => unsub && unsub();
  }, [user?.id]);

  // Subscribe to messages for selected chat
  useEffect(() => {
    if (!selectedChat?.ref) {
      setMessages([]);
      return;
    }
    const unsub = subscribeToMessages(selectedChat.ref, setMessages);
    return () => unsub && unsub();
  }, [selectedChat?.id]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Resolve other participants for chat list
  useEffect(() => {
    if (!chatList.length || !user?.id) return;
    
    const resolveParticipants = async () => {
      const participants = {};
      for (const chat of chatList) {
        if (!otherParticipants[chat.id]) {
          const other = await getOtherParticipant(chat, user.id);
          if (other) participants[chat.id] = other;
        }
      }
      if (Object.keys(participants).length > 0) {
        setOtherParticipants(prev => ({ ...prev, ...participants }));
      }
    };

    resolveParticipants();
  }, [chatList, user?.id, otherParticipants]);

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setShowMessages(true); // Show messages view on mobile
  };

  const handleBackToList = () => {
    setShowMessages(false);
    setSelectedChat(null);
  };

  const canSend = selectedChat && (text.trim().length > 0 || uploading);

  const onSend = async (e) => {
    e.preventDefault();
    if (!canSend || uploading) return;
    await sendMessage({ chatDocumentRef: selectedChat.ref, ownerUid: user.id, text });
    setText('');
  };

  const handleImageSelect = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedChat) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    setUploading(true);
    try {
      const result = await uploadChatImage(file, selectedChat.id, user.id);
      if (result.success) {
        await sendMessage({ 
          chatDocumentRef: selectedChat.ref, 
          ownerUid: user.id, 
          text: '', 
          imagePath: result.url 
        });
      } else {
        alert('Failed to upload image: ' + result.error);
      }
    } catch (error) {
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Container>
      {guard === 'login' && <Navigate to="/login" replace />}
      {guard === 'home' && <Navigate to="/" replace />}
      <ChatContainer>
        <ConversationList $hidden={showMessages}>
          <ListHeader>
            <h3>Conversations</h3>
          </ListHeader>
          <ConversationItems>
            {chatList.map((chat) => {
              const other = otherParticipants[chat.id];
              return (
                <ConversationItem
                  key={chat.id}
                  $active={selectedChat?.id === chat.id}
                  onClick={() => handleChatSelect(chat)}
                >
                  <Avatar>
                    {(other?.display_name || other?.email || '?')[0].toUpperCase()}
                  </Avatar>
                  <ConversationInfo>
                    <Name>{other?.display_name || other?.email || 'Unknown User'}</Name>
                    <LastMessage>{chat.lastMessage || 'No messages yet'}</LastMessage>
                  </ConversationInfo>
                </ConversationItem>
              );
            })}
            {chatList.length === 0 && (
              <EmptyState>No conversations yet</EmptyState>
            )}
          </ConversationItems>
        </ConversationList>

        <ChatArea $hidden={!showMessages}>
          {selectedChat ? (
            <>
              <ChatHeader>
                <BackButton onClick={handleBackToList}>
                  <FiArrowLeft />
                </BackButton>
                <h4>{otherParticipants[selectedChat.id]?.display_name || otherParticipants[selectedChat.id]?.email || 'Conversation'}</h4>
              </ChatHeader>
              <MessagesArea>
                {messages.map((m) => (
                  <Message key={m.id} $own={m.messegeOwner?.id === user.id}>
                    <MessageBubble $own={m.messegeOwner?.id === user.id}>
                      {m.imagePath ? (
                        <MessageImage src={m.imagePath} alt="Shared image" />
                      ) : (
                        m.message
                      )}
                    </MessageBubble>
                  </Message>
                ))}
                <div ref={endRef} />
              </MessagesArea>
              <MessageComposer onSubmit={onSend}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <ComposerInput
                  type="text"
                  placeholder="Type a message..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  disabled={uploading}
                />
                <ImageButton 
                  type="button" 
                  onClick={handleImageSelect}
                  disabled={!selectedChat || uploading}
                  title="Send image"
                >
                  <FiImage />
                </ImageButton>
                <SendButton type="submit" disabled={!canSend}>
                  {uploading ? '...' : <FiSend />}
                </SendButton>
              </MessageComposer>
            </>
          ) : (
            <EmptyChat>
              <h3>Select a conversation to start chatting</h3>
              <p>Choose a conversation from the list to view messages</p>
            </EmptyChat>
          )}
        </ChatArea>
      </ChatContainer>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  @media (max-width: 768px) {
    height: calc(100vh - 60px); /* Account for header height */
    width: 100vw;
    overflow: hidden;
  }
`;

const ChatContainer = styled.div`
  display: flex;
  height: calc(100vh - 40px);
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
  margin: 20px;
  
  @media (max-width: 768px) {
    height: 100%;
    margin: 0;
    border-radius: 0;
    box-shadow: none;
    flex-direction: column;
    overflow: hidden;
  }
`;

const ConversationList = styled.div`
  width: 350px;
  border-right: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  @media (max-width: 768px) {
    width: 100vw;
    border-right: none;
    height: 100vh;
    overflow: hidden;
    ${props => props.$hidden && 'display: none;'}
  }
`;

const ListHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
  
  h3 {
    margin: 0;
    color: #333;
    font-size: 18px;
    font-weight: 600;
  }
`;

const ConversationItems = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  
  @media (max-width: 768px) {
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
  }
`;

const ConversationItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  border-bottom: 1px solid #f1f3f5;
  background: ${props => props.$active ? '#f9f1ff' : 'transparent'};
  
  &:hover {
    background: ${props => props.$active ? '#f9f1ff' : '#fafafa'};
  }
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #cb54f8, #9c27b0);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 18px;
  margin-right: 12px;
`;

const ConversationInfo = styled.div`
  flex: 1;
  overflow: hidden;
`;

const Name = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LastMessage = styled.div`
  font-size: 14px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EmptyState = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: #666;
  font-style: italic;
`;

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  @media (max-width: 768px) {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    ${props => props.$hidden && 'display: none;'}
  }
`;

const ChatHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  gap: 12px;
  
  h4 {
    margin: 0;
    color: #333;
    font-size: 16px;
    font-weight: 600;
    flex: 1;
  }
`;

const BackButton = styled.button`
  display: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: #f8f9fa;
  color: #666;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:hover {
    background: #e9ecef;
    color: #333;
  }
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px;
  background: #fafafa;
  
  @media (max-width: 768px) {
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    padding: 16px;
  }
`;

const Message = styled.div`
  display: flex;
  justify-content: ${props => props.$own ? 'flex-end' : 'flex-start'};
  margin-bottom: 12px;
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  background: ${props => props.$own ? '#cb54f8' : '#fff'};
  color: ${props => props.$own ? '#fff' : '#333'};
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  word-wrap: break-word;
  overflow-wrap: break-word;
  
  @media (max-width: 768px) {
    max-width: 85%;
    padding: 10px 14px;
  }
`;

const MessageComposer = styled.form`
  display: flex;
  gap: 8px;
  padding: 20px;
  border-top: 1px solid #e9ecef;
  background: #fff;
  align-items: center;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    padding: 16px;
    gap: 6px;
  }
`;

const ComposerInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #dee2e6;
  border-radius: 24px;
  outline: none;
  font-size: 14px;
  min-width: 0;
  
  &:focus {
    border-color: #cb54f8;
    box-shadow: 0 0 0 2px rgba(203, 84, 248, 0.1);
  }
  
  &:disabled {
    background: #f8f9fa;
    color: #6c757d;
  }
  
  @media (max-width: 768px) {
    padding: 10px 14px;
    font-size: 16px; /* Prevents zoom on iOS */
  }
`;

const ImageButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid #dee2e6;
  background: #fff;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: #f8f9fa;
    border-color: #cb54f8;
    color: #cb54f8;
  }
  
  &:disabled {
    background: #f8f9fa;
    color: #ccc;
    cursor: not-allowed;
  }
`;

const SendButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: #cb54f8;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  
  &:hover:not(:disabled) {
    background: #b347e6;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const MessageImage = styled.img`
  max-width: 200px;
  max-height: 200px;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const EmptyChat = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #666;
  
  h3 {
    margin: 0 0 8px;
    color: #333;
  }
  
  p {
    margin: 0;
    font-size: 14px;
  }
`;

export default ChatPage;
