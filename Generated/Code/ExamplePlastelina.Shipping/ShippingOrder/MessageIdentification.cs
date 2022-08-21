// This file was generated automatically. Do not modify it by hand.

using ExamplePlastelina.Common;
using Newtonsoft.Json;

namespace ExamplePlastelina.Shipping.ShippingOrder
{
    public class MessageIdentification
    {
        public string ReceiverId { get; set; }

        public string SenderId { get; set; }

        public string ClientId { get; set; }

        public string OrganizationNumber { get; set; }

        public string DocumentId { get; set; }

        [JsonProperty(Required = Required.Always)]
        public Operation Operation { get; set; }

        public string InterchangeControlReference { get; set; }

        public MessageIdentification() { }

        public MessageIdentification(
            string receiverId,
            string senderId,
            string clientId,
            string organizationNumber,
            string documentId,
            Operation operation,
            string interchangeControlReference)
        {
            ReceiverId = receiverId;
            SenderId = senderId;
            ClientId = clientId;
            OrganizationNumber = organizationNumber;
            DocumentId = documentId;
            Operation = operation;
            InterchangeControlReference = interchangeControlReference;
        }
    }
}