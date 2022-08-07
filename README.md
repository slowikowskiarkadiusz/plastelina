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