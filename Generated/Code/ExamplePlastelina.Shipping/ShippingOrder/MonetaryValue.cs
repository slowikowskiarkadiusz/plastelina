// This file was generated automatically. Do not modify it by hand.

using ExamplePlastelina.Common;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace ExamplePlastelina.Shipping.ShippingOrder;

public class MonetaryValue
{
    public decimal? Value { get; set; }
    [JsonConverter(typeof(StringEnumConverter))]
    public Currency Currency { get; set; }
}