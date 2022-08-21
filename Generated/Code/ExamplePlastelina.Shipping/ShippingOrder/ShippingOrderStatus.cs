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

        public ShippingOrderStatus() { }

        public ShippingOrderStatus(
            System.DateTime timeOfMessageGeneration,
            System.DateTime timeOfEvent,
            ShippingOrderStatusIdentification statusIdentification,
            Location location,
            Status status,
            string sourceStatus,
            string additionalMessage,
            string signature,
            MessageIdentification messageIdentification)
        {
            TimeOfMessageGeneration = timeOfMessageGeneration;
            TimeOfEvent = timeOfEvent;
            StatusIdentification = statusIdentification;
            Location = location;
            Status = status;
            SourceStatus = sourceStatus;
            AdditionalMessage = additionalMessage;
            Signature = signature;
            MessageIdentification = messageIdentification;
        }
    }
}