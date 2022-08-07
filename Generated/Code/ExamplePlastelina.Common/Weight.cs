// This file was generated automatically. Do not modify it by hand.

using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace ExamplePlastelina.Common;

public class Weight
{
    public decimal Value { get; set; }
    /// <summary>
    /// Weight unit
    /// </summary>
    [JsonConverter(typeof(StringEnumConverter))]
    public WeightUnit Unit { get; set; }
}