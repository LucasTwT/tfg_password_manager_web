export enum PasswordType {
    random = "random",
    memorable = "memorable",
}

export interface PasswordGeneratorOptions  {
    type: PasswordType;

    length: number;

    includeUppercase: boolean;
    includeNumbers: boolean;
    includeSymbols: boolean;

    avoidAmbiguous: boolean;
    allowRepeating: boolean;

    wordsCount: number;
    excludeWeakWords: boolean;
};

export interface GenerateKeyState {
    keyOptions: PasswordGeneratorOptions;
    password: string;
    regenerateBtn: boolean;
}

export type UpdatePayload = {  [K in keyof PasswordGeneratorOptions] : { field: K; value: PasswordGeneratorOptions[K]} }[keyof PasswordGeneratorOptions]

export type Action = 
    | {type: "SET_KEY_OPTIONS", payload: UpdatePayload}
    | {type: "SET_PASSWORD", payload: {newPassword: string}}
    | {type: "SET_REGENERATE_BTN", payload: {newVal: boolean}}
    | {type: "REGENERATE_PASSWORD", payload: {}}
