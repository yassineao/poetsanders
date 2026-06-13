import { I18nService } from "./i18n.service";
import { dictionaries, getDictionary, isValidLocale, locales } from "./index";

describe("i18n", () => {
  it("registers every supported locale", () => {
    expect(Object.keys(dictionaries)).toEqual([...locales]);
    expect(isValidLocale("de")).toBe(true);
    expect(isValidLocale("fr")).toBe(false);
    expect(getDictionary("de").localeName).toBe("Deutsch");
  });

  it("switches the current dictionary", () => {
    const service = new I18nService();

    service.setLanguage("nl");

    expect(service.getCurrentLanguage()).toBe("nl");
    expect(service.getCurrentDictionary()).toBe(dictionaries.nl);
    expect(service.dictionary()).toBe(dictionaries.nl);
  });
});
