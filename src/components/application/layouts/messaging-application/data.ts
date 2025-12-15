import type { CSSProperties } from "react";

export enum CategoryEnum {
    APPLICATION = "application",
    AI = "ai",
    MARKETING = "marketing",
    ECOMMERCE = "ecommerce",
    CHARTS = "charts",
}

export type Attributes = {
    name?: string;
    image?: string;
    group?: string;
    supportedTheme?: "dark" | "light";
    allowRefresh?: boolean;
    featured?: string | boolean;
    openInNewTabRecommended?: boolean;
    sortPriority?: "high" | "medium" | "low";
    groupOrder?: number;
    isNew?: boolean;
    isFree?: boolean;
    iframe?: {
        justify?: "start" | "center" | "end";
        shouldUpdateHeightOnResize?: boolean;
        initialHeight?: number;
        initialMobileHeight?: number;
        removePadding?: boolean;
    };
    screenshot?: {
        selector?: string;
        delay?: number;
        viewport?: {
            width: number;
            height: number;
        };
        fullWidth?: string | boolean;
        objectPosition?: string;
        style?: CSSProperties;
    };
    renderInIframe?: boolean;
};

export interface TsConfigOptions {
    baseUrl?: string;
    paths?: Record<string, string[]>;
}

export type ComponentCodeFile = {
    fileName: string;
    code: string;
    language: string;
};

export type ComponentInfo = {
    slug: string;
    name: string;
    image: string;
    code?: ComponentCodeFile[];
    files?: {
        javascript?: Record<string, string>;
        typescript?: Record<string, string>;
    };
    attributes?: Attributes;
};

export type GroupInfo = {
    key: string;
    name?: string;
};

export type CategoryComponents = Record<CategoryEnum, ComponentInfo[]>;

export interface ComponentPreviewPageInfo {
    group?: string;
    category?: CategoryEnum;
    components?: ComponentInfo[];
}

export type DynamicComponentProps = {
    category?: CategoryEnum;
    componentSlug?: string;
    component?: ComponentInfo;
};

export interface SearchResultItem {
    slug: string;
    url: string;
    group: GroupInfo;
    content: string;
    image?: string;
    category: string;
    component: ComponentInfo;
}

export type MessagingChatMessageProps = React.HTMLAttributes<HTMLDivElement> & {
    avatar: string;
    name: string;
    message: string;
    time?: string;
    isRTL?: boolean;
    imageUrl?: string;
    classNames?: Record<"base", string>;
};
