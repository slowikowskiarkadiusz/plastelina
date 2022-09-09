using DomainModelDocsGenerator.Common.Models;
using Extensions;
using Microsoft.Office.Interop.Word;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading;

namespace BusinessDocsGenerator.Word
{
    public static class WordDocsGenerator
    {
        private static readonly WdBorderType[] wdBorderTypes = new WdBorderType[] { WdBorderType.wdBorderLeft, WdBorderType.wdBorderBottom, WdBorderType.wdBorderRight, WdBorderType.wdBorderTop };

        public static void Run(EntityDocumentData[] datas, string templatePath, string destinationDirectory)
        {
            var threads = new List<Thread>();
            var total = 0;
            var stopwatch = new Stopwatch();
            stopwatch.Start();
            foreach (var data in datas)
            {
                Console.WriteLine($"Starting generating {data.title}...");
                total++;
                var t = new Thread(() =>
                {
                    ProcessOneData(data, templatePath, destinationDirectory);
                    Console.WriteLine($"Done generating {data.title}! ({--total} left)");
                });
                t.Start();
                threads.Add(t);
            }

            threads.WaitAll();
            stopwatch.Stop();
            Console.WriteLine($"Total time: {stopwatch.Elapsed}. Press any key...");
            Console.ReadKey();
        }

        private static void ProcessOneData(EntityDocumentData data, string templatePath, string destinationDirectory)
        {
            var application = new Application();
            try
            {
                var newPath = $"{destinationDirectory}/{data.title}.docx";
                File.Copy(templatePath, newPath, true);

                application.Documents.Open(newPath).Activate();

                var range = application.ActiveDocument.Content;

                ReplaceIntroduction(application, data);
            }
            finally
            {
                application.Quit();
            }
        }

        private static void ReplaceIntroduction(Application application, EntityDocumentData data)
        {
            if (application.Selection.Find.Execute("{{title}}", true) && application.Selection.Find.Found)
                application.Selection.Range.Text = data.title;

            if (application.Selection.Find.Execute("{{introduction}}", true) && application.Selection.Find.Found)
                application.Selection.Range.Text = data.introduction;

            Range contentRange = null;
            if (application.Selection.Find.Execute("{{content}}", true) && application.Selection.Find.Found)
                contentRange = application.Selection.Range.Duplicate;

            var document = application.ActiveDocument;

            try
            {
                GetEndOfTheFileRange(application).Select();
                application.Selection.Text = "{{generation_start}}";
                document.Paragraphs.Add();

                foreach (var chapter in data.chapters)
                    GenerateChapter(data, document, chapter);

                MoveChapters(application, contentRange, document);
            }
            finally
            {
                document.TablesOfContents[1].Update();
                document.Save();
                document.Close();
            }
        }

        private static void MoveChapters(Application application, Range contentRange, Document document)
        {
            contentRange.Delete();
            var range = document.Content;
            range.Find.Execute("{{generation_start}}");
            application.Selection.Range.Delete();
            range.Start++;
            range.End = GetEndOfTheFileRange(application).End;
            range.Select();

            var contentLineNumber = contentRange.get_Information(WdInformation.wdFirstCharacterLineNumber);
            var rangeLineNumber = range.get_Information(WdInformation.wdFirstCharacterLineNumber);

            for (int i = 0; i < rangeLineNumber - contentLineNumber; i++)
                range.Relocate((int)WdRelocate.wdRelocateUp);
        }

        private static void GenerateChapter(EntityDocumentData data, Document document, ChapterTableData chapter)
        {
            var paragraph = MakeChaptersHeading(document, chapter);

            var table = document.Tables.Add(document.Range(paragraph.Range.End - 1, paragraph.Range.End), chapter.table.Length, chapter.table.FirstOrDefault()?.Length ?? 0);

            ShrinkRequiredColumn(chapter, table);

            for (int x = 1; x < table.Columns.Count + 1; x++)
            {
                for (int y = 1; y < table.Rows.Count + 1; y++)
                {
                    if (y == 1)
                    {
                        table.Cell(y, x).Shading.BackgroundPatternColor = WdColor.wdColorDarkTeal;
                        table.Cell(y, x).Range.Font.Color = WdColor.wdColorWhite;
                        table.Cell(y, x).Range.Font.Bold = -1;
                    }
                    else
                    {
                        table.Cell(y, x).Range.Font.Color = WdColor.wdColorBlack;
                        table.Cell(y, x).Range.Font.Bold = 0;
                    }

                    foreach (var bt in wdBorderTypes)
                        table.Cell(y, x).Range.Borders[bt].LineStyle = WdLineStyle.wdLineStyleSingle;
                     
                    table.Cell(y, x).Range.Text = chapter.table[y - 1][x - 1];
                }
            }

            if (data.chapters.Last() != chapter)
                paragraph.Range.InsertParagraphAfter();
        }

        private static Paragraph MakeChaptersHeading(Document document, ChapterTableData chapter)
        {
            var paragraph = document.Paragraphs.Add();
            paragraph.Range.InsertParagraphAfter();
            paragraph.Range.Text = chapter.title;
            paragraph.set_Style(WdBuiltinStyle.wdStyleHeading2);
            paragraph = document.Paragraphs.Add();
            paragraph.Range.Text = chapter.description;
            paragraph.Range.InsertParagraphAfter();
            return document.Paragraphs.Add();
        }

        private static void ShrinkRequiredColumn(ChapterTableData chapter, Table table)
        {
            var requiredColumnIndex = chapter.table[0].Select((x, i) => new { data = x, index = i }).SingleOrDefault(x => x.data.ToLower() == "required")?.index ?? -1;
            requiredColumnIndex++;

            if (requiredColumnIndex > 0)
            {
                var columnCount = table.Columns.Count + 1;
                var startWidth = table.Columns[requiredColumnIndex].Width;
                var difference = startWidth - (table.Columns[requiredColumnIndex].Width /= 2);
                for (int i = 1; i < columnCount; i++)
                    if (i != requiredColumnIndex)
                        table.Columns[i].Width += difference / (columnCount - 1);
            }
        }

        private static Range GetEndOfTheFileRange(Application application)
        {
            return application.ActiveDocument.Range(application.ActiveDocument.Characters.Last.Start, application.ActiveDocument.Characters.Last.Start);
        }
    }
}

namespace Extensions
{
    public static class ThreadExtension
    {
        public static void WaitAll(this IEnumerable<Thread> threads)
        {
            if (threads != null)
                foreach (var thread in threads)
                    thread.Join();
        }
    }
}