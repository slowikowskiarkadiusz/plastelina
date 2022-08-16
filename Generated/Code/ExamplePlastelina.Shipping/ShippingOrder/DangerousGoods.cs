// This file was generated automatically. Do not modify it by hand.

using ExamplePlastelina.Common;
using Newtonsoft.Json;

namespace ExamplePlastelina.Shipping.ShippingOrder
{
    public class DangerousGoods
    {
        public string UnNumber { get; set; }

        public string Class { get; set; }

        public string Name { get; set; }

        [JsonProperty(Required = Required.Always)]
        public PackingGroup PackingGroup { get; set; }

        public string TunnelCode { get; set; }

        public string NotOtherwiseSpecifiedName { get; set; }

        public bool? EnvironmentalHazard { get; set; }

        public bool? LimitedQuantity { get; set; }

        public Weight TotalGrossWeight { get; set; }

        public Weight TotalNetWeight { get; set; }

        public Weight NetExplosiveMass { get; set; }

        public decimal? Multiplicator { get; set; }

        public decimal? NumberOfPackages { get; set; }

        public Temperature FlashPoint { get; set; }

        public DangerousGoods(
            PackingGroup packingGroup)
        {
            PackingGroup = packingGroup;
        }
    }
}