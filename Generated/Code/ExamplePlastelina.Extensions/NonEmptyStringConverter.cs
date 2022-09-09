using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;

namespace ExamplePlastelina.Extensions
{
    public class NonEmptyStringConverter : JsonConverter
    {
        public override bool CanConvert(Type objectType) => objectType == typeof(string);

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            if (IsStringEmptyOrNull((string)value))
                throw new JsonWriterException($"Non-empty or whitespace string required. Path: {writer.Path}");

            JToken.FromObject(value).WriteTo(writer);
        }

        private static bool IsStringEmptyOrNull(string item)
        {
            return string.IsNullOrWhiteSpace(item) || item.Equals("null", StringComparison.OrdinalIgnoreCase);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            if (reader.TokenType != JsonToken.String)
                throw CreateException($"Expected string value, but found {reader.TokenType}.", reader);

            var value = (string)reader.Value;

            if (IsStringEmptyOrNull(value))
                throw CreateException("Non-empty or whitespace string required.", reader);

            return value;
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
