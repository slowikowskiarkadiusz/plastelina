// This file was generated automatically. Do not modify it by hand.

using ExamplePlastelina.Extensions.Converters;
using Newtonsoft.Json;

namespace ExamplePlastelina.Shipping.ShippingOrder
{
    public class ShippingOrderConfirmation
    {
        public ShippingOrderConfirmationIdentification ShippingOrderConfirmationIdentification { get; set; }

        public MessageIdentification MessageIdentification { get; set; }

        [JsonConverter(typeof(DateOnlyJsonConverter))]
        public System.DateTime ConfirmationDate { get; set; }

        public TransportDetails TransportDetails { get; set; }
    }
}