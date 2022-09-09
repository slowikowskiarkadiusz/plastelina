using Newtonsoft.Json;
using System;
using System.Globalization;

namespace ExamplePlastelina.Extensions.Converters
{
    public class DateOnlyJsonConverter : JsonConverter<DateTime>
    {
        private const string DateFormat = "yyyy-MM-dd";

        public override DateTime ReadJson(JsonReader reader, Type objectType, DateTime existingValue, bool hasExistingValue, JsonSerializer serializer)
        {
            return reader != null && reader.Value != null ? DateTime.ParseExact((string)reader.Value, DateFormat, CultureInfo.InvariantCulture) : default;
        }

        public override void WriteJson(JsonWriter writer, DateTime value, JsonSerializer serializer)
        {
            writer.WriteValue(value.ToString(DateFormat, CultureInfo.InvariantCulture));
        }
    }
}