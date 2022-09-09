// This file was generated automatically. Do not modify it by hand.

using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace ExamplePlastelina.Common
{
    public class Dimensions
    {
        public double? Length { get; set; }

        public double? Height { get; set; }

        public double? Width { get; set; }

        /// <summary>
        /// Length unit
        /// </summary>
        [JsonConverter(typeof(StringEnumConverter))]
        public LengthUnit? Unit { get; set; }
    }
}