// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.


import { Environment } from '@azure/ms-rest-azure-env';
import { AzureSubscription } from '@microsoft/vscode-azext-azureauth';
import { AzExtServiceClientCredentials, ISubscriptionContext } from '@microsoft/vscode-azext-utils';
import * as vscode from 'vscode';
/**
 * Converts a VS Code authentication session to an Azure Track 2 compatible compatible credential.
 */
export function createCredential(getSession: (scopes?: string[]) => vscode.ProviderResult<vscode.AuthenticationSession>): AzExtServiceClientCredentials {
    return {
        getToken: async (scopes?: string | string[]) => {
            if (typeof scopes === 'string') {
                scopes = [scopes];
            }

            const session = await getSession(scopes);

            if (session) {
                return {
                    token: session.accessToken
                };
            } else {
                return null;
            }
        }
    };
}
/**
 * Creates a subscription context from an application subscription.
 */
export function createSubscriptionContext(subscription: AzureSubscription): ISubscriptionContext {
    return {
        environment: Environment.AzureCloud,
        isCustomCloud: false,
        subscriptionDisplayName: subscription.name,
        subscriptionId: subscription.subscriptionId,
        subscriptionPath: '',
        tenantId: '',
        userId: '',
        credentials: createCredential(subscription.authentication.getSession)
    };
}
