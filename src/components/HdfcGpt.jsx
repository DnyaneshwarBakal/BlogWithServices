import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLoginModal } from '../context/LoginModalContext';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import {
  Box, Paper, Typography, List, ListItemButton, ListItemText, ListItemIcon,
  TextField, IconButton, CircularProgress, Divider, Button, Avatar, InputAdornment,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
// --- NEW: Import the single delete icon ---
import DeleteIcon from '@mui/icons-material/Delete';

// --- Sub-component for a single chat message ---
const Message = ({ message }) => (
  <Box sx={{ display: 'flex', justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start', mb: 2, gap: 1.5, alignItems: 'flex-start' }}>
    {message.role === 'model' && <Avatar sx={{ bgcolor: 'secondary.main' }}><SmartToyIcon /></Avatar>}
    <Paper elevation={2} sx={{ p: 1.5, backgroundColor: message.role === 'user' ? 'primary.main' : 'background.paper', color: message.role === 'user' ? 'primary.contrastText' : 'text.primary', borderRadius: message.role === 'user' ? '20px 20px 5px 20px' : '20px 20px 20px 5px', maxWidth: '80%' }}>
      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{message.content}</Typography>
    </Paper>
    {message.role === 'user' && <Avatar><PersonIcon /></Avatar>}
  </Box>
);

// --- Sub-component for the history panel (MODIFIED) ---
const HistoryPanel = ({ conversations, onSelectConversation, onNewChat, onOpenDeleteDialog, onOpenSingleDeleteDialog, activeId }) => (
  <Box
    sx={{
      width: 280,
      flexShrink: 0,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRight: 1,
      borderColor: 'divider',
      bgcolor: 'background.paper'
    }}
  >
    <Box sx={{ p: 2, flexShrink: 0, display: 'flex', gap: 1 }}>
      <Button variant="contained" fullWidth startIcon={<AddIcon />} onClick={onNewChat}>
        New Chat
      </Button>
      <IconButton onClick={onOpenDeleteDialog} color="error" title="Delete all chats">
        <DeleteSweepIcon />
      </IconButton>
    </Box>
    <Divider />

    <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
      <List>
        {conversations.map(conv => (
          <ListItemButton
             key={conv.id}
             selected={activeId === conv.id}
             onClick={() => onSelectConversation(conv)}
             sx={{
                '& .delete-icon': { visibility: 'hidden' },
                '&:hover .delete-icon': { visibility: 'visible' }
             }}
          >
            <ListItemIcon sx={{ minWidth: 32 }}><ChatBubbleOutlineIcon fontSize="small" /></ListItemIcon>
            <ListItemText
              primary={conv.title}
              primaryTypographyProps={{ noWrap: true, sx: { overflow: 'hidden', textOverflow: 'ellipsis' } }}
            />
            <IconButton
              size="small"
              className="delete-icon"
              onClick={(e) => {
                e.stopPropagation(); // Prevents selecting the chat
                onOpenSingleDeleteDialog(conv.id);
              }}
              sx={{ ml: 1 }}
              title="Delete this chat"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </ListItemButton>
        ))}
      </List>
    </Box>
  </Box>
);

// --- Sub-component for the chat window ---
const ChatWindow = ({ conversation, onSendMessage, userInput, setUserInput, isLoading }) => {
  const messagesEndRef = useRef(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages]);

  return (
    <Box sx={{ flexGrow: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
        {conversation.messages.length === 0 && !isLoading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' }}>
            <SmartToyIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
            <Typography variant="h4" color="text.secondary" sx={{ mt: 2 }}>HDFCGPT</Typography>
            <Typography color="text.secondary">Your AI assistant. How can I help you today?</Typography>
          </Box>
        )}
        {conversation.messages.map((msg, index) => <Message key={index} message={msg} />)}
        {isLoading && <CircularProgress size={24} sx={{ display: 'block', m: '20px auto' }} />}
        <div ref={messagesEndRef} />
      </Box>

      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', backgroundColor: 'background.default' }}>
        <Paper component="form" onSubmit={(e) => { e.preventDefault(); onSendMessage(); }} elevation={0} sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            fullWidth variant="outlined" placeholder={currentUser ? "Ask me anything..." : "Please log in to start a chat"}
            value={userInput} onChange={(e) => setUserInput(e.target.value)}
            disabled={isLoading || !currentUser}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '25px', } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton type="submit" color="primary" disabled={isLoading || !userInput.trim() || !currentUser}>
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Paper>
      </Box>
    </Box>
  );
};

// --- The Main HDFCGPT Page Component (MODIFIED) ---
function HdfcGpt() {
  const { currentUser } = useAuth();
  const { openLoginModal } = useLoginModal();
  const [searchParams, setSearchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState({ id: null, messages: [] });
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // --- NEW STATE: For single chat deletion ---
  const [isSingleDeleteDialogOpen, setIsSingleDeleteDialogOpen] = useState(false);
  const [chatToDeleteId, setChatToDeleteId] = useState(null);

  // Effect to fetch user's conversation history.
  useEffect(() => {
    if (!currentUser) {
      setConversations([]);
      return;
    }
    const q = query(
      collection(db, 'conversations'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const convs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setConversations(convs);
    }, (error) => {
      console.error("Error fetching conversations:", error);
    });
    return () => unsubscribe();
  }, [currentUser]);

  // Effect to load a chat from the URL.
  useEffect(() => {
    const chatId = searchParams.get('chatId');
    if (!chatId) {
        setCurrentConversation({ id: null, messages: [] });
        return;
    }
    if (chatId && conversations.length > 0) {
      const foundConv = conversations.find(c => c.id === chatId);
      if (foundConv) {
        setCurrentConversation(foundConv);
      }
    }
  }, [searchParams, conversations]);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    if (!currentUser) { openLoginModal(); return; }

    const userMessage = { role: 'user', content: userInput };
    const updatedMessages = [...currentConversation.messages, userMessage];
    const currentConvId = currentConversation.id;

    setCurrentConversation(prev => ({ ...prev, messages: updatedMessages }));
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.uid,
          messages: updatedMessages,
          conversationId: currentConvId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Server returned a non-JSON error" }));
        throw new Error(errorData.error || 'Network response was not ok');
      }
      
      const data = await response.json();
      if (!currentConvId && data.conversationId) {
        setSearchParams({ chatId: data.conversationId });
      }

    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage = { role: 'model', content: `Sorry, something went wrong: ${error.message}` };
      setCurrentConversation(prev => ({ ...prev, messages: [...prev.messages.slice(0, -1), errorMessage] }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setSearchParams({});
    setCurrentConversation({ id: null, messages: [] });
  };

  const handleSelectConversation = (conv) => {
    setSearchParams({ chatId: conv.id });
  };

  // --- Handlers for "Delete All" dialog ---
  const handleOpenDeleteDialog = () => setIsDeleteDialogOpen(true);
  const handleCloseDeleteDialog = () => setIsDeleteDialogOpen(false);

  const handleDeleteAllChats = async () => {
    if (!currentUser) { openLoginModal(); return; }
    try {
      const response = await fetch('/api/conversations', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.uid }),
      });
      if (!response.ok) throw new Error("Failed to delete conversations on the server.");
      handleNewChat();
      setConversations([]);
    } catch (error) {
      console.error('Failed to delete conversations:', error);
    } finally {
      handleCloseDeleteDialog();
    }
  };

  // --- NEW: Handlers for "Delete Single Chat" dialog ---
  const handleOpenSingleDeleteDialog = (chatId) => {
    setChatToDeleteId(chatId);
    setIsSingleDeleteDialogOpen(true);
  };

  const handleCloseSingleDeleteDialog = () => {
    setChatToDeleteId(null);
    setIsSingleDeleteDialogOpen(false);
  };

  const handleConfirmDeleteSingleChat = async () => {
    if (!chatToDeleteId || !currentUser) return;

    try {
      const response = await fetch(`/api/conversations/${chatToDeleteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error("Failed to delete the conversation on the server.");
      }

      // If the currently active chat is the one being deleted, switch to a new chat screen
      if (currentConversation.id === chatToDeleteId) {
        handleNewChat();
      }
      // Note: No need to manually update the 'conversations' state.
      // The 'onSnapshot' listener will automatically receive the update from Firestore.
    } catch (error) {
      console.error('Failed to delete conversation:', error);
      // Optionally, show an error message to the user here
    } finally {
      handleCloseSingleDeleteDialog(); // Close the dialog in all cases
    }
  };

  return (
    <>
      <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex', overflow: 'hidden' }}>
        <HistoryPanel
          conversations={conversations}
          onSelectConversation={handleSelectConversation}
          onNewChat={handleNewChat}
          onOpenDeleteDialog={handleOpenDeleteDialog}
          onOpenSingleDeleteDialog={handleOpenSingleDeleteDialog} // Pass the new handler
          activeId={currentConversation.id}
        />
        <ChatWindow
          conversation={currentConversation}
          onSendMessage={handleSendMessage}
          userInput={userInput}
          setUserInput={setUserInput}
          isLoading={isLoading}
        />
      </Box>

      {/* "Delete All" Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>{"Delete All Chat History?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete all of your conversations? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteAllChats} color="error" autoFocus>
            Delete All
          </Button>
        </DialogActions>
      </Dialog>

      {/* --- NEW: "Delete Single Chat" Dialog --- */}
      <Dialog open={isSingleDeleteDialogOpen} onClose={handleCloseSingleDeleteDialog}>
        <DialogTitle>{"Delete This Chat?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete this conversation? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSingleDeleteDialog}>Cancel</Button>
          <Button onClick={handleConfirmDeleteSingleChat} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default HdfcGpt;