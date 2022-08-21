// This file was generated automatically. Do not modify it by hand.

using ExamplePlastelina.Common;
using Newtonsoft.Json;

namespace ExamplePlastelina.Shipping.ShippingOrder
{
    public class TransportDetails
    {
        [JsonProperty(Required = Required.Always)]
        public TransportMode Mode { get; set; }

        /// <summary>
        /// Used for Road transport
        /// </summary>
        public string TruckRegistrationNumber { get; set; }

        /// <summary>
        /// Used for Road transport
        /// </summary>
        public string TrailerRegistrationNumber { get; set; }

        /// <summary>
        /// Used for Sea transport
        /// </summary>
        public string VesselName { get; set; }

        /// <summary>
        /// Used for Air and Sea transport
        /// </summary>
        public string PortOfLoading { get; set; }

        /// <summary>
        /// Used for Sea transport
        /// </summary>
        public string PortOfLoadingCode { get; set; }

        /// <summary>
        /// Used for Air and Sea transport
        /// </summary>
        public string PortOfDischarge { get; set; }

        /// <summary>
        /// Used for Sea transport
        /// </summary>
        public string PortOfDischargeCode { get; set; }

        /// <summary>
        /// Used for Air and Sea transport
        /// </summary>
        public string WaybillNumber { get; set; }

        /// <summary>
        /// Used for Air and Sea transport
        /// </summary>
        public string HouseWaybillNumber { get; set; }

        /// <summary>
        /// Used for Air and Sea transport
        /// </summary>
        public string VoyageNumber { get; set; }

        /// <summary>
        /// Used for Sea transport
        /// </summary>
        public System.DateTime VGMClosingDateTime { get; set; }

        /// <summary>
        /// Used for Sea transport
        /// </summary>
        public System.DateTime CargoCutOffDateTime { get; set; }

        /// <summary>
        /// Used for Sea transport
        /// </summary>
        public System.DateTime EstimatedDepartureDate { get; set; }

        /// <summary>
        /// Used for Sea transport
        /// </summary>
        public System.DateTime EstimatedArrivalDate { get; set; }

        public QuoteType QuoteType { get; set; }

        public TransportDetails() { }

        public TransportDetails(
            TransportMode mode,
            string truckRegistrationNumber,
            string trailerRegistrationNumber,
            string vesselName,
            string portOfLoading,
            string portOfLoadingCode,
            string portOfDischarge,
            string portOfDischargeCode,
            string waybillNumber,
            string houseWaybillNumber,
            string voyageNumber,
            System.DateTime vGMClosingDateTime,
            System.DateTime cargoCutOffDateTime,
            System.DateTime estimatedDepartureDate,
            System.DateTime estimatedArrivalDate,
            QuoteType quoteType)
        {
            Mode = mode;
            TruckRegistrationNumber = truckRegistrationNumber;
            TrailerRegistrationNumber = trailerRegistrationNumber;
            VesselName = vesselName;
            PortOfLoading = portOfLoading;
            PortOfLoadingCode = portOfLoadingCode;
            PortOfDischarge = portOfDischarge;
            PortOfDischargeCode = portOfDischargeCode;
            WaybillNumber = waybillNumber;
            HouseWaybillNumber = houseWaybillNumber;
            VoyageNumber = voyageNumber;
            VGMClosingDateTime = vGMClosingDateTime;
            CargoCutOffDateTime = cargoCutOffDateTime;
            EstimatedDepartureDate = estimatedDepartureDate;
            EstimatedArrivalDate = estimatedArrivalDate;
            QuoteType = quoteType;
        }
    }
}