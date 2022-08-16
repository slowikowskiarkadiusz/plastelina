// This file was generated automatically. Do not modify it by hand.

using ExamplePlastelina.Extensions.Converters;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace ExamplePlastelina.Shipping.ShippingOrder
{
    public class TransferDue
    {
        /// <summary>
        /// Used for TransferDueOnDate
        /// </summary>
        [JsonConverter(typeof(DateOnlyJsonConverter))]
        public System.DateTime Date { get; set; }

        /// <summary>
        /// Used for TransferDueOnDateTime
        /// </summary>
        public System.DateTime DateTime { get; set; }

        /// <summary>
        /// Used for TransferDueWithinDateTimeInterval
        /// </summary>
        public System.DateTime FromDateTime { get; set; }

        /// <summary>
        /// Used for TransferDueWithinDateTimeInterval
        /// </summary>
        public System.DateTime ToDateTime { get; set; }
    }
}