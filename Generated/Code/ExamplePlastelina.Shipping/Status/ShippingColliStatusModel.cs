// This file was generated automatically. Do not modify it by hand.

using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;

namespace ExamplePlastelina.Shipping.ShippingStatus
{
    /// <summary>
    /// Interface holding all relevant information about Colli status
    /// </summary>
    public class ShippingColliStatusModel
    {
        /// <summary>
        /// Date time when status has been generated. Timestamp is in UTC and +hh:mm is the time zone.
        /// </summary>
        [JsonProperty(Required = Required.Always)]
        public DateTime TimeOfMessageGeneration { get; set; }

        /// <summary>
        /// Date time when event was. Timestamp is in UTC and +hh:mm is the time zone.
        /// </summary>
        [JsonProperty(Required = Required.Always)]
        public DateTime TimeOfEvent { get; set; }

        /// <summary>
        /// Reference class with information of order identification values
        /// </summary>
        public ShippingStatusReference Reference { get; set; }

        /// <summary>
        /// Location class of current order status
        /// </summary>
        public ShippingStatusLocation Location { get; set; }

        /// <summary>
        /// Enum type which represents status
        /// </summary>
        [JsonConverter(typeof(StringEnumConverter))]
        [JsonProperty(Required = Required.Always)]
        public Status Status { get; set; }

        /// <summary>
        /// Status message from source system
        /// </summary>
        public string SourceStatus { get; set; }

        /// <summary>
        /// Message attached to status information
        /// </summary>
        public string AdditionalMessage { get; set; }

        /// <summary>
        /// Identifier of Parter, which should consume the status.
        /// </summary>
        public string ClientId { get; set; }

        /// <summary>
        /// Name or ID of the person signing a delivery
        /// </summary>
        public string SignatureText { get; set; }

        public ShippingColliStatusModel(
            DateTime timeOfMessageGeneration,
            DateTime timeOfEvent,
            Status status)
        {
            TimeOfMessageGeneration = timeOfMessageGeneration;
            TimeOfEvent = timeOfEvent;
            Status = status;
        }
    }
}