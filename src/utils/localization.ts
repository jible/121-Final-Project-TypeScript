import en from "../locales/en.json" assert {type: 'json'};
import kr from "../locales/kr.json" assert { type: "json" };
import abr from "../locales/abr.json" assert { type: "json" };

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

    // Function to switch between languages
    switchLanguage(language: string) {
        switch (language) {
            case "en":
                this.setLanguage(en);
                break;
            case "kr":
                this.setLanguage(kr);
                break;
            case "abr":
                this.setLanguage(abr);
                break;
            default:
                console.warn(`Unsupported language: ${language}`);
                this.setLanguage(en); // Fallback to default language
        }
    }
}

