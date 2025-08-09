import React, { useState, useRef, useEffect } from 'react';
import { Send, Moon, Sun, Search, MoreVertical, Phone, Video, Smile, Trash2, X } from 'lucide-react';
import './App.css';
import { io } from "socket.io-client";


const ChatApp = () => {

  const [socket, setSocket] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey! How's your day going?", sender: 'other', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
  ]);
  const messagesEndRef = useRef(null);
  const menuRef = useRef(null);
  const searchInputRef = useRef(null);
  const emojiRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };


  useEffect(()=>{
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
    const socketInstance = io(backendUrl);
    setSocket(socketInstance);

    socketInstance.on("ai-message-response",(data)=>{
        const botMessage ={
            id:Date.now()+1,
            text:data.response,
            time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),
            sender:'other'
        }
        setMessages(prevMessages => [...prevMessages, botMessage]);
    })

    return () => {
      socketInstance.disconnect();
    };
  },[])

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setIsEmojiOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
        setSearchQuery('');
        setIsEmojiOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isSearchOpen) {
      // Focus search input when opened
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [isSearchOpen]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const clearAllChats = () => {
    const shouldClear = window.confirm('Clear all chats?');
    if (!shouldClear) return;
    setMessages((prev) => {
      const pinned = prev.find((m) => m.id === 1);
      return pinned ? [pinned] : [];
    });
    socket?.emit('clear-chat');
    setIsMenuOpen(false);
  };

  const sendMessage = () => {
    if (message.trim() === "") return 
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: 'me',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);

      socket.emit("ai-message",message)

      setMessage('');

  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const themeClasses = isDark
    ? 'bg-gray-900 text-white'
    : 'bg-gray-50 text-gray-900';

  const cardClasses = isDark
    ? 'bg-gray-800 border-gray-700'
    : 'bg-white border-gray-200';

  const inputClasses = isDark
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500';

  const emojiOptions = [
    '😀','😂','😍','👍','🙏','🎉','😢','😎','🔥','💯',
    '🤔','👏','😅','🥰','😡','😴','🤗','🙌','🤩','😇'
  ];

  const displayedMessages = searchQuery.trim()
    ? messages.filter((m) => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages;

  return (
    <div className={`min-h-screen transition-all duration-500 ${themeClasses}`}>
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        
        {/* Header */}
        <div className={`${cardClasses} border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm bg-opacity-95`}>
          <div className="flex items-center space-x-3 min-w-0">
            <div className="relative shrink-0">
              <img
                src="https://www.shutterstock.com/image-vector/happy-robot-3d-ai-character-600nw-2464455965.jpg"
                alt="User"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            {!isSearchOpen && (
              <div className="truncate">
                <h2 className="font-semibold text-lg truncate">369 BOT</h2>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Online</p>
              </div>
            )}
            {isSearchOpen && (
              <div className="flex-1 min-w-0">
                <div className={`flex items-center gap-2 rounded-xl border px-3 py-2 w-[220px] sm:w-[280px] md:w-[360px] ${inputClasses}`}>
                  <Search className="w-4 h-4 opacity-70" />
                  <input
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search chats..."
                    className={`bg-transparent outline-none w-full text-sm ${isDark ? 'placeholder-gray-400 text-white' : 'placeholder-gray-500 text-gray-900'}`}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className={`p-1 rounded-full ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsSearchOpen((prev) => {
                const next = !prev;
                if (!next) setSearchQuery('');
                return next;
              })}
              className={`p-2 rounded-full hover:bg-opacity-80 transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              aria-label="Toggle search"
            >
              {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
                isDark ? 'hover:bg-yellow-500/20 text-yellow-400' : 'hover:bg-blue-500/20 text-blue-600'
              }`}
            >
              {isDark ? (
                <Sun className="w-5 h-5 transition-transform duration-300 rotate-180" />
              ) : (
                <Moon className="w-5 h-5 transition-transform duration-300 rotate-0" />
              )}
            </button>
            
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen((v) => !v)}
                className={`p-2 rounded-full transition-all duration-200 hover:scale-105 ${
                  isDark
                    ? 'bg-white/5 hover:bg-white/10 text-gray-200 ring-1 ring-white/10'
                    : 'bg-black/5 hover:bg-black/10 text-gray-700 ring-1 ring-black/5'
                }`}
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              {isMenuOpen && (
                <div
                  className={`absolute right-0 mt-2 w-56 origin-top-right rounded-xl shadow-2xl backdrop-blur-md border ${
                    isDark ? 'bg-gray-800/90 border-gray-700 text-white' : 'bg-white/90 border-gray-200 text-gray-900'
                  }`}
                >
                  <span
                    className={`absolute right-4 -top-1.5 h-3 w-3 rotate-45 ${
                      isDark ? 'bg-gray-800/90 border-t border-l border-gray-700' : 'bg-white/90 border-t border-l border-gray-200'
                    }`}
                  />
                  <button
                    onClick={clearAllChats}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm ${
                      isDark ? 'hover:bg-gray-700/80' : 'hover:bg-gray-50'
                    }`}
                  >
                    <Trash2 className="w-4 h-4 text-black-500" />
                    <span className="font-medium text-black-600">Clear Chats</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
          {displayedMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            >
              <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                msg.sender === 'me'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md'
                  : isDark
                  ? 'bg-gray-700 text-white rounded-bl-md'
                  : 'bg-white text-gray-900 rounded-bl-md border border-gray-200'
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <p className={`text-xs mt-1 ${
                  msg.sender === 'me'
                    ? 'text-blue-100'
                    : isDark
                    ? 'text-gray-400'
                    : 'text-gray-500'
                }`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
          {isSearchOpen && searchQuery.trim() && displayedMessages.length === 0 && (
            <div className={`text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              No messages match "{searchQuery}".
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className={`${cardClasses} border-t p-4 sticky bottom-0 backdrop-blur-sm bg-opacity-95`}>
          <div className="space-y-3" ref={emojiRef}>
            {isEmojiOpen && (
              <div
                className={`p-2 rounded-xl border shadow-lg max-h-48 overflow-y-auto ${
                  isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}
              >
                <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-1">
                  {emojiOptions.map((emoji) => (
                    <button
                      key={emoji}
                      className={`text-2xl leading-none p-1 rounded hover:scale-110 transition-transform ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                      onClick={() => {
                        setMessage((prev) => `${prev}${emoji}`);
                        setTimeout(() => textareaRef.current?.focus(), 0);
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-end space-x-3">
              <button
                onClick={() => setIsEmojiOpen((v) => !v)}
                className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                aria-label="Toggle emoji picker"
              >
                <Smile className="w-5 h-5" />
              </button>

              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className={`w-full px-4 py-3 rounded-2xl border resize-none transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inputClasses}`}
                  rows={1}
                  style={{
                    minHeight: '44px',
                    maxHeight: '120px',
                  }}
                />
              </div>

              <button
                onClick={sendMessage}
                className={`p-3 rounded-full transition-all duration-200 transform hover:scale-105 ${
                  message.trim()
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl'
                    : isDark
                    ? 'bg-gray-700 text-gray-400'
                    : 'bg-gray-200 text-gray-400'
                }`}
                disabled={!message.trim()}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
