export class ArgumentSettings {
    public static constructos: boolean = false;
    public static privateSetters: boolean = false;
    public static defaultValues: boolean = false;

    public static update(): void {
        Object.keys(ArgumentSettings).forEach(settingName =>
            ArgumentSettings[settingName] = process.argv.includes(`--${settingName}`));
    }
}