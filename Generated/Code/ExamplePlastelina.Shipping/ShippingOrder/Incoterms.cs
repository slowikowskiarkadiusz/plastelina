// This file was generated automatically. Do not modify it by hand.

using Newtonsoft.Json;

namespace ExamplePlastelina.Shipping.ShippingOrder
{
    public class Incoterms
    {
        [JsonProperty(Required = Required.Always)]
        public IncotermsCode Code { get; set; }

        public string City { get; set; }

        public string CustomTermsOfDeliveryCode { get; set; }

        public Incoterms() { }

        public Incoterms(
            IncotermsCode code,
            string city,
            string customTermsOfDeliveryCode)
        {
            Code = code;
            City = city;
            CustomTermsOfDeliveryCode = customTermsOfDeliveryCode;
        }
    }
}