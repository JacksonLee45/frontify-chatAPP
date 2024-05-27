/* (c) Copyright Frontify Ltd., all rights reserved. */

import './App.css';
import { type PlatformAppContext, usePlatformAppBridge } from '@frontify/app-bridge';
import { useEffect, useState } from 'react';
import { Flex, Heading } from "@frontify/fondue";
import {ChildWithRequestComponent} from "./Component/ChildWithRequestComponent.tsx";

export const App = () => {
    /**
     * The App-Bridge package is included as a dependency by default.
     * In this example, we are retrieving the context from the platform
     * using the PlatformAppBridge hook.
     *
     * There are more hooks and utilities available that you can use.
     * For more information, please refer to our documentation.
     */
    const appBridge = usePlatformAppBridge();
    const [context, setContext] = useState<PlatformAppContext>();

    useEffect(() => {
        if (!appBridge) {
            return;
        }

        setContext(appBridge.context().get());
    }, [appBridge]);

    /**
     * We recommend building your apps using our Design System, Fondue.
     * fondue-tokens are often used for styling.
     * All the Tailwind classes derived from our tokens have the 'tw-' prefix.
     */
    return (
        <div
            className="tw-font-body tw-text-text tw-h-screen tw-bg-base tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-y-6">
            <Heading size="xx-large" weight="strong">App connected!</Heading>
            <Flex direction="column">
                <p>Congratulations! You've successfully connected your app to our platform.</p>
                {
                    context && (
                        <p className="tw-text-text-weak tw-text-body-small">[Surface] Your entrypoint is: {context.surface}</p>
                    )
                }
            </Flex>

            <Flex direction="column">
                <Heading size="x-large" weight="strong">Secure Request feature</Heading>
            </Flex>
            <p>Try calling the Secure Request Service and check the output in the console.</p>
            <ChildWithRequestComponent/>
        </div>
    );
};
