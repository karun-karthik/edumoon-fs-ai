import { useState, useRef } from 'react'
import { Avatar, Badge, Box, Button, Center, Flex, Group, Paper, ScrollArea, Stack, Text, TextInput } from "@mantine/core"
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

    // ws.current = new WebSocket(`ws://localhost:8000/ws/chat?token=${token}`)
    ws.current = new WebSocket(`wss://edumoon-fs-ai-1.onrender.com/ws/chat?token=${token}`)

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
      if (ws.current) ws?.current?.close();
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

  const getAvatarCharacters = (username) => {
    return username?.substring(0,2)?.toUpperCase();
  }

  return (
    <Flex h="100vh" w="100vw" direction="row" wrap="nowrap">
      {/* Sidebar */}
      <Box w={350} style={{borderRight: "1px solid #dee2e6", display: "flex", flexDirection: "column", height: "100%"}}>
        {/* User profile header */}
        <Group justify="space-between" p="md" style={{borderBottom: "1px solid #dee2e6", backgroundColor: "#f9f9fa"}}>
          <Group>
            <Avatar>{getAvatarCharacters(currentUser.username)}</Avatar>
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
                  {chats.map(chat => {
                    const recipient = chat.participants.filter(u => u.id != currentUser.id)?.[0];
                    return (
                    <Paper
                      key={chat.id}
                      p={"md"}
                      radius={0}
                      bg={activeChat?.id === chat.id ? '#e7f5ff' : 'transparent'}
                      style={{cursor: 'pointer'}}
                      onClick={() => setActiveChat({...chat, targetUsername: recipient.username})}
                    >
                    <Group wrap='nowrap'>
                      <Avatar>{chat.is_group ? chat.name : getAvatarCharacters(recipient.username)}</Avatar>
                      <Box>
                        <Text fw={700} size="md">{chat.is_group ? chat.name : recipient.username}</Text>
                        <Text size="xs" c="dimmed">{chat.participants.length} participants</Text>
                      </Box>
                    </Group>
                  </Paper>
                  )})}
                  {chats.length === 0 && (
                    <Text c="dimmed" ta="center" p="xl" mt="md">No chats yet. Go to contacts to add friends!</Text>
                  )}
                </Stack>
              )
            }

            {/* Contacts Tab */}

            {
              activeTab === 'contacts' && (
                <Box p={"md"}>
                  {/* Pending requests */}
                  {currentUser.received_requests?.length > 0 && (
                    <Stack mb={"xl"} gap={"xs"}>
                      <Text fw={600} c={"dimmed"} size='sm'>Friend Requests</Text>
                      {currentUser.received_requests.map(requestId => (
                        <Paper key={requestId} withBorder p={"xs"} radius={"md"} bg={"#e3e8f6"}>
                          <Group justify='space-between' wrap='nowrap'>
                            <Text size='xs' truncate>{requestId}</Text>
                            {/* resolve to username later */}
                            <Group gap={4} wrap='nowrap'>
                              <Button size='xs' color="teal" onClick={() => acceptRequest(requestId)}>✓</Button>
                              <Button size='xs' color="red" onClick={() => rejectRequest(requestId)}>x</Button>
                            </Group>
                          </Group>
                        </Paper>
                      ))}
                    </Stack>
                  )}

                  {/* Add friends */}

                  <Text fw={600} c={"dimmed"} size='sm'>Add Friends</Text>
                  <form onSubmit={handleSearch}>
                    <Group gap={"xs"} wrap='nowrap'>
                      <TextInput
                        placeholder='Search username'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.currentTarget.value)}
                        style={{flex:1}}
                      />
                      <Button type='submit'>Search</Button>
                    </Group>
                  </form>

                  <Stack mt={"md"} gap={0}>
                    {searchResults.map(user => {
                      const isFriend = currentUser.friends.includes(user.id);
                      const isPending = currentUser.sent_requests.includes(user.id);
                      return (
                        <Group key={user.id} justify='space-between' p={"sm"} wrap='nowrap' style={{borderBottom: "1px solid #dee2e6"}}>
                          <Text truncate style={{flex:1}}>{user.username}</Text>
                          {isFriend ? (
                            <Badge color='teal' variant="light">Friends</Badge>
                          ) : isPending ? (
                            <Badge color='yellow' variant="light">Pending</Badge>
                          ) : (
                            <Button size='sm' variant="subtle" onClick={() => sendFriendRequest(user.id)}>Add</Button>
                          )
                        }
                        </Group>
                      )
                    })}
                  </Stack>
                </Box>
              )
            }
        </ScrollArea>
      </Box>


      {/* Chat Area */}
      <Box style={{flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#f9f9fa"}}>
        {!activeChat ? (
          <Center h="100%">
            <Text c={"dimmed"} size='xl'>Select a chat to start messaging</Text>
          </Center>
        ): (
          <>
          {/* Chat header */}
          <Paper p={"md"} radius={0} shadow='sm' style={{"zIndex": 10}}>
            <Group wrap='nowrap'>
              <Avatar color={activeChat.is_group ? "teal" : "grape"} radius={"xl"}>
                {activeChat.is_group ? "GR" : getAvatarCharacters(activeChat.targetUsername)}
              </Avatar>
              <Box>
                <Text fw={700} size="md">{activeChat.is_group ? activeChat.name : activeChat.targetUsername}</Text>
                <Text size="xs" c="dimmed">{activeChat.id}</Text>
              </Box>
            </Group>
          </Paper>

          {/* Messages */}
          <ScrollArea style={{flex: 1}} p="md">
            <Stack gap={"md"}>
              {messages.map((msg, i) => {
                const isMe = msg.sender_id === currentUser.id;
                return (
                  <Group key={msg.id || i} justify={isMe ? "flex-end" : "flex-start"} wrap='nowrap' align='flex-end'>
                    {!isMe && (
                      <Avatar color='gray' radius={"xl"} size={"sm"}>
                        {msg.sender_id.substring(0, 2).toUpperCase()}
                      </Avatar>
                    )}

                    <Paper
                      p={"sm"}
                      radius={"md"}
                      bg={isMe ? "indigo" : "white"}
                      c={isMe ? "whilte" : "black"}
                      withBorder={!isMe}
                      style={{
                        maxWidth: "70%",
                        borderBottomRightRadius: isMe ? 0 : undefined,
                        borderBottomLeftRadius: !isMe ? 0 : undefined,
                      }}
                    >
                      <Text size='sm'>{msg.content}</Text>
                      <Text size='xs' c={isMe ? "white" : "dimmed"} ta={"right"} mt={4}>
                        {new Date(msg.timestamp).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}
                      </Text>
                    </Paper>
                  </Group>
                )
              })}
              <div ref={messagesEndRef}></div>
            </Stack>
          </ScrollArea>

          {/* Message Input */}
          <Paper p={"md"} radius={0} withBorder>
              <form onSubmit={handleSendMessage}>
                <Group wrap='nowrap'>
                  <TextInput
                    placeholder='Type a message'
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.currentTarget.value)}
                    style={{flex:1}}
                    size='md'
                    radius={"xl"}
                  />
                  <Button type='submit' size='md' radius={"xl"} disabled={!messageInput.trim()}>
                    Send
                  </Button>
                </Group>
              </form>
          </Paper>
          </>
        )}
      </Box>
    </Flex>
  )
}
