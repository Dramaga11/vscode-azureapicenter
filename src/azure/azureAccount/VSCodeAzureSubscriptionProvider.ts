import type { TenantIdDescription } from '@azure/arm-resources-subscriptions';
import * as vscode from 'vscode';
import type { AzureSubscription, SubscriptionId, TenantId } from './AzureSubscription';
import type { AzureSubscriptionProvider } from './AzureSubscriptionProvider';
/**
 * A class for obtaining Azure subscription information using VSCode's built-in authentication
 * provider.
 */
export declare class VSCodeAzureSubscriptionProvider extends vscode.Disposable implements AzureSubscriptionProvider {
    private readonly onDidSignInEmitter;
    private lastSignInEventFired;
    private suppressSignInEvents;
    private readonly onDidSignOutEmitter;
    private lastSignOutEventFired;
    constructor();
    /**
     * Gets a list of tenants available to the user.
     * Use {@link isSignedIn} to check if the user is signed in to a particular tenant.
     *
     * @returns A list of tenants.
     */
    getTenants(): Promise<TenantIdDescription[]>;
    /**
     * Gets a list of Azure subscriptions available to the user.
     *
     * @param filter - Whether to filter the list returned, according to the list returned
     * by `getTenantFilters()` and `getSubscriptionFilters()`. Optional, default true.
     *
     * @returns A list of Azure subscriptions.
     *
     * @throws A {@link NotSignedInError} If the user is not signed in to Azure.
     * Use {@link isSignedIn} and/or {@link signIn} before this method to ensure
     * the user is signed in.
     */
    getSubscriptions(filter?: boolean): Promise<AzureSubscription[]>;
    /**
     * Checks to see if a user is signed in.
     *
     * @param tenantId (Optional) Provide to check if a user is signed in to a specific tenant.
     *
     * @returns True if the user is signed in, false otherwise.
     */
    isSignedIn(tenantId?: string): Promise<boolean>;
    /**
     * Asks the user to sign in or pick an account to use.
     *
     * @param tenantId (Optional) Provide to sign in to a specific tenant.
     *
     * @returns True if the user is signed in, false otherwise.
     */
    signIn(tenantId?: string): Promise<boolean>;
    /**
     * An event that is fired when the user signs in. Debounced to fire at most once every 5 seconds.
     */
    readonly onDidSignIn: vscode.Event<void>;
    /**
     * Signs the user out
     *
     * @deprecated Not currently supported by VS Code auth providers
     */
    signOut(): Promise<void>;
    /**
     * An event that is fired when the user signs out. Debounced to fire at most once every 5 seconds.
     */
    readonly onDidSignOut: vscode.Event<void>;
    /**
     * Gets the tenant filters that are configured in `azureResourceGroups.selectedSubscriptions`. To
     * override the settings with a custom filter, implement a child class with `getSubscriptionFilters()`
     * and/or `getTenantFilters()` overridden.
     *
     * If no values are returned by `getTenantFilters()`, then all tenants will be scanned for subscriptions.
     *
     * @returns A list of tenant IDs that are configured in `azureResourceGroups.selectedSubscriptions`.
     */
    protected getTenantFilters(): Promise<TenantId[]>;
    /**
     * Gets the subscription filters that are configured in `azureResourceGroups.selectedSubscriptions`. To
     * override the settings with a custom filter, implement a child class with `getSubscriptionFilters()`
     * and/or `getTenantFilters()` overridden.
     *
     * If no values are returned by `getSubscriptionFilters()`, then all subscriptions will be returned.
     *
     * @returns A list of subscription IDs that are configured in `azureResourceGroups.selectedSubscriptions`.
     */
    protected getSubscriptionFilters(): Promise<SubscriptionId[]>;
    /**
     * Gets the subscriptions for a given tenant.
     *
     * @param tenantId The tenant ID to get subscriptions for.
     *
     * @returns The list of subscriptions for the tenant.
     */
    private getSubscriptionsForTenant;
    /**
     * Gets a fully-configured subscription client for a given tenant ID
     *
     * @param tenantId (Optional) The tenant ID to get a client for
     *
     * @returns A client, the credential used by the client, and the authentication function
     */
    private getSubscriptionClient;
}
