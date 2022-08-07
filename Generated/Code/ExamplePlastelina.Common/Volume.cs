// This file was generated automatically. Do not modify it by hand.

using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace ExamplePlastelina.Common;

public class Volume
{
    public decimal Value { get; set; }
    /// <summary>
    /// Volume unit
    /// </summary>
    [JsonConverter(typeof(StringEnumConverter))]
    public VolumeUnit Unit { get; set; }
}