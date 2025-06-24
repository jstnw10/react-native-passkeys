import { NotSupportedError } from "./errors";
import { base64URLStringToBuffer, bufferToBase64URLString } from "./utils/base64";
export default {
    get name() {
        return "ReactNativePasskeys";
    },
    isAutoFillAvalilable() {
        const globalPublicKeyCredential = window.PublicKeyCredential;
        if (globalPublicKeyCredential.isConditionalMediationAvailable === undefined)
            return new Promise((resolve) => resolve(false));
        return globalPublicKeyCredential.isConditionalMediationAvailable();
    },
    isSupported() {
        return (window?.PublicKeyCredential !== undefined && typeof window.PublicKeyCredential === "function");
    },
    async create({ signal, ...request }) {
        if (!this.isSupported)
            throw new NotSupportedError();
        const credential = (await navigator.credentials.create({
            signal,
            publicKey: {
                ...request,
                challenge: base64URLStringToBuffer(request.challenge),
                user: { ...request.user, id: base64URLStringToBuffer(request.user.id) },
                excludeCredentials: request.excludeCredentials?.map((credential) => ({
                    ...credential,
                    id: base64URLStringToBuffer(credential.id),
                    // TODO: remove the override when typescript has updated webauthn types
                    transports: (credential.transports ?? undefined),
                })),
            },
        }));
        // TODO: remove the override when typescript has updated webauthn types
        const extensions = credential?.getClientExtensionResults();
        warnUserOfMissingWebauthnExtensions(request.extensions, extensions);
        const { largeBlob, ...clientExtensionResults } = extensions;
        if (!credential)
            return null;
        return {
            id: credential.id,
            rawId: credential.id,
            response: {
                clientDataJSON: bufferToBase64URLString(credential.response.clientDataJSON),
                attestationObject: bufferToBase64URLString(credential.response.attestationObject),
                getPublicKey() {
                    return credential.response.getPublicKey();
                },
            },
            authenticatorAttachment: undefined,
            type: "public-key",
            clientExtensionResults: {
                ...clientExtensionResults,
                ...(largeBlob && {
                    largeBlob: {
                        ...largeBlob,
                        blob: largeBlob?.blob ? bufferToBase64URLString(largeBlob.blob) : undefined,
                    },
                }),
            },
        };
    },
    async get({ mediation, signal, ...request }) {
        const credential = (await navigator.credentials.get({
            mediation,
            signal,
            publicKey: {
                ...request,
                extensions: {
                    ...request.extensions,
                    /**
                     * the navigator interface doesn't have a largeBlob property
                     * as it may not be supported by all browsers
                     *
                     * browsers that do not support the extension will just ignore the property so it's safe to include it
                     *
                     * @ts-expect-error:*/
                    largeBlob: request.extensions?.largeBlob?.write
                        ? {
                            ...request.extensions?.largeBlob,
                            write: base64URLStringToBuffer(request.extensions.largeBlob.write),
                        }
                        : request.extensions?.largeBlob,
                },
                challenge: base64URLStringToBuffer(request.challenge),
                allowCredentials: request.allowCredentials?.map((credential) => ({
                    ...credential,
                    id: base64URLStringToBuffer(credential.id),
                    // TODO: remove the override when typescript has updated webauthn types
                    transports: (credential.transports ?? undefined),
                })),
            },
        }));
        // TODO: remove the override when typescript has updated webauthn types
        const extensions = credential?.getClientExtensionResults();
        warnUserOfMissingWebauthnExtensions(request.extensions, extensions);
        const { largeBlob, ...clientExtensionResults } = extensions;
        if (!credential)
            return null;
        return {
            id: credential.id,
            rawId: credential.id,
            response: {
                clientDataJSON: bufferToBase64URLString(credential.response.clientDataJSON),
                authenticatorData: bufferToBase64URLString(credential.response.authenticatorData),
                signature: bufferToBase64URLString(credential.response.signature),
                userHandle: credential.response.userHandle
                    ? bufferToBase64URLString(credential.response.userHandle)
                    : undefined,
            },
            authenticatorAttachment: undefined,
            clientExtensionResults: {
                ...clientExtensionResults,
                ...(largeBlob && {
                    largeBlob: {
                        ...largeBlob,
                        blob: largeBlob?.blob ? bufferToBase64URLString(largeBlob.blob) : undefined,
                    },
                }),
            },
            type: "public-key",
        };
    },
};
/**
 *  warn the user about extensions that they tried to use that are not supported
 */
const warnUserOfMissingWebauthnExtensions = (requestedExtensions, clientExtensionResults) => {
    if (clientExtensionResults) {
        for (const key in requestedExtensions) {
            console.log(key, clientExtensionResults[key]);
            if (typeof clientExtensionResults[key] === "undefined") {
                alert(`Webauthn extension ${key} is undefined -- your browser probably doesn't know about it`);
            }
        }
    }
};
//# sourceMappingURL=ReactNativePasskeysModule.web.js.map