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
        public int Amount { get; set; }

        /// <summary>
        /// Transaction currency code
        /// </summary>
        [JsonProperty(Required = Required.Always)]
        public string CurrencyCode { get; set; }

        /// <summary>
        /// Transaction amount in company currency (base amount)
        /// </summary>
        public int? CompanyCurrencyAmount { get; set; }

        /// <summary>
        /// Transaction company currency code
        /// </summary>
        public string CompanyCurrencyCode { get; set; }

        /// <summary>
        /// Exchange rate for the transaction
        /// </summary>
        public int? ExchangeRate { get; set; }

        /// <summary>
        /// Exchange rate date
        /// </summary>
        public DateTime? ExchangeDate { get; set; }

        public FinancialOperation() { }

        public FinancialOperation(
            int amount,
            string currencyCode,
            int companyCurrencyAmount,
            string companyCurrencyCode,
            int exchangeRate,
            DateTime exchangeDate)
        {
            Amount = amount;
            CurrencyCode = currencyCode;
            CompanyCurrencyAmount = companyCurrencyAmount;
            CompanyCurrencyCode = companyCurrencyCode;
            ExchangeRate = exchangeRate;
            ExchangeDate = exchangeDate;
        }
    }
}