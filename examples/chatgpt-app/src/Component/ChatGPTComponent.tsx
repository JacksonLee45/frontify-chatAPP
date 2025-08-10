/* (c) Copyright Frontify Ltd., all rights reserved. */

import { AppBridgePlatformApp } from '@frontify/app-bridge-app';
import { Button } from '@frontify/fondue/components';
import { useState, useRef, useEffect } from 'react';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export const ChatGPTComponent = () => {
    const appBridge = new AppBridgePlatformApp();
    const [userInput, setUserInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages are added
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const sendMessage = async () => {
        if (!userInput.trim()) return;

        const newUserMessage: ChatMessage = { role: 'user', content: userInput };
        const updatedMessages = [...messages, newUserMessage];
        setMessages(updatedMessages);
        setUserInput('');
        setIsLoading(true);
        setError(null);

        try {
            // For now, we'll send just the current user message due to Frontify limitations
            // This is a simplified approach - full conversation history isn't supported
            const userMessage = userInput;

            console.log('Sending user message:', userMessage);

            const response = await appBridge.api({
                name: 'getSecureRequest',
                payload: {
                    endpoint: 'chatgpt-completion',
                    requestParams: {
                        userMessage: userMessage
                    }
                }
            });

            console.log('ChatGPT API Response:', response);

            // Handle the response - based on actual structure we can see it's in response.data
            const openAIResponse = (response as any).data || response;

            // Check for error responses first
            if ((response as any).status && (response as any).status !== '200' && (response as any).status !== 200) {
                const errorMessage = openAIResponse?.error?.message || `API Error: ${(response as any).status}`;
                throw new Error(errorMessage);
            }

            if (openAIResponse && openAIResponse.choices && openAIResponse.choices[0]) {
                const assistantMessage: ChatMessage = {
                    role: 'assistant',
                    content: openAIResponse.choices[0].message.content
                };
                setMessages([...updatedMessages, assistantMessage]);
            } else {
                console.error('Unexpected response structure:', response);
                throw new Error('Invalid response format from ChatGPT API');
            }
        } catch (err) {
            console.error('Error calling ChatGPT:', err);
            setError('Failed to get response from ChatGPT. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="tw-flex tw-flex-col tw-h-full tw-max-w-4xl tw-mx-auto">
            {/* Error Display */}
            {error && (
                <div className="tw-flex-shrink-0 tw-bg-red-50 tw-border tw-border-red-200 tw-text-red-700 tw-px-4 tw-py-3 tw-rounded-lg tw-mb-4">
                    <div className="tw-flex tw-items-center">
                        <svg className="tw-w-5 tw-h-5 tw-mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </div>
                </div>
            )}

            {/* Chat Messages Container - This will grow to fill available space */}
            <div 
                ref={chatContainerRef}
                className="tw-flex-1 tw-border tw-border-line tw-rounded-lg tw-bg-base-weak tw-overflow-hidden tw-flex tw-flex-col tw-min-h-0"
            >
                <div className="tw-flex-1 tw-overflow-y-auto tw-p-4 tw-space-y-4">
                    {messages.length === 0 ? (
                        <div className="tw-flex tw-items-center tw-justify-center tw-h-full tw-min-h-[200px]">
                            <div className="tw-text-center">
                                <p className="tw-text-text-weak tw-text-lg">Start a conversation with ChatGPT</p>
                                <p className="tw-text-text-weak tw-text-sm tw-mt-1">Ask questions, get creative ideas, or brainstorm solutions</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`tw-flex ${message.role === 'user' ? 'tw-justify-end' : 'tw-justify-start'}`}
                                >
                                    <div
                                        className={`tw-max-w-[80%] tw-p-4 tw-rounded-lg tw-shadow-sm ${
                                            message.role === 'user'
                                                ? 'tw-bg-blue-600 tw-text-white'
                                                : 'tw-bg-white tw-border tw-border-line'
                                        }`}
                                    >
                                        <div className={`tw-font-semibold tw-text-xs tw-mb-2 tw-uppercase tw-tracking-wide ${
                                            message.role === 'user' ? 'tw-text-blue-100' : 'tw-text-text-weak'
                                        }`}>
                                            {message.role === 'user' ? 'You' : 'ChatGPT'}
                                        </div>
                                        <div className={`tw-text-sm tw-leading-relaxed tw-whitespace-pre-wrap ${
                                            message.role === 'user' ? 'tw-text-white' : 'tw-text-text'
                                        }`}>
                                            {message.content}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {/* Loading indicator */}
                            {isLoading && (
                                <div className="tw-flex tw-justify-start">
                                    <div className="tw-max-w-[80%] tw-p-4 tw-rounded-lg tw-bg-white tw-border tw-border-line tw-shadow-sm">
                                        <div className="tw-font-semibold tw-text-xs tw-mb-2 tw-uppercase tw-tracking-wide tw-text-text-weak">
                                            ChatGPT
                                        </div>
                                        <div className="tw-flex tw-items-center tw-space-x-2">
                                            <div className="tw-flex tw-space-x-1">
                                                <div className="tw-w-2 tw-h-2 tw-bg-gray-400 tw-rounded-full tw-animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                <div className="tw-w-2 tw-h-2 tw-bg-gray-400 tw-rounded-full tw-animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                <div className="tw-w-2 tw-h-2 tw-bg-gray-400 tw-rounded-full tw-animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                            </div>
                                            <span className="tw-text-sm tw-text-text-weak">Thinking...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* Scroll anchor */}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>
            </div>

            {/* Input Area - Fixed at bottom */}
            <div className="tw-flex-shrink-0 tw-mt-4">
                <div className="tw-flex tw-gap-2 tw-bg-white tw-border tw-border-line tw-rounded-lg tw-p-2 tw-shadow-sm">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message here... (Press Enter to send)"
                        className="tw-flex-1 tw-border-0 tw-outline-none tw-px-3 tw-py-2 tw-text-sm tw-bg-transparent tw-resize-none tw-placeholder-text-weak"
                        disabled={isLoading}
                    />
                    <Button 
                        onPress={sendMessage} 
                        disabled={isLoading || !userInput.trim()}
                        emphasis={userInput.trim() ? 'default' : 'weak'}
                    >
                        {isLoading ? (
                            <div className="tw-flex tw-items-center tw-space-x-2">
                                <svg className="tw-animate-spin tw-w-4 tw-h-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="tw-opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="tw-opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Sending</span>
                            </div>
                        ) : (
                            <>
                                <span>Send</span>
                                <svg className="tw-w-4 tw-h-4 tw-ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </>
                        )}
                    </Button>
                </div>
                <p className="tw-text-xs tw-text-text-weak tw-mt-2 tw-text-center">
                    Press Enter to send • Shift+Enter for new line
                </p>
            </div>
        </div>
    );
};