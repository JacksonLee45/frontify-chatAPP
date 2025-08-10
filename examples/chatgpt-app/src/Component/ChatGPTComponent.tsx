/* (c) Copyright Frontify Ltd., all rights reserved. */

import { AppBridgePlatformApp } from '@frontify/app-bridge-app';
import { Button } from '@frontify/fondue/components';
import { useState } from 'react';

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

    const sendMessage = async () => {
        if (!userInput.trim()) return;

        const newUserMessage: ChatMessage = { role: 'user', content: userInput };
        const updatedMessages = [...messages, newUserMessage];
        setMessages(updatedMessages);
        setUserInput('');
        setIsLoading(true);
        setError(null);

        try {
            // Prepare messages for OpenAI API format
            const apiMessages = updatedMessages.map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            console.log('API messages:', apiMessages);

            const response = await appBridge.api({
                name: 'getSecureRequest',
                payload: {
                    endpoint: 'chatgpt-completion',
                    requestParams: {
                        messages: apiMessages
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
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearChat = () => {
        setMessages([]);
        setError(null);
    };

    return (
        <div className="tw-w-full tw-max-w-4xl tw-mx-auto tw-p-4">
            {/* Chat Messages */}
            <div className="tw-border tw-border-line tw-rounded-lg tw-bg-surface tw-mb-4 tw-h-96 tw-overflow-y-auto tw-p-4">
                {messages.length === 0 ? (
                    <div className="tw-text-text-weak tw-text-center tw-py-8">
                        <p>Start a conversation with ChatGPT!</p>
                        <p className="tw-text-sm tw-mt-2">Try asking for help with marketing copy, brand messaging, or content ideas.</p>
                    </div>
                ) : (
                    <div className="tw-space-y-4">
                        {messages.map((message, index) => (
                            <div key={index} className={`tw-flex ${message.role === 'user' ? 'tw-justify-end' : 'tw-justify-start'}`}>
                                <div className={`tw-max-w-xs tw-lg:max-w-md tw-px-4 tw-py-2 tw-rounded-lg ${
                                    message.role === 'user' 
                                        ? 'tw-bg-brand tw-text-brand-contrast' 
                                        : 'tw-bg-surface-variant tw-text-text'
                                }`}>
                                    <div className="tw-text-xs tw-font-medium tw-mb-1 tw-opacity-70">
                                        {message.role === 'user' ? 'You' : 'ChatGPT'}
                                    </div>
                                    <div className="tw-whitespace-pre-wrap">{message.content}</div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="tw-flex tw-justify-start">
                                <div className="tw-bg-surface-variant tw-px-4 tw-py-2 tw-rounded-lg tw-flex tw-items-center tw-space-x-2">
                                    <div className="tw-animate-spin tw-rounded-full tw-h-4 tw-w-4 tw-border-2 tw-border-brand tw-border-t-transparent"></div>
                                    <span className="tw-text-text-weak">ChatGPT is thinking...</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Error Display */}
            {error && (
                <div className="tw-mb-4 tw-p-4 tw-bg-red-50 tw-border tw-border-red-200 tw-rounded-lg">
                    <div className="tw-text-red-800">{error}</div>
                </div>
            )}

            {/* Input Area */}
            <div className="tw-space-y-4">
                <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
                    rows={3}
                    className="tw-w-full tw-p-3 tw-border tw-border-line tw-rounded-lg tw-bg-surface tw-text-text tw-resize-none focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-brand focus:tw-border-transparent"
                    disabled={isLoading}
                />
                <div className="tw-flex tw-justify-between tw-items-center">
                    <Button 
                        onPress={clearChat} 
                        //variant="secondary"
                        disabled={messages.length === 0}
                    >
                        Clear Chat
                    </Button>
                    <Button 
                        onPress={sendMessage} 
                        disabled={!userInput.trim() || isLoading}
                    >
                        {isLoading ? 'Sending...' : 'Send Message'}
                    </Button>
                </div>
            </div>

            {/* Usage Tips */}
            <div className="tw-mt-6 tw-p-4 tw-bg-surface-variant tw-rounded-lg">
                <h4 className="tw-font-medium tw-text-text tw-mb-2">💡 Usage Tips:</h4>
                <ul className="tw-text-sm tw-text-text-weak tw-space-y-1">
                    <li>• Ask for help with marketing copy and brand messaging</li>
                    <li>• Request content ideas for campaigns or social media</li>
                    <li>• Get suggestions for headlines, taglines, or product descriptions</li>
                    <li>• Use Shift+Enter to add line breaks in your messages</li>
                </ul>
            </div>
        </div>
    );
};