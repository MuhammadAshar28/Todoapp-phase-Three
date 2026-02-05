/**
 * Chat wrapper component
 * Custom chat interface integrated with our authentication and API service
 */

import React from 'react';
import CustomChat from './CustomChat';

interface ChatWrapperProps {
  userId: string;
}

const ChatWrapper: React.FC<ChatWrapperProps> = ({ userId }) => {
  return (
    <div className="chat-container">
      <CustomChat userId={userId} />
    </div>
  );
};

export default ChatWrapper;