//#region --------------------------------------- IMPORTS

import en from "../locales/en.json" assert {type: 'json'};      // english
import kr from "../locales/kr.json" assert { type: "json" };    // korean
import abr from "../locales/abr.json" assert { type: "json" };  // arabic
import jp from "../locales/jp.json" assert { type: "json" };  // japanese

//#endregion

// Type representing keys in the English localization file.
type LocalizationKeys = keyof typeof en;

// This class supports switching between different languages dynamically
// and provides functionality to retrieve translations for specific keys.
export class Localization {
    private currentLanguage: Record<string, string>

    constructor(defaultLanguage: Record<string, string>) {
        this.currentLanguage = defaultLanguage
    }

    // Translates a given key into the currently active language.
    translate(key: LocalizationKeys): string {
        return this.currentLanguage[key] || `Missing translation: ${key}`
    }

    // Sets the active language file.
    setLanguage(languageFile: Record<string, string>): void {
        this.currentLanguage = languageFile
    }

    getLanguage(): string {
        return this.currentLanguage.font
    }

    // Switches the active language to a specified language.
    switchLanguage(language: string): void {
        switch (language) {
            case "en":
                this.setLanguage(en)
                break
            case "kr":
                this.setLanguage(kr)
                break
            case "abr":
                this.setLanguage(abr)
                break
            case "jp":
                this.setLanguage(jp)
                break
            default:
                console.warn(`Unsupported language: ${language}`)
                this.setLanguage(en)
        }
    }
}

