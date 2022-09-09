// This file was generated automatically. Do not modify it by hand.

using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace ExamplePlastelina.Common
{
    public class Weight
    {
        [JsonProperty(Required = Required.Always)]
        public decimal Value { get; set; }

        /// <summary>
        /// Weight unit
        /// </summary>
        [JsonConverter(typeof(StringEnumConverter))]
        [JsonProperty(Required = Required.Always)]
        public WeightUnit Unit { get; set; }
    }
}