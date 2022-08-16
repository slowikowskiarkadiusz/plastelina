// This file was generated automatically. Do not modify it by hand.

using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Collections.Generic;

namespace ExamplePlastelina.Shipping.ShippingOrder
{
    public class Consignment
    {
        public ConsignmentIdentification ConsignmentIdentification { get; set; }

        [JsonProperty(Required = Required.Always)]
        public int ConsignmentNumber { get; set; }

        public IEnumerable<ConsignmentOrderLine> Lines { get; set; }

        public IEnumerable<DeliveryInstruction> DeliveryInstructions { get; set; }

        public Addresses Addresses { get; set; }

        public TransferDue Delivery { get; set; }

        public TransferDue Pickup { get; set; }

        public Incoterms Incoterms { get; set; }

        public Container Container { get; set; }

        public TransportDetails TransportDetails { get; set; }

        [JsonProperty(Required = Required.Always)]
        public PaymentMethod PaymentMethod { get; set; }

        public MonetaryValue TotalValue { get; set; }

        public string ServicePointId { get; set; }

        public string MrnNumbers { get; set; }

        public bool? Stackable { get; set; }

        public bool? SiteLoader { get; set; }

        public bool? Genset { get; set; }

        public MonetaryValue Insurance { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public TransitCode TransitCode { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public ServiceType Service { get; set; }

        public IEnumerable<Service> AdditionalServices { get; set; }

        public IEnumerable<AttachedFile> AttachedFiles { get; set; }

        public ExchangePallets ExchangePallets { get; set; }

        public Consignment(
            int consignmentNumber,
            PaymentMethod paymentMethod)
        {
            ConsignmentNumber = consignmentNumber;
            PaymentMethod = paymentMethod;
        }
    }
}