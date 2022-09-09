export class ArgumentSettings {
    public static constructors: boolean = false;
    public static privatesetters: boolean = false;
    public static defaultvalues: boolean = false;

    public static update(): void {
        process.argv.splice(2).forEach(arg => {
            arg = arg.substring(2).replaceAll('-', '');
            if (Object.keys(ArgumentSettings).includes(arg))
                ArgumentSettings[arg] = true;
        });
    }
}