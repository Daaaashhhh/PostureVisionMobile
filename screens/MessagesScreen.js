import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {BlurView} from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../CustomText';

const {width} = Dimensions.get('window');

const MessagesScreen = ({navigation}) => {
  // Placeholder data
  const conversations = [
    {
      id: 1,
      name: 'Dr. Brian Hutcheson',
      preview: "Ok, let's schedule that follow-up...",
      unread: 0,
      timestamp: '10:35 AM',
    },
    {
      id: 2,
      name: 'Support Team',
      preview: 'Your request #12345 has been updated.',
      unread: 1,
      timestamp: 'Yesterday',
    },
    {
      id: 3,
      name: 'Physio Updates',
      preview: 'New exercise added to your plan.',
      unread: 0,
      timestamp: 'Mon',
    },
  ];

  const [currentConversationId, setCurrentConversationId] = useState(1);
  const [isChatViewActiveOnMobile, setIsChatViewActiveOnMobile] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const selectedMessages = [
    {
      id: 101,
      sender: 'Dr. Brian Hutcheson',
      text: 'Hi Alex, just checking in on your progress with the new exercises.',
      timestamp: '9:15 AM',
      isOwn: false,
    },
    {
      id: 102,
      sender: 'Alex Ray',
      text: 'Hi Dr. H! Going well mostly, though the Bird Dog is tricky.',
      timestamp: '9:20 AM',
      isOwn: true,
    },
    {
      id: 103,
      sender: 'Dr. Brian Hutcheson',
      text: "That's common. Remember to keep your hips level. We can review it next time.",
      timestamp: '9:22 AM',
      isOwn: false,
    },
    {
      id: 104,
      sender: 'Dr. Brian Hutcheson',
      text: "Also, let's schedule that follow-up appointment we discussed.",
      timestamp: '10:35 AM',
      isOwn: false,
    },
  ];

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    Alert.alert(
      'Send Message',
      `Sending message: ${newMessage} to conversation ID: ${currentConversationId}`,
    );
    setNewMessage('');
  };

  const handleConversationSelect = conversationId => {
    setCurrentConversationId(conversationId);
    if (width <= 768) {
      setIsChatViewActiveOnMobile(true);
    }
  };

  const handleBackToList = () => {
    setIsChatViewActiveOnMobile(false);
  };

  const currentMessages = selectedMessages.filter(() => {
    if (currentConversationId === 1) return true;
    return false;
  });

  const selectedConversationName =
    conversations.find(c => c.id === currentConversationId)?.name || 'Messages';

  const ConversationList = () => (
    <View style={styles.conversationList}>
      <CustomText style={styles.sectionTitle}>Conversations</CustomText>
      {conversations.map(conv => (
        <TouchableOpacity
          key={conv.id}
          style={[
            styles.conversationItem,
            conv.id === currentConversationId && styles.selectedConversation,
          ]}
          onPress={() => handleConversationSelect(conv.id)}>
          <View style={styles.conversationContent}>
            <CustomText style={styles.conversationName}>{conv.name}</CustomText>
            <CustomText style={styles.conversationPreview} numberOfLines={1}>
              {conv.preview}
            </CustomText>
          </View>
          <View style={styles.conversationMeta}>
            <CustomText style={styles.timestamp}>{conv.timestamp}</CustomText>
            {conv.unread > 0 && (
              <View style={styles.unreadBadge}>
                <CustomText style={styles.unreadCount}>{conv.unread}</CustomText>
              </View>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const ChatArea = () => (
    <View style={styles.chatArea}>
      <View style={styles.chatHeader}>
        {isChatViewActiveOnMobile && width <= 768 && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackToList}>
            <Icon name="arrow-back" size={24} color="#2196F3" />
          </TouchableOpacity>
        )}
        <CustomText style={styles.chatTitle}>{selectedConversationName}</CustomText>
      </View>

      <ScrollView style={styles.messageDisplay}>
        {currentMessages.map(msg => (
          <View
            key={msg.id}
            style={[
              styles.messageBubble,
              msg.isOwn ? styles.ownMessage : styles.otherMessage,
            ]}>
            <CustomText style={styles.messageText}>{msg.text}</CustomText>
            <CustomText style={styles.messageMeta}>
              {msg.sender} - {msg.timestamp}
            </CustomText>
          </View>
        ))}
      </ScrollView>

      <View style={styles.composeBox}>
        <TextInput
          style={styles.messageInput}
          placeholder="Type your message..."
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          value={newMessage}
          onChangeText={setNewMessage}
          onSubmitEditing={handleSendMessage}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendMessage}>
          <Icon name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <CustomText style={styles.headerTitle}>Messages</CustomText>
        <View style={styles.headerRight} />
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        {width <= 768 ? (
          isChatViewActiveOnMobile ? (
            <ChatArea />
          ) : (
            <ConversationList />
          )
        ) : (
          <View style={styles.desktopLayout}>
            <ConversationList />
            <ChatArea />
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerRight: {
    width: 44,
  },
  content: {
    flex: 1,
  },
  desktopLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  conversationList: {
    width: width <= 768 ? '100%' : 280,
    borderRightWidth: width <= 768 ? 0 : 1,
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  conversationItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  selectedConversation: {
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(33, 150, 243, 0.3)',
  },
  conversationContent: {
    flex: 1,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  conversationPreview: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  conversationMeta: {
    position: 'absolute',
    top: 12,
    right: 12,
    alignItems: 'flex-end',
  },
  timestamp: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 4,
  },
  unreadBadge: {
    backgroundColor: '#2196F3',
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadCount: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  chatArea: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  chatTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  messageDisplay: {
    flex: 1,
    padding: 16,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 15,
    marginBottom: 12,
  },
  ownMessage: {
    backgroundColor: '#2196F3',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  messageMeta: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  composeBox: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    gap: 8,
  },
  messageInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  sendButton: {
    width: 44,
    height: 44,
    backgroundColor: '#2196F3',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MessagesScreen; 