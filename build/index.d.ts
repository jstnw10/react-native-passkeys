import type { AuthenticationExtensionsLargeBlobInputs, AuthenticationResponseJSON, PublicKeyCredentialCreationOptionsJSON, PublicKeyCredentialRequestOptionsJSON, RegistrationResponseJSON } from './ReactNativePasskeys.types';
export declare function isSupported(): boolean;
export declare function isAutoFillAvalilable(): boolean;
export interface PasskeysConfig {
    /**
     * Options and configuration specific to the iOS platform.
     */
    ios?: {
        /**
         * Defines the [local authentication policy](https://developer.apple.com/documentation/localauthentication/lapolicy) to use:
         * - `true`: Use the `deviceOwnerAuthenticationWithBiometrics` policy.
         * - `false`: Use the `deviceOwnerAuthentication` policy.
         * Defaults to `true`.
         *
         * @see {@linkcode https://developer.apple.com/documentation/localauthentication/lapolicy/deviceownerauthenticationwithbiometrics|LAPolicy.deviceOwnerAuthenticationWithBiometrics}
         * @see {@linkcode https://developer.apple.com/documentation/localauthentication/lapolicy/deviceownerauthentication|LAPolicy.deviceOwnerAuthentication}
         */
        requireBiometrics?: boolean;
    };
}
export interface PasskeysCreateOptions extends PasskeysConfig {
}
export declare function create(request: Omit<PublicKeyCredentialCreationOptionsJSON, 'extensions'> & {
    extensions?: {
        largeBlob?: AuthenticationExtensionsLargeBlobInputs;
    };
} & Pick<CredentialCreationOptions, 'signal'>, options?: PasskeysCreateOptions): Promise<RegistrationResponseJSON | null>;
export interface PasskeysGetOptions extends PasskeysConfig {
}
export declare function get(request: Omit<PublicKeyCredentialRequestOptionsJSON, 'extensions'> & {
    extensions?: {
        largeBlob?: AuthenticationExtensionsLargeBlobInputs;
    };
}, options?: PasskeysGetOptions): Promise<AuthenticationResponseJSON | null>;
//# sourceMappingURL=index.d.ts.map