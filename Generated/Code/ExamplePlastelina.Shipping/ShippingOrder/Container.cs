// This file was generated automatically. Do not modify it by hand.

using Newtonsoft.Json;

namespace ExamplePlastelina.Shipping.ShippingOrder
{
    public class Container
    {
        public string Number { get; set; }

        public string SealNumber { get; set; }

        public string IsoContainerSizeCode { get; set; }

        [JsonProperty(Required = Required.Always)]
        public ContainerType ContainerType { get; set; }

        public UnitDimensions Dimensions { get; set; }

        public Container() { }

        public Container(
            string number,
            string sealNumber,
            string isoContainerSizeCode,
            ContainerType containerType,
            UnitDimensions dimensions)
        {
            Number = number;
            SealNumber = sealNumber;
            IsoContainerSizeCode = isoContainerSizeCode;
            ContainerType = containerType;
            Dimensions = dimensions;
        }
    }
}