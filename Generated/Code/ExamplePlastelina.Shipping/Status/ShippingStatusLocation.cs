// This file was generated automatically. Do not modify it by hand.

namespace ExamplePlastelina.Shipping.ShippingStatus;

/// <summary>
/// Holding information about the location that the status update has taken place in
/// </summary>
public class ShippingStatusLocation
{
    /// <summary>
    /// Part of GPS location which represents longitude value; CarLo will not provide this value
    /// </summary>
    public string Longitude { get; set; }
    /// <summary>
    /// Part of GPS location which represents latitude value, CarLo will not provide this value
    /// </summary>
    public string Latitude { get; set; }
    /// <summary>
    /// Name of the location
    /// </summary>
    public string Name { get; set; }
}