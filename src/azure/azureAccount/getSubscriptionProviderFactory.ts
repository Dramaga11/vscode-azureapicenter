import { AzureSubscriptionProvider, VSCodeAzureSubscriptionProvider } from "@microsoft/vscode-azext-azureauth";
import { settingUtils } from "./settingUtils";
/**
 * Returns a factory function that creates a subscription provider, satisfying the `AzureSubscriptionProvider` interface.
 *
 * If the `useAzureSubscriptionProvider` is set to `true`, an `AzureDevOpsSubscriptionProviderFactory` is returned.
 * Otherwise, a `VSCodeSubscriptionProviderFactory` is returned.
 *
 */
export async function getSelectedTenantAndSubscriptionIds(): Promise<string[]> {
    // clear setting value if there's a value that doesn't include the tenant id
    // see https://github.com/microsoft/vscode-azureresourcegroups/pull/684
    const selectedSubscriptionIds = settingUtils.getGlobalSetting<string[] | undefined>('selectedSubscriptions') ?? [];
    if (selectedSubscriptionIds?.some(id => !id.includes('/'))) {
        await setSelectedTenantAndSubscriptionIds([]);
        return [];
    }

    return selectedSubscriptionIds;
}
async function setSelectedTenantAndSubscriptionIds(tenantAndSubscriptionIds: string[]): Promise<void> {
    await settingUtils.updateGlobalSetting('selectedSubscriptions', tenantAndSubscriptionIds);
}
let vscodeAzureSubscriptionProvider: VSCodeAzureSubscriptionProvider | undefined;
export function getSubscriptionProviderFactory(): () => Promise<AzureSubscriptionProvider> {
    // if this for a nightly test, we want to use the test subscription provider
    return async (): Promise<VSCodeAzureSubscriptionProvider> => {
        vscodeAzureSubscriptionProvider ??= await createVSCodeAzureSubscriptionProvider();
        return vscodeAzureSubscriptionProvider;
    }
}
async function createVSCodeAzureSubscriptionProvider(): Promise<VSCodeAzureSubscriptionProvider> {
    // This will update the selected subscription IDs to ensure the filters are in the form of `${tenantId}/${subscriptionId}`
    await getSelectedTenantAndSubscriptionIds();

    return new VSCodeAzureSubscriptionProvider();
}
