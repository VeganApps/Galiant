import { generateAPIUrl } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { 
  FadeIn, 
  FadeOut, 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withRepeat,
  withSequence,
} from "react-native-reanimated";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

const promptQuestions = [
  "How can I save more money each month?",
  "Create a budget for my monthly expenses",
  "Analyze my spending patterns",
  "What are the best investment strategies?",
  "Help me plan for retirement",
  "How to reduce my monthly bills?"
];

export default function AIChatScreen() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const opacity = useSharedValue(1);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: Date.now(),
    };

    // Add user message to state
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(generateAPIUrl("/api/watson-chat"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage.content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get response");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => setIsKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setIsKeyboardVisible(false)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Animate prompt questions every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      opacity.value = withSequence(
        withTiming(0, { duration: 400 }),
        withTiming(1, { duration: 400 })
      );
      
      setTimeout(() => {
        setCurrentPromptIndex((prev) => (prev + 1) % promptQuestions.length);
      }, 400);
    }, 5000);

    return () => clearInterval(interval);
  }, [opacity]);

  if (error) {
    return (
      <LinearGradient
        colors={["#F8FAFC", "#F0FDF4"]}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={48} color="#EF4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#F8FAFC", "#F0FDF4"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {/* Chat Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.chatContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.chatContent}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
          >
            {/* Always visible greeting */}
            <View style={styles.welcomeContainer}>
              <View style={styles.welcomeHeader}>
                <Text style={styles.welcomeTitle}>Hey there! 👋</Text>
              </View>
              <View style={styles.welcomeContent}>
                <Text style={styles.welcomeText}>
                  I'm Galiant, your AI finance assistant! 💰✨ I'm here to help
                  you take control of your money and make your financial dreams
                  come true.
                </Text>
                <Text style={styles.welcomeText}>
                  Ask me anything about your finances, budgeting tips, or let's
                  create some amazing goals together! What would you like to
                  explore first? 🚀
                </Text>
              </View>
            </View>

            {messages.map((message) => (
              <View key={message.id} style={styles.messageContainer}>
                <View
                  style={[
                    styles.messageBubble,
                    message.role === "user"
                      ? styles.userMessage
                      : styles.aiMessage,
                  ]}
                >
                  {message.role === "assistant" && (
                    <View style={styles.aiIcon}>
                      <LinearGradient
                        colors={["#10B981", "#059669"]}
                        style={styles.aiIconGradient}
                      >
                        <Ionicons name="sparkles" size={16} color="white" />
                      </LinearGradient>
                    </View>
                  )}
                  <View style={styles.messageContent}>
                    <Text
                      style={[
                        styles.messageText,
                        message.role === "user"
                          ? styles.userMessageText
                          : styles.aiMessageText,
                      ]}
                    >
                      {message.content}
                    </Text>
                  </View>
                </View>
              </View>
            ))}

            {isLoading && (
              <View style={styles.loadingContainer}>
                <View style={styles.loadingBubble}>
                  <View style={styles.aiIcon}>
                    <LinearGradient
                      colors={["#10B981", "#059669"]}
                      style={styles.aiIconGradient}
                    >
                      <Ionicons name="sparkles" size={16} color="white" />
                    </LinearGradient>
                  </View>
                  <View style={styles.typingIndicator}>
                    <View style={styles.typingDot} />
                    <View style={[styles.typingDot, styles.typingDotDelay1]} />
                    <View style={[styles.typingDot, styles.typingDotDelay2]} />
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Animated Sample Prompts */}
          {messages.length === 0 && (
            <View style={styles.samplePromptsContainer}>
              <Text style={styles.samplePromptsTitle}>Try asking:</Text>
              <View style={styles.promptBubbleWrapper}>
                <TouchableOpacity 
                  style={styles.promptBubbleContainer}
                  onPress={() => setInput(promptQuestions[currentPromptIndex])}
                  activeOpacity={0.8}
                >
                  <Animated.View 
                    style={[
                      styles.promptBubble,
                    useAnimatedStyle(() => ({
                      opacity: 1,
                      transform: [
                        {
                          translateY: withRepeat(
                            withSequence(
                              withTiming(-8, { duration: 2000 }),
                              withTiming(0, { duration: 2000 })
                            ),
                            -1,
                            false
                          )
                        }
                      ]
                    }))
                    ]}
                  >
                    <View style={styles.promptContent}>
                      <Text style={styles.promptText}>
                        {promptQuestions[currentPromptIndex] || "Test Question"}
                      </Text>
                    </View>
                  </Animated.View>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Input Area */}
          <View
            style={[
              styles.inputContainer,
              isKeyboardVisible ? styles.inputContainerKeyboard : null,
            ]}
          >
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="Ask me anything about your finances! 💬"
                placeholderTextColor="#9CA3AF"
                value={input}
                onChangeText={setInput}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSendMessage}
                disabled={!input.trim() || isLoading}
              >
                <LinearGradient
                  colors={
                    input.trim() && !isLoading
                      ? ["#10B981", "#059669"]
                      : ["#D1D5DB", "#9CA3AF"]
                  }
                  style={styles.sendButtonGradient}
                >
                  <Ionicons name="send" size={20} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  chatContent: {
    paddingBottom: 100,
  },
  welcomeContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.1)",
  },
  welcomeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
  },
  welcomeContent: {
    marginBottom: 0,
  },
  welcomeText: {
    fontSize: 16,
    color: "#4B5563",
    lineHeight: 24,
    marginBottom: 12,
  },
  messageContainer: {
    marginVertical: 8,
  },
  messageBubble: {
    flexDirection: "row",
    alignItems: "flex-start",
    maxWidth: "85%",
  },
  userMessage: {
    alignSelf: "flex-end",
  },
  aiMessage: {
    alignSelf: "flex-start",
  },
  aiIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  aiIconGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  messageContent: {
    flex: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: "white",
    backgroundColor: "#10B981",
    padding: 12,
    borderRadius: 16,
    borderBottomRightRadius: 4,
  },
  aiMessageText: {
    color: "#1F2937",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  loadingContainer: {
    marginVertical: 8,
    alignSelf: "flex-start",
  },
  loadingBubble: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#9CA3AF",
    marginHorizontal: 2,
    opacity: 0.4,
  },
  typingDotDelay1: {
    opacity: 0.6,
  },
  typingDotDelay2: {
    opacity: 0.8,
  },
  samplePromptsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "transparent",
  },
  samplePromptsTitle: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  promptBubbleWrapper: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: 20,
  },
  promptBubbleContainer: {
    alignSelf: "flex-end",
  },
  promptBubble: {
    maxWidth: "85%",
    backgroundColor: "#10B981",
    padding: 20,
    borderRadius: 20,
    borderBottomRightRadius: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 2,
    borderColor: "#059669",
  },
  promptContent: {
    flex: 1,
  },
  promptText: {
    fontSize: 18,
    color: "#FFFFFF",
    lineHeight: 24,
    fontWeight: "700",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  inputContainer: {
    paddingHorizontal: 0,
    paddingVertical: 16,
    backgroundColor: "transparent",
    marginBottom: 72,
  },
  inputContainerKeyboard: {
    marginBottom: 0,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 32,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 14,
    width: "90%",
    alignSelf: "center",
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
    maxHeight: 100,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  sendButton: {
    marginLeft: 8,
  },
  sendButtonGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 16,
    color: "#EF4444",
    textAlign: "center",
    marginTop: 16,
  },
});
