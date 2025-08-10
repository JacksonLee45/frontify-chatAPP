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

    return (
        <div className="tw-p-4 tw-max-w-2xl tw-mx-auto">
            <div className="tw-mb-4">
                <h2 className="tw-text-xl tw-font-bold tw-mb-4">ChatGPT Assistant</h2>
                
                {/* Chat Messages */}
                <div className="tw-border tw-rounded-lg tw-p-4 tw-h-96 tw-overflow-y-auto tw-mb-4 tw-bg-gray-50">
                    {messages.length === 0 ? (
                        <p className="tw-text-gray-500 tw-text-center">Start a conversation with ChatGPT...</p>
                    ) : (
                        messages.map((message, index) => (
                            <div
                                key={index}
                                className={`tw-mb-3 tw-p-3 tw-rounded-lg ${
                                    message.role === 'user'
                                        ? 'tw-bg-blue-100 tw-ml-8'
                                        : 'tw-bg-white tw-mr-8'
                                }`}
                            >
                                <div className="tw-font-semibold tw-text-sm tw-mb-1">
                                    {message.role === 'user' ? 'You' : 'ChatGPT'}
                                </div>
                                <div className="tw-text-sm">{message.content}</div>
                            </div>
                        ))
                    )}
                    {isLoading && (
                        <div className="tw-bg-white tw-mr-8 tw-mb-3 tw-p-3 tw-rounded-lg">
                            <div className="tw-font-semibold tw-text-sm tw-mb-1">ChatGPT</div>
                            <div className="tw-text-sm tw-text-gray-500">Thinking...</div>
                        </div>
                    )}
                </div>

                {/* Error Display */}
                {error && (
                    <div className="tw-bg-red-100 tw-border tw-border-red-400 tw-text-red-700 tw-px-4 tw-py-3 tw-rounded tw-mb-4">
                        {error}
                    </div>
                )}

                {/* Input Area */}
                <div className="tw-flex tw-gap-2">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
                        placeholder="Type your message..."
                        className="tw-flex-1 tw-border tw-rounded-lg tw-px-3 tw-py-2 tw-text-sm"
                        disabled={isLoading}
                    />
                    <Button 
                        onPress={sendMessage} 
                        disabled={isLoading || !userInput.trim()}
                    >
                        {isLoading ? 'Sending...' : 'Send'}
                    </Button>
                </div>
            </div>
        </div>
    );
};