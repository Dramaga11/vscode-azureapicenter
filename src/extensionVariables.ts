// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { AzureSubscriptionProvider } from "@microsoft/vscode-azext-azureauth";
import { AzExtTreeDataProvider, IAzExtOutputChannel } from "@microsoft/vscode-azext-utils";
import { ExtensionContext } from "vscode";
import { ApiVersionDefinitionTreeItem } from "./tree/ApiVersionDefinitionTreeItem";
import { AzureAccountTreeItemD1 } from "./tree/AzureAccountTreeItem";
import { OpenApiEditor } from "./tree/Editors/openApi/OpenApiEditor";
/**
 * Namespace for common variables used throughout the extension. They must be initialized in the activate() method of extension.ts
 */


export namespace ext {
    export let prefix: string = 'azureAPICenter';
    export let context: ExtensionContext;
    export let treeItem: AzureAccountTreeItemD1;
    export let treeDataProvider: AzExtTreeDataProvider;
    export let outputChannel: IAzExtOutputChannel;
    export let openApiEditor: OpenApiEditor;
    export let selectedApiVersionDefinitionTreeItem: ApiVersionDefinitionTreeItem;
    export let subscriptionProviderFactory: () => Promise<AzureSubscriptionProvider>;
}
