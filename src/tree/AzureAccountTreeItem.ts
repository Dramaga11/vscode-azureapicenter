// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { AzureSubscription, AzureSubscriptionProvider } from "@microsoft/vscode-azext-azureauth";
import { AzureAccountTreeItemBase, SubscriptionTreeItemBase } from "@microsoft/vscode-azext-azureutils";
import { AzExtTreeItem, AzureWizardPromptStep, GenericTreeItem, IActionContext, ISubscriptionActionContext, ISubscriptionContext } from "@microsoft/vscode-azext-utils";
import * as vscode from "vscode";
import { createSubscriptionContext } from "../azure/azureAccount/VSCodeAuthentication";
import { ext } from "../extensionVariables";
import { SubscriptionTreeItem } from "./SubscriptionTreeItem";
export class AzureAccountTreeItem extends AzureAccountTreeItemBase {
  public createSubscriptionTreeItem(root: ISubscriptionContext): SubscriptionTreeItemBase {
    return new SubscriptionTreeItem(this, root);
  }
}

const signInLabel: string = vscode.l10n.t('Sign in to Azure...');
const createAccountLabel: string = vscode.l10n.t('Create an Azure Account...');
const createStudentAccountLabel: string = vscode.l10n.t('Create an Azure for Students Account...');
const selectSubscriptionsLabel: string = vscode.l10n.t('Select Subscriptions...');
const signInCommandId: string = 'azure-api-center.logIn';
const createAccountCommandId: string = 'azure-account.createAccount';
const createStudentAccountCommandId: string = 'azure-account.createStudentAccount';
const selectSubscriptionsCommandId: string = 'azure-account.selectSubscriptions';
const azureAccountExtensionId: string = 'ms-vscode.azure-account';
const extensionOpenCommand: string = 'extension.open';
export class AzureAccountTreeItemD1 extends AzureAccountTreeItemBase {
  public disposables: vscode.Disposable[] = [];
  private statusSubscription: vscode.Disposable | undefined;
  public static contextValue: string = 'azureextensionui.azureAccount';
  public readonly contextValue: string = AzureAccountTreeItemBase.contextValue;
  public readonly label: string = 'Azure';
  private subscriptionProvider: AzureSubscriptionProvider | undefined;
  private _subscriptionTreeItems: SubscriptionTreeItemBase[] | undefined;
  public createSubscriptionTreeItem(root: ISubscriptionContext): SubscriptionTreeItemBase | Promise<SubscriptionTreeItemBase> {
    return new SubscriptionTreeItem(this, root);
  }
  public dispose(): void {
    vscode.Disposable.from(...this.disposables).dispose();
  }
  public async getSubscriptionPromptStep(wizardContext: Partial<ISubscriptionActionContext>): Promise<AzureWizardPromptStep<ISubscriptionActionContext> | undefined> {
    throw new Error("Method is not implemented")
  }
  public async getIsLoggedIn(): Promise<boolean> {
    let _isLoggingIn: boolean = false;
    try {
      const provider = await ext.subscriptionProviderFactory();
      _isLoggingIn = true;
      // ext.actions.refreshAzureTree();  // Refresh to cause the "logging in" spinner to show
      await provider.signIn();
    } finally {
      _isLoggingIn = false;
      // ext.actions.refreshAzureTree(); // Refresh now that sign in is complete
    }
    return _isLoggingIn;
  }
  public hasMoreChildrenImpl(): boolean {
    return false;
  }
  public async loadMoreChildrenImpl(clearCache: boolean, context: IActionContext): Promise<AzExtTreeItem[]> {
    const subscriptionProvider = await this.getAzureSubscriptionProvider();
    if (subscriptionProvider) {
      if (await subscriptionProvider.isSignedIn()) {
        let subscriptions: AzureSubscription[] = await subscriptionProvider.getSubscriptions(true);
        if (subscriptions.length == 0) {

        } else {
          // let subscriptionContext: createSubscriptionContext(subscription),
          return await this.createTreeItemsWithErrorHandling(
            subscriptions,
            'invalidApiCenter',
            async sub => new SubscriptionTreeItem(this, createSubscriptionContext(sub)),
            sub => sub.name
          );
        }
      }
    }


    // show sign in treeview
    const contextValue: string = 'azureCommand';
    return [
      new GenericTreeItem(this, { label: signInLabel, commandId: signInCommandId, contextValue, id: signInCommandId, iconPath: new vscode.ThemeIcon('sign-in'), includeInTreeItemPicker: true }),
      new GenericTreeItem(this, { label: createAccountLabel, commandId: createAccountCommandId, contextValue, id: createAccountCommandId, iconPath: new vscode.ThemeIcon('add'), includeInTreeItemPicker: true })
    ];
  }
  public async getAzureSubscriptionProvider(): Promise<AzureSubscriptionProvider> {
    if (!this.subscriptionProvider) {
      this.subscriptionProvider = await ext.subscriptionProviderFactory();
    }
    this.statusSubscription = vscode.authentication.onDidChangeSessions((evt: vscode.AuthenticationSessionsChangeEvent) => {
      if (evt.provider.id === 'microsoft') {
        if (Date.now() > nextSessionChangeMessageMinimumTime) {
          nextSessionChangeMessageMinimumTime = Date.now() + sessionChangeMessageInterval;
          // This event gets HEAVILY spammed and needs to be debounced
          // Suppress additional messages for 1 second after the first one
          // this.notifyTreeDataChanged();
        }
      }
    });
    return this.subscriptionProvider;
  }
}
let nextSessionChangeMessageMinimumTime = 0;
const sessionChangeMessageInterval = 1 * 1000; // 1 second
