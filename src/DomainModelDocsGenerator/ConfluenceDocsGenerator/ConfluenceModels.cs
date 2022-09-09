using DomainModelDocsGenerator.Common.Models;

namespace BusinessDocsGenerator.Models.Confluence
{
    public class ConfluencePageContent
    {
        public DomainModelDocsGenerator.Common.Models.Version version { get; set; }
        public Body body { get; set; }
        public string format { get; set; } = "storage";
        public string type { get; set; } = "storage";
        public string title { get; set; }
    }
}