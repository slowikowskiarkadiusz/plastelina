using System;
using System.Globalization;
using Newtonsoft.Json;

namespace ExamplePlastelina.Extensions.Converters
{
    public class TimeOnlyJsonConverter : JsonConverter<DateTime>
    {
        private const string TimeFormat = "HH:mm:ss.FFFFFFF";

        public override DateTime ReadJson(JsonReader reader, Type objectType, DateTime existingValue, bool hasExistingValue, JsonSerializer serializer)
        {
            return DateTime.ParseExact((string)reader.Value, TimeFormat, CultureInfo.InvariantCulture);
        }

        public override void WriteJson(JsonWriter writer, DateTime value, JsonSerializer serializer)
        {
            writer.WriteValue(value.ToString(TimeFormat, CultureInfo.InvariantCulture));
        }
    }
}