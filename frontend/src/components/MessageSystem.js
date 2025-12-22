import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Send, MessageSquare } from 'lucide-react';

const MessageSystem = ({ userRole }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      console.log('Fetching messages...');
      const { data } = await API.get('/messages');
      console.log('Messages fetched:', data);
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error.response?.data || error.message);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      console.log('Sending message:', newMessage);
      const response = await API.post('/messages', { content: newMessage });
      console.log('Message sent:', response.data);
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error.response?.data || error.message);
      alert('Failed to send message: ' + (error.response?.data?.message || error.message));
    }
  };

  const getSenderName = (msg) => {
    if (msg.sender && msg.sender.name) {
      return msg.sender.name;
    }
    // Fallback for demo users who might not be in the DB
    if (msg.senderRole === 'student_admin') return 'Student Admin';
    if (msg.senderRole === 'coordinator') return 'Innovation Admin';
    return 'Unknown User';
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 h-full flex flex-col">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <MessageSquare className="text-blue-400" />
        {userRole === 'student_admin' ? 'Coordinator Communication' : 'Admin Messages'}
      </h3>

      <div className="flex-grow overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar" style={{ maxHeight: '400px' }}>
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center italic">No messages yet.</p>
        ) : (
          messages.map((msg) => (
            <div key={msg._id} className={`p-3 rounded-lg ${msg.senderRole === 'student_admin' ? 'bg-blue-900/30 border border-blue-800 ml-auto max-w-[80%]' : 'bg-gray-700 border border-gray-600 mr-auto max-w-[80%]'}`}>
              <p className="text-xs text-gray-400 mb-1">
                {getSenderName(msg)} ({msg.senderRole === 'student_admin' ? 'Admin' : 'Coordinator'})
              </p>
              <p className="text-gray-200">{msg.content}</p>
              <p className="text-[10px] text-gray-500 mt-1 text-right">{new Date(msg.createdAt).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>

      {userRole === 'student_admin' && (
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            placeholder="Type official notice..."
            className="flex-grow px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit" className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <Send size={20} />
          </button>
        </form>
      )}
    </div>
  );
};

export default MessageSystem;
