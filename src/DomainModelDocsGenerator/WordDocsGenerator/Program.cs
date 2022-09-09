using BusinessDocsGenerator.Word;
using DomainModelDocsGenerator.Common.Models;
using Newtonsoft.Json;
using System;
using System.IO;

namespace BusinessDocsGenerator
{
    public static class Program
    {
        public static void Main(string[] args)
        {
            WordDocsGenerator.Run(
               JsonConvert.DeserializeObject<EntityDocumentData[]>(File.ReadAllText(args[Array.IndexOf(args, "--business-docs-path") + 1])),
               args[Array.IndexOf(args, "--template-path") + 1],
               args[Array.IndexOf(args, "--destination-directory") + 1]);
        }
    }
}