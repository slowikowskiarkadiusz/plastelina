using BusinessDocsGenerator.Models.Confluence;
using DomainModelDocsGenerator.Common.Models;
using System.Text;
using System.Text.Json;

namespace DomainModelDocsGenerator.Confluence;

public static class ConfluenceDocsGenerator
{
    private static string host;
    private static string username;
    private static string apiToken;

    public static async Task Run(EntityDocumentData[] datas, string host, string username, string apiToken, long templateId)
    {
        ConfluenceDocsGenerator.host = host;
        ConfluenceDocsGenerator.username = username;
        ConfluenceDocsGenerator.apiToken = apiToken;

        foreach (var data in datas)
        {
            Console.WriteLine($"Generating docs for {data.title}...");
            var template = await GetContentAsync(templateId);
            var body = template
                .body
                .storage
                .value
                .Replace("{{introduction}}", data.introduction)
                .Replace("{{content}}", string.Join("\n", data.chapters.Select(x => CreateChapter(x))));

            var response = await GetContentAsync(data.confluencePageContentId);

            await PutContentAsync(data.confluencePageContentId, ++response.version.number, body, "storage", data.title, response.type).ConfigureAwait(false);

            Console.WriteLine($"Done generating docs for {data.title}!");
        }
    }

    private static string CreateChapter(ChapterTableData data)
    {
        var stringBuilder = new StringBuilder()
            .Append($"<h2>{data.title}</h2>\n")
            .Append($"This is an {(data.isEnum ? "enum" : "entity")}. {data.description}")
            .Append("<table>\n");

        var isFirst = true;

        foreach (var row in data.table)
        {
            stringBuilder.Append("<tr>\n");
            var tag = isFirst ? "th" : "td";
            foreach (var cell in row)
                stringBuilder = stringBuilder.Append($"<{tag}>{(isFirst ? "<b>" : "")}{cell}{(isFirst ? "</b>" : "")}</{tag}>\n");

            isFirst = false;
            stringBuilder.Append("</tr>\n");
        }
        return stringBuilder.Append("</table>\n").ToString();
    }

    private static async Task<ConfluenceResponse> GetContentAsync(long contentId)
    {
        var client = new HttpClient();
        client.DefaultRequestHeaders.Add("Authorization", $"Basic {Convert.ToBase64String(Encoding.ASCII.GetBytes($"{username}:{apiToken}"))}");
        var url = $"{host}/rest/api/content/{contentId}?expand=body.storage,version";
        var response = await client.GetAsync(url);

        response.EnsureSuccessStatusCode();

        return JsonSerializer.Deserialize<ConfluenceResponse>(await response.Content.ReadAsStringAsync());
    }

    private async static Task PutContentAsync(long contentId, int version, string body, string format, string title, string type)
    {
        var client = new HttpClient();
        client.DefaultRequestHeaders.Add("Authorization", $"Basic {Convert.ToBase64String(Encoding.ASCII.GetBytes($"{username}:{apiToken}"))}");
        client.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; WOW64)");
        var url = $"{host}/rest/api/content/{contentId}";

        var newContent = new ConfluencePageContent
        {
            version = new Common.Models.Version { number = version, when = DateTime.Now },
            body = new Body { storage = new Storage { value = body, representation = "storage" } },
            format = format,
            title = title,
            type = type,
        };

        var httpContent = new StringContent(JsonSerializer.Serialize(newContent), Encoding.UTF8, "application/json");
        var response = await client.PutAsync(url, httpContent).ConfigureAwait(false);

        response.EnsureSuccessStatusCode();
    }
}