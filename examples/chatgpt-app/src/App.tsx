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
        <div className="tw-font-body tw-text-text tw-min-h-screen tw-bg-base tw-flex tw-flex-col tw-p-6">
            {/* Header */}
            <div className="tw-text-center tw-mb-8">
                <Heading size="xx-large" weight="strong">
                    Frontify ChatGPT Assistant
                </Heading>
                <Flex direction="column">
                    <p className="tw-text-text-weak tw-mb-1">
                        Generate brand-approved messaging and content with AI assistance
                    </p>
                    <p className="tw-text-text-weak tw-text-body-small">
                        [Surface] Running in: {context.surface}
                    </p>
                </Flex>
            </div>

            {/* Main Chat Interface */}
            <div className="tw-flex-1">
                <ChatGPTComponent />
            </div>

            {/* Footer */}
            <div className="tw-text-center tw-mt-8 tw-pt-4 tw-border-t tw-border-line">
                <p className="tw-text-text-weak tw-text-body-small">
                    Powered by OpenAI's ChatGPT • Built with Frontify's Brand SDK
                </p>
            </div>
        </div>
    );
};