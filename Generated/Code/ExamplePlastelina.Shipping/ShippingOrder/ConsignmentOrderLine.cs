// This file was generated automatically. Do not modify it by hand.

using ExamplePlastelina.Common;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace ExamplePlastelina.Shipping.ShippingOrder
{
    public class ConsignmentOrderLine
    {
        public int? LineNumber { get; set; }

        public string Description { get; set; }

        public decimal? Quantity { get; set; }

        [JsonProperty(Required = Required.Always)]
        public UnitType UnitType { get; set; }

        public Temperature Temperature { get; set; }

        public UnitDimensions UnitDimensions { get; set; }

        public Volume TotalVolume { get; set; }

        public Length TotalLoadingMeters { get; set; }

        public Weight TotalNetWeight { get; set; }

        public Weight TotalGrossWeight { get; set; }

        public IEnumerable<DangerousGoods> DangerousGoods { get; set; }

        public LineAddresses Addresses { get; set; }

        public IEnumerable<Barcode> Barcodes { get; set; }

        public IEnumerable<MarkAndNumber> MarksAndNumbers { get; set; }

        public TransferDue Pickup { get; set; }

        public TransferDue Delivery { get; set; }

        public string LineReference { get; set; }

        public string HsCode { get; set; }

        public MonetaryValue TotalValue { get; set; }

        public ConsignmentOrderLine() { }

        public ConsignmentOrderLine(
            int lineNumber,
            string description,
            decimal quantity,
            UnitType unitType,
            Temperature temperature,
            UnitDimensions unitDimensions,
            Volume totalVolume,
            Length totalLoadingMeters,
            Weight totalNetWeight,
            Weight totalGrossWeight,
            IEnumerable<DangerousGoods> dangerousGoods,
            LineAddresses addresses,
            IEnumerable<Barcode> barcodes,
            IEnumerable<MarkAndNumber> marksAndNumbers,
            TransferDue pickup,
            TransferDue delivery,
            string lineReference,
            string hsCode,
            MonetaryValue totalValue)
        {
            LineNumber = lineNumber;
            Description = description;
            Quantity = quantity;
            UnitType = unitType;
            Temperature = temperature;
            UnitDimensions = unitDimensions;
            TotalVolume = totalVolume;
            TotalLoadingMeters = totalLoadingMeters;
            TotalNetWeight = totalNetWeight;
            TotalGrossWeight = totalGrossWeight;
            DangerousGoods = dangerousGoods;
            Addresses = addresses;
            Barcodes = barcodes;
            MarksAndNumbers = marksAndNumbers;
            Pickup = pickup;
            Delivery = delivery;
            LineReference = lineReference;
            HsCode = hsCode;
            TotalValue = totalValue;
        }
    }
}