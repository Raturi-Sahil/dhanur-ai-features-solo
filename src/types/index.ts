// Navigation types
export type RootTabParamList = {
    Home: undefined;
    Record: undefined;
    Teleprompter: undefined;
};

// Script/Recording types
export interface Script {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    audioUri?: string;
    duration?: number;
}

// Feature card type for Home screen
export interface Feature {
    icon: string;
    text: string;
}

export interface FeatureCardData {
    title: string;
    description: string;
    features: Feature[];
    gradientColors: [string, string, ...string[]]; // At least 2 colors required
    iconName: string;
    iconColor: string;
}
