import en from "../locales/en.json" assert {type: 'json'};

type LocalizationKeys = keyof typeof en;

export class Localization {
    private currentLanguage: Record<string, string>;

    constructor(defaultLanguage: Record<string, string>) {
        this.currentLanguage = defaultLanguage;
    }

    translate(key: LocalizationKeys): string {
        return this.currentLanguage[key] || `Missing translation: ${key}`;
    }

    setLanguage(languageFile: Record<string, string>): void {
        this.currentLanguage = languageFile;
    }
}