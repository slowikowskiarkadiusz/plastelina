using DomainModelDocsGenerator.Common.Models;
using DomainModelDocsGenerator.Confluence;
using System.Text.Json;

Console.WriteLine("Running Confluence Domain Model Docs Generator...");

string businessDocsPath, host, username, apiToken, templateContentId;
businessDocsPath = host = username = apiToken = templateContentId = string.Empty;

if (args.Contains("--business-docs-path")) businessDocsPath = args[Array.IndexOf(args, "--business-docs-path") + 1];
else throw new ArgumentException("'businessDocsPath' parameter has not been specified");

if (args.Contains("--host")) host = args[Array.IndexOf(args, "--host") + 1];
else throw new ArgumentException("'host' parameter has not been specified");

if (args.Contains("--username")) username = args[Array.IndexOf(args, "--username") + 1];
else throw new ArgumentException("'username' parameter has not been specified");

if (args.Contains("--api-token")) apiToken = args[Array.IndexOf(args, "--api-token") + 1];
else throw new ArgumentException("'api-token' parameter has not been specified");

if (args.Contains("--template-content-id")) templateContentId = args[Array.IndexOf(args, "--template-content-id") + 1];
else throw new ArgumentException("'template-content-id' parameter has not been specified");

await ConfluenceDocsGenerator.Run(
    JsonSerializer.Deserialize<EntityDocumentData[]>(File.ReadAllText(businessDocsPath)),
    host,
    username,
    apiToken,
    long.Parse(templateContentId));