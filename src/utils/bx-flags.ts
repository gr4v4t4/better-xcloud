type BxFlags = Partial<{
    CheckForUpdate: boolean;
    PreloadRemotePlay: boolean;
    PreloadUi: boolean;
    EnableXcloudLogging: boolean;
    SafariWorkaround: boolean;

    ForceNativeMkbTitles: string[];
    FeatureGates: {[key: string]: boolean} | null,

    IsSupportedTvBrowser: boolean,

    DeviceInfo: Partial<{
        deviceType: 'android' | 'android-tv' | 'webos' | 'unknown',
        userAgent?: string,
    }>,
}>

// Setup flags
const DEFAULT_FLAGS: BxFlags = {
    CheckForUpdate: true,
    PreloadRemotePlay: true,
    PreloadUi: false,
    EnableXcloudLogging: false,
    SafariWorkaround: true,

    ForceNativeMkbTitles: [],
    FeatureGates: null,

    DeviceInfo: {
        deviceType: 'unknown',
    },
}

export const BX_FLAGS: BxFlags = Object.assign(DEFAULT_FLAGS, window.BX_FLAGS || {});
try {
    delete window.BX_FLAGS;
} catch (e) {}

if (!BX_FLAGS.DeviceInfo!.userAgent) {
    BX_FLAGS.DeviceInfo!.userAgent = window.navigator.userAgent;
}

export const NATIVE_FETCH = window.fetch;
