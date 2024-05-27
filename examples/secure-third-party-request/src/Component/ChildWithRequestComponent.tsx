/* (c) Copyright Frontify Ltd., all rights reserved. */

import {usePlatformAppBridge} from "@frontify/app-bridge";
import { Button } from "@frontify/fondue/components";

export const ChildWithRequestComponent = () => {
    const appBridge = usePlatformAppBridge();

// Secure Request
    const onPress = async () => {
        const output = await appBridge?.api({
            name: 'getSecretRequest',
            payload: { id: 'body-endpoint-id', requestParams: { title: "Example Service" } },
        });

        const { data: { body, title } }: any = output;

        console.log(body, title);
    };

    return (
        <Button onPress={onPress}>Call the Secure Request</Button>
    )
};
