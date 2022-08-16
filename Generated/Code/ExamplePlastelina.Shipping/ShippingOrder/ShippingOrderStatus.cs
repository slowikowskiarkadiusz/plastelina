// This file was generated automatically. Do not modify it by hand.

using Newtonsoft.Json;

namespace ExamplePlastelina.Shipping.ShippingOrder
{
    public class ShippingOrderStatus
    {
        [JsonProperty(Required = Required.Always)]
        public System.DateTime TimeOfMessageGeneration { get; set; }

        [JsonProperty(Required = Required.Always)]
        public System.DateTime TimeOfEvent { get; set; }

        public ShippingOrderStatusIdentification StatusIdentification { get; set; }

        public Location Location { get; set; }

        [JsonProperty(Required = Required.Always)]
        public Status Status { get; set; }

        public string SourceStatus { get; set; }

        public string AdditionalMessage { get; set; }

        public string Signature { get; set; }

        public MessageIdentification MessageIdentification { get; set; }

        public ShippingOrderStatus(
            System.DateTime timeOfMessageGeneration,
            System.DateTime timeOfEvent,
            Status status)
        {
            TimeOfMessageGeneration = timeOfMessageGeneration;
            TimeOfEvent = timeOfEvent;
            Status = status;
        }
    }
}