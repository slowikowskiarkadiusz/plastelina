// This file was generated automatically. Do not modify it by hand.

using ExamplePlastelina.Extensions.Converters;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace ExamplePlastelina.Shipping.ShippingOrder
{
    /// <summary>
    /// The main, most generic model used in exchanging information regarding Shipping Orders for both external and internal integrations
    /// </summary>
    public class ShippingOrderModel
    {
        public MessageIdentification MessageIdentification { get; set; }

        public ShippingOrderIdentification ShippingOrderIdentification { get; set; }

        public ShippingOrderType? ShippingOrderType { get; set; }

        public string ReceiverId { get; set; }

        public string SenderId { get; set; }

        public System.DateTime? OrderReceived { get; set; }

        [JsonConverter(typeof(DateOnlyJsonConverter))]
        public System.DateTime? OrderDate { get; set; }

        public Address FreightPayerAddress { get; set; }

        public string Comments { get; set; }

        public IEnumerable<Consignment> Consignments { get; set; }

        public TransportDetails TransportDetails { get; set; }

        public System.DateTime? EstimatedDeparture { get; set; }

        public System.DateTime? EstimatedArrival { get; set; }
    }
}