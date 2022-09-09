using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;

namespace ExamplePlastelina.Extensions
{
    public class NonEmptyStringCollectionConverter : JsonConverter
    {
        public override bool CanConvert(Type objectType) => objectType == typeof(List<string>);

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            var items = (IEnumerable<string>)value;

            foreach (var item in items)
            {
                if (IsStringEmptyOrNull(item))
                    throw new JsonWriterException($"Non-empty or whitespace string element in collection required. Path: {writer.Path}");
            }

            JToken.FromObject(value).WriteTo(writer);
        }

        private static bool IsStringEmptyOrNull(string item)
        {
            return string.IsNullOrWhiteSpace(item) || item.Equals("null", StringComparison.OrdinalIgnoreCase);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            if (reader.TokenType != JsonToken.StartArray)
                throw CreateException($"Expected string collection value, but found {reader.TokenType}.", reader);

            JToken token = JToken.Load(reader);
            List<string> items = token.ToObject<List<string>>();

            foreach (var item in items)
            {
                if (IsStringEmptyOrNull(item))
                    throw CreateException("Non-empty or whitespace string element in collection required.", reader);
            }

            return items;
        }

        private static Exception CreateException(string message, JsonReader reader)
        {
            var info = (IJsonLineInfo)reader;
            return new JsonSerializationException(
                $"{message} Path '{reader.Path}', line {info.LineNumber}, position {info.LinePosition}.",
                reader.Path, info.LineNumber, info.LinePosition, null);
        }
    }
}
