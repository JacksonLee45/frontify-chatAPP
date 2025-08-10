/* (c) Copyright Frontify Ltd., all rights reserved. */

import './App.css';
import { appContext } from '@frontify/app-bridge-app';
import { Flex, Heading } from '@frontify/fondue';

import { ChatGPTComponent } from './Component/ChatGPTComponent.tsx';

export const App = () => {
    /**
     * The App-Bridge package is included as a dependency by default.
     * In this example, we are retrieving the context from the App
     *
     * For more information, please refer to our documentation.
     */
    const context = appContext();
    
    /**
     * We recommend building your apps using our Design System, Fondue.
     * fondue-tokens are often used for styling.
     * All the Tailwind classes derived from our tokens have the 'tw-' prefix.
     */
    return (
        <div className="tw-font-body tw-text-text tw-h-screen tw-bg-base tw-flex tw-flex-col">
            {/* Header - Minimal */}
            <div className="tw-flex-shrink-0 tw-text-center tw-py-4 tw-px-6">
                <Heading size="large" weight="strong">
                    Frontify ChatGPT Assistant
                </Heading>
            </div>

            {/* Main Chat Interface - Takes remaining space */}
            <div className="tw-flex-1 tw-p-6 tw-overflow-hidden">
                <ChatGPTComponent />
            </div>
        </div>
    );
};