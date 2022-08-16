// This file was generated automatically. Do not modify it by hand.

using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;

namespace ExamplePlastelina.Common
{
    public class WarehouseLine
    {
        public DateTime? CreatedOn { get; set; }

        public string GoodsDescription { get; set; }

        public string PoNumber { get; set; }

        public string WarehouseReceiptNumber { get; set; }

        /// <summary>
        /// Transportation Control Number
        /// </summary>
        public string Tcn { get; set; }

        /// <summary>
        /// Foreign Military Sales Case Number
        /// </summary>
        public string FMSCaseNumber { get; set; }

        /// <summary>
        /// NATO Stock Number
        /// </summary>
        public string Nsn { get; set; }

        public string PriorityCode { get; set; }

        public int? Pieces { get; set; }

        public int? PiecesQuantity { get; set; }

        public Dimensions Dimensions { get; set; }

        public int? WeightInKg { get; set; }

        public int? VolumeInM3 { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public UnitType UnitType { get; set; }

        public MonetaryValue MonetaryValue { get; set; }

        public string MarksAndNumbers { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public WarehouseLineStatus Status { get; set; }
    }
}