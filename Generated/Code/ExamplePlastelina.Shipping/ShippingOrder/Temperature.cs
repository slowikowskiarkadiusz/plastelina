// This file was generated automatically. Do not modify it by hand.

using ExamplePlastelina.Common;
using Newtonsoft.Json;

namespace ExamplePlastelina.Shipping.ShippingOrder
{
    public class Temperature
    {
        [JsonProperty(Required = Required.Always)]
        public decimal Value { get; set; }

        [JsonProperty(Required = Required.Always)]
        public TemperatureUnit Unit { get; set; }
    }
}