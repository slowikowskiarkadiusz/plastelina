using System;
using System.Collections.Generic;

namespace DomainModelDocsGenerator.Common.Models
{
    public class EntityDocumentData
    {
        public string title { get; set; }
        public string introduction { get; set; }
        public long confluencePageContentId { get; set; }
        public ChapterTableData[] chapters { get; set; }
    }

    public class ChapterTableData
    {
        public string title { get; set; }
        public string description { get; set; }
        public bool isEnum { get; set; }
        public string[][] table { get; set; }
    }

    public class Body
    {
        public Storage storage { get; set; }
        public Expandable _expandable { get; set; }
    }

    public class By
    {
        public string type { get; set; }
        public string accountId { get; set; }
        public string accountType { get; set; }
        public string email { get; set; }
        public string publicName { get; set; }
        public ProfilePicture profilePicture { get; set; }
        public string displayName { get; set; }
        public bool isExternalCollaborator { get; set; }
        public Expandable _expandable { get; set; }
        public Links _links { get; set; }
    }

    public class Expandable
    {
        public string operations { get; set; }
        public string personalSpace { get; set; }
        public string collaborators { get; set; }
        public string content { get; set; }
        public string editor { get; set; }
        public string atlas_doc_format { get; set; }
        public string view { get; set; }
        public string export_view { get; set; }
        public string styled_view { get; set; }
        public string dynamic { get; set; }
        public string editor2 { get; set; }
        public string anonymous_export_view { get; set; }
        public string childTypes { get; set; }
        public string container { get; set; }
        public string metadata { get; set; }
        public string schedulePublishDate { get; set; }
        public string children { get; set; }
        public string restrictions { get; set; }
        public string history { get; set; }
        public string ancestors { get; set; }
        public string descendants { get; set; }
        public string space { get; set; }
    }

    public class Extensions
    {
        public int position { get; set; }
    }

    public class Links
    {
        public string self { get; set; }
        public string editui { get; set; }
        public string webui { get; set; }
        public string context { get; set; }
        public string tinyui { get; set; }
        public string collection { get; set; }
        public string @base { get; set; }
    }

    public class MacroRenderedOutput
    {
    }

    public class ProfilePicture
    {
        public string path { get; set; }
        public int width { get; set; }
        public int height { get; set; }
        public bool isDefault { get; set; }
    }

    public class ConfluenceResponse
    {
        public string id { get; set; }
        public string type { get; set; }
        public string status { get; set; }
        public string title { get; set; }
        public Version version { get; set; }
        public MacroRenderedOutput macroRenderedOutput { get; set; }
        public Body body { get; set; }
        public Extensions extensions { get; set; }
        public Expandable _expandable { get; set; }
        public Links _links { get; set; }
    }

    public class Storage
    {
        public string value { get; set; }
        public string representation { get; set; }
        public List<object> embeddedContent { get; set; }
        public Expandable _expandable { get; set; }
    }

    public class Version
    {
        public By by { get; set; }
        public DateTime when { get; set; }
        public string friendlyWhen { get; set; }
        public string message { get; set; }
        public int number { get; set; }
        public bool minorEdit { get; set; }
        public string syncRev { get; set; }
        public string syncRevSource { get; set; }
        public string confRev { get; set; }
        public bool contentTypeModified { get; set; }
        public Expandable _expandable { get; set; }
        public Links _links { get; set; }
    }
}