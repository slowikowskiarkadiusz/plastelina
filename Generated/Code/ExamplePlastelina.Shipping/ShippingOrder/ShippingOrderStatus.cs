// This file was generated automatically. Do not modify it by hand.

namespace ExamplePlastelina.Shipping.ShippingOrder;

public class ShippingOrderStatus
{
    public System.DateTime TimeOfMessageGeneration { get; set; }
    public System.DateTime TimeOfEvent { get; set; }
    public ShippingOrderStatusIdentification StatusIdentification { get; set; }
    public Location Location { get; set; }
    public Status Status { get; set; }
    public string SourceStatus { get; set; }
    public string AdditionalMessage { get; set; }
    public string Signature { get; set; }
    public MessageIdentification MessageIdentification { get; set; }
}