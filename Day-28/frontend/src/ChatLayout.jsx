import { useState, useRef } from 'react'
import { Avatar, Badge, Box, Button, Flex, Group, Paper, ScrollArea, Stack, Text } from "@mantine/core"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "./api";

export default function ChatLayout() {
  const [currentUser, setCurrentUser] = useState(null)
  const [activeTab, setActiveTab] = useState('chats')
  const [chats, setChats] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [messageInput, setMessageInput] = useState('')

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const ws = useRef(null)
  const activeChatRef = useRef(null)
  const messagesEndRef = useRef(null)

  const navigate = useNavigate()

  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat])

  useEffect(() => {
    fetchMe()
    fetchChats()
  }, [])

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat.id)
    }
  }, [activeChat])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({"behaviour": "smooth"})
    }
  }, [messages])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return;

    ws.current = new WebSocket(`ws://localhost:8000/ws/chat?token=${token}`)

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.event == "new_message") {
        setMessages(prev => {
          if (activeChatRef.current && data.message.chat_id === activeChatRef.current.id) {
            return [...prev, data.message];
          }
          return prev;
        });
      }
    }

    return () => {
      if (ws.current) ws.current.close();
    }
  }, [])

  const fetchMe = async () => {
    try {
      const res = await api.get("/users/me");
      setCurrentUser(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  const fetchChats = async () => {
    try {
      const res = await api.get("/chats");
      setChats(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  const fetchMessages = async (chatId) => {
    try {
      const res = await api.get(`/chats/${chatId}/messages`);
      setMessages(res.data)
    } catch (err) {
      console.log(err);
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    try {
      const res = await api.get(`/users/search?q=${searchQuery}`)
      setSearchResults(res.data);
    } catch (err) {
      console.log(err)
    }
  }

  const sendFriendRequest = async (userId) => {
    try {
      await api.post(`/friends/request/${userId}`);
      alert("Friend request sent!")
      fetchMe()
    } catch (err) {
      alert(err.response?.data?.detail || "Error has occurred")
      console.log(err);
    }
  }

  const acceptRequest = async (userId) => {
    try {
      await api.post(`/friends/accept/${userId}`);
      fetchMe();
      fetchChats();
    } catch (err) {
      alert(err.response?.data?.detail || "Error has occurred")
      console.log(err);
    }
  }

  const rejectRequest = async (userId) => {
    try {
      await api.post(`/friends/reject/${userId}`);
      fetchMe();
    } catch (err) {
      alert(err.response?.data?.detail || "Error has occurred")
      console.log(err);
    }
  }

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChat || !ws.current) return;

    ws.current.send(JSON.stringify({
      chat_id: activeChat.id,
      content: messageInput
    }));

    setMessageInput('');
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/auth");
  }

  if (!currentUser) return <div>Loading...</div>

  return (
    <Flex h="100vh" w="100vw" direction="row" wrap="nowrap">
      {/* Sidebar */}
      <Box w={350} style={{borderRight: "1px solid #dee2e6", display: "flex", flexDirection: "column", height: "100%"}}>
        {/* User profile header */}
        <Group justify="space-between" p="md" style={{borderBottom: "1px solid #dee2e6", backgroundColor: "#f9f9fa"}}>
          <Group>
            <Avatar>{currentUser.username.substring(0,2).toUpperCase()}</Avatar>
            <Text fw={700} size="md">{currentUser.username}</Text>
          </Group>
          <Button variant="subtle" color="red" size="xs" onClick={handleLogout}>
            Logout
          </Button>
        </Group>

        {/* Tab switcher */}
        <Group grow gap={0} style={{borderBottom: "1px solid #dee2e6"}}>
          <Button
            variant={activeTab == 'chats' ? 'filled' : 'subtle'}
            color='gray'
            radius={0}
            onClick={() => setActiveTab('chats')}
            height={40}
          >
            Chats
          </Button>
          <Button
            variant={activeTab == 'contacts' ? 'filled' : 'subtle'}
            color='gray'
            radius={0}
            onClick={() => setActiveTab('contacts')}
            height={40}
            rightSection={
              currentUser.received_requests?.length > 0 && (
                <Badge color='red' circle size="sm">{currentUser.received_requests?.length}</Badge>
              )
            }
            >
            Contacts
          </Button>
        </Group>

        <ScrollArea style={{flex:1}}>
            {
              activeTab === 'chats' && (
                <Stack gap={0}>
                  {chats.map(chat => (
                    <Paper
                    key={chat.id}
                    p={"md"}
                    radius={0}
                    bg={activeChat?.id === chat.id ? 'green' : 'transparent'}
                    style={{cursor: 'pointer'}}
                    onClick={() => setActiveChat(chat)}
                    >
                    <Group>
                      <Avatar>{chat.is_group ? "GR" : chat.name?.substring(0,2).toUpperCase() || "DC"}</Avatar>
                      <Box>
                        <Text fw={700} size="md">{chat.is_group ? chat.name : "Direct Chat"}</Text>
                      </Box>
                    </Group>
                  </Paper>
                  ))}
                </Stack>
              )
            }
        </ScrollArea>
      </Box>
    </Flex>
  )
}
