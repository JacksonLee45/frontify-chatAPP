/* (c) Copyright Frontify Ltd., all rights reserved. */

import { usePlatformAppBridge } from '@frontify/app-bridge';
import { Button } from '@frontify/fondue/components';

export const ChildWithRequestComponent = () => {
    const appBridge = usePlatformAppBridge();

    /**
     * Here, you can call the Secure request to retrieve an API token value
     * using the `getSecretRequest` method from appBridge.api.
     *
     * Note that the id in the payload example: `id: 'body-endpoint-id'`
     * is the same endpoint name you define in the `manifest.json`.
     */
    const onPress = async () => {
        const output = await appBridge?.api({
            name: 'getSecretRequest',
            payload: { id: 'body-endpoint-id', requestParams: { title: 'title' } },
        });

        const {
            data: { body, title },
        }: any = output;

        console.log(body, title);
    };

    return <Button onPress={onPress}>Call the Secure Request</Button>;
};
