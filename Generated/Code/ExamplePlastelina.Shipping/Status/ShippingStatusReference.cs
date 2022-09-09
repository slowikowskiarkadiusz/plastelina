// This file was generated automatically. Do not modify it by hand.

using Newtonsoft.Json;

namespace ExamplePlastelina.Shipping.ShippingStatus
{
    /// <summary>
    /// Reference provided by feeding systems
    /// </summary>
    public class ShippingStatusReference
    {
        /// <summary>
        /// Internal Order Identificator which is created based on number from source system: BICNumber (if created in Customer system), fLexNo (if created in fLex), CarLoNo (if created in CarLo) etc.
        /// </summary>
        [JsonProperty(Required = Required.Always)]
        public string InternalOrderId { get; set; }

        /// <summary>
        /// Order number provided from CarLo
        /// </summary>
        [JsonProperty(Required = Required.Always)]
        public string DocumentId { get; set; }

        /// <summary>
        /// Transport Order Number
        /// </summary>
        public string FreightForwardersReferenceNumber { get; set; }

        /// <summary>
        /// Value of the barcode for which status should be updated
        /// </summary>
        public string BarCode { get; set; }

        /// <summary>
        /// A Single Main Reference Number provided to CarLo service in EDI order on Shipping Order flow. This is internal ID for the Shipping Order provided from Partner Systems.
        /// </summary>
        [JsonProperty(Required = Required.Always)]
        public string CustomersReferenceNumber { get; set; }

        /// <summary>
        /// Reference given by the Partner (Agent)
        /// </summary>
        [JsonProperty(Required = Required.Always)]
        public string AgentReferenceNumber { get; set; }
    }
}