// This file was generated automatically. Do not modify it by hand.

using Newtonsoft.Json;
using System;

namespace ExamplePlastelina.Billing
{
    public class FinancialOperation
    {
        /// <summary>
        /// Transaction amount
        /// </summary>
        [JsonProperty(Required = Required.Always)]
        public double Amount { get; set; }

        /// <summary>
        /// Transaction currency code
        /// </summary>
        [JsonProperty(Required = Required.Always)]
        public string CurrencyCode { get; set; }

        /// <summary>
        /// Transaction amount in company currency (base amount)
        /// </summary>
        public double? CompanyCurrencyAmount { get; set; }

        /// <summary>
        /// Transaction company currency code
        /// </summary>
        public string CompanyCurrencyCode { get; set; }

        /// <summary>
        /// Exchange rate for the transaction
        /// </summary>
        public double? ExchangeRate { get; set; }

        /// <summary>
        /// Exchange rate date
        /// </summary>
        public DateTime? ExchangeDate { get; set; }
    }
}