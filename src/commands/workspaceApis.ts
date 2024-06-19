// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { IActionContext } from "@microsoft/vscode-azext-utils";
import * as vscode from 'vscode';
import { ext } from "../extensionVariables";
export async function getDataPlaneApis(context: IActionContext): Promise<any | void> {
    const endpointUrl = await vscode.window.showInputBox({ title: "Input Runtime URL", ignoreFocusOut: true });
    const clientid = await vscode.window.showInputBox({ title: "Input Client ID", ignoreFocusOut: true });
    const tenantid = await vscode.window.showInputBox({ title: "Input Tenant ID", ignoreFocusOut: true });
    if (!endpointUrl || !clientid || !tenantid) {
        return;
    }
    return await startWorkTree(endpointUrl, clientid, tenantid);
}

export async function startWorkTree(endpointUrl: string, clientId: string, tenantId: string) {
    const session = await vscode.authentication.getSession('microsoft', [
        `VSCODE_CLIENT_ID:${clientId}`, // Replace by your client id
        `VSCODE_TENANT:${tenantId}`, // Replace with the tenant ID or common if multi-tenant
        "offline_access", // Required for the refresh token.
        "https://azure-apicenter.net/user_impersonation"
    ], { createIfNone: false });
    if (session?.accessToken) {
        let index = ext.dataPlaneAccounts.findIndex((item) => item.domain == endpointUrl)
        if (index === -1) {
            ext.dataPlaneAccounts.push({ domain: endpointUrl, accessToken: session.accessToken })
        }
    } else {
        vscode.window.showErrorMessage("Please login your Microsoft Account first!");
    }
}
