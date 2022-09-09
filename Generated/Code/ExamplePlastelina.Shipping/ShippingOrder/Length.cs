// This file was generated automatically. Do not modify it by hand.

using ExamplePlastelina.Common;
using Newtonsoft.Json;

namespace ExamplePlastelina.Shipping.ShippingOrder
{
    public class Length
    {
        [JsonProperty(Required = Required.Always)]
        public decimal Value { get; set; }

        [JsonProperty(Required = Required.Always)]
        public LengthUnit Unit { get; set; }
    }
}