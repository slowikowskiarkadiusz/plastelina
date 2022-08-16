I've made this piece as a some kind of simplified alternative for asyncapi's modelina. It's a code generator for asyncapi models, but it only generates C# code. Unlike modelina, plastelina reads .yaml files from a directory and writes all the code in a separate directory with a structure identical to the models' folder. For example, if you make Models directory to look like this:

- Models
    - A
        - 0.yaml
        - 1.yaml
    - B
        - C
            - 2.yaml
        - D
            - 3.yaml
            - 4.yaml
            - 5.yaml
        - 6.yaml

Then your Code directory is going to look like that:

- Code
    - A
        - 0.cs
        - 1.cs
        - A.csproj
    - B
        - C
            - 2.cs
        - D
            - 3.cs
            - 4.cs
            - 5.cs
        - 6.cs
        - B.csproj
    - MyModelsSolution.sln

As you can see, there're also projects and a solution in the Code directory. Projects are created for all subfolders of Models folder, and only for them. There're no projects being created for folders nested deeper in the hierarchy. Each of those projects exists as a reference in the .sln file as well.

# How to use
1) Put models in the Models directory as shown in the example
2) You might want to update the version in the `_Header.yaml` file if you're planning on releasing this as NuGet package.
3) Run the `generate.sh` file and the generator will do it's thing.

# Making a model
It might be useful to get familiar with [asyncapi's docs](https://www.asyncapi.com/docs/tutorials/getting-started/hello-world). A model's structe is simple:

## Making a class

```
components:
    schema:
        <<namespace>>:
            <<class name>>:
                description: <<**[Optional]** A description of the class used for HTML docs, confluence docs and for summaries in C# code>> 
                nugets:
                    - <<Name of a nuget package that you want to install. You might specify a specific version you want to install. Later the contents of this list is going to be placed in "dotnet add package <<list value>>" commands, so keep it compatible.>>
                references:
                    - <<Name of a project to which you want to add a reference in this model's project. Values from this list are going to be used in "dotnet add reference <<list value>>" commands, so keep it compatible.>>
                usings:
                    - <<Literally strings that are going to be written later on at the top of your class. "using <<value>>;"
                type: object
                properties:
                    type: <<Property's type. For asyncapi's purposes it might be one of: 'string', 'number', 'boolean', 'array'.>>
                    format: <<If your property is something other that those above, then put it here. It's going to override the 'type' field during generation. Might be one of: 'string', 'integer', 'number', 'decimal', 'boolean', 'double', 'date-time', 'date', 'time'. Anything else will be taken literally. Also used when you want to i.e. specify a class' name with it's namespace, like 'ExamplePlastelina.Common.Value', instead of just 'Value'.>>
                    $ref: <<If your property is not a primitive type, you use this field to specify the path to the reference. I.e. '#/components/schema/ExamplePlastelina.Common/Value'. Cannot be used with 'type' field.>>
                    description: <<Field's description. Used in HTML docs, confluence docs and C#'s summary.>>
                    items:
                        <<If the prop is of type 'array' then you put here exactly the same structure as you put in 'properties' field.>>
```

## Making an enum

Enums look very similarly to classes. The main difference is 'type' set to 'string' instead of 'object' and an 'enum' field.
```
components:
    schema:
        <<namespace>>:
            <<enum name>>:
                description: <<**[Optional]** A description of the enum used for HTML docs, confluence docs and for summaries in C# code>> 
                type: string
                enum:
                    - <<Name of a member.>>
```
