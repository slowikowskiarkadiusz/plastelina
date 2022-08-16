// This file was generated automatically. Do not modify it by hand.

using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace ExamplePlastelina.Common
{
    public class Volume
    {
        [JsonProperty(Required = Required.Always)]
        public decimal Value { get; set; }

        /// <summary>
        /// Volume unit
        /// </summary>
        [JsonConverter(typeof(StringEnumConverter))]
        [JsonProperty(Required = Required.Always)]
        public VolumeUnit Unit { get; set; }

        public Volume(
            decimal value,
            VolumeUnit unit)
        {
            Value = value;
            Unit = unit;
        }
    }
}