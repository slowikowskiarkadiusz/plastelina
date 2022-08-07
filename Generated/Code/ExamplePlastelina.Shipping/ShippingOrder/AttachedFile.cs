// This file was generated automatically. Do not modify it by hand.

using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace ExamplePlastelina.Shipping.ShippingOrder;

public class AttachedFile
{
    public string FileName { get; set; }
    [JsonConverter(typeof(StringEnumConverter))]
    public DocumentType DocumentType { get; set; }
    public string Data { get; set; }
}