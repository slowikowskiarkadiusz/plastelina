// This file was generated automatically. Do not modify it by hand.

using ExamplePlastelina.Common;
using Newtonsoft.Json;

namespace ExamplePlastelina.Shipping.ShippingOrder
{
    public class UnitDimensions
    {
        public decimal? Length { get; set; }

        public decimal? Height { get; set; }

        public decimal? Width { get; set; }

        [JsonProperty(Required = Required.Always)]
        public LengthUnit Unit { get; set; }

        public UnitDimensions() { }

        public UnitDimensions(
            decimal length,
            decimal height,
            decimal width,
            LengthUnit unit)
        {
            Length = length;
            Height = height;
            Width = width;
            Unit = unit;
        }
    }
}