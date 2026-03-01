export interface Language {
    key: "html" | "javascript" | "jsx";
    mime: string;
    initialCode: string;
    initialConfig: {
        rules: Record<string, unknown>;
    };
    isEqual(value: "html" | "javascript" | "jsx"): boolean
}