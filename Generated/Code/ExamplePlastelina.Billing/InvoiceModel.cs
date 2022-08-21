// This file was generated automatically. Do not modify it by hand.

using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace ExamplePlastelina.Billing
{
    public class InvoiceModel
    {
        /// <summary>
        /// Invoice number
        /// </summary>
        [JsonProperty(Required = Required.Always)]
        public string InvoiceNumber { get; set; }

        /// <summary>
        /// Type of the invoice
        /// </summary>
        [JsonProperty(Required = Required.Always)]
        public InvoiceType InvoiceType { get; set; }

        /// <summary>
        /// Invoicing date
        /// </summary>
        [JsonProperty(Required = Required.Always)]
        public DateTime InvoiceDate { get; set; }

        /// <summary>
        /// Branch/Division indication ID
        /// </summary>
        [JsonProperty(Required = Required.Always)]
        public string Company { get; set; }

        /// <summary>
        /// Voucher number - this needs to be fetched from a financial system
        /// </summary>
        [JsonProperty(Required = Required.Always)]
        public string VoucherNumber { get; set; }

        /// <summary>
        /// Purchase Order Number
        /// </summary>
        public string PoNumber { get; set; }

        /// <summary>
        /// TMS system generating the invoice
        /// </summary>
        public TransportManagementSystem Tms { get; set; }

        /// <summary>
        /// List of transactions contained in the invoice
        /// </summary>
        [JsonProperty(Required = Required.Always)]
        public IEnumerable<Transaction> Transactions { get; set; }

        public InvoiceModel() { }

        public InvoiceModel(
            string invoiceNumber,
            InvoiceType invoiceType,
            DateTime invoiceDate,
            string company,
            string voucherNumber,
            string poNumber,
            TransportManagementSystem tms,
            IEnumerable<Transaction> transactions)
        {
            InvoiceNumber = invoiceNumber;
            InvoiceType = invoiceType;
            InvoiceDate = invoiceDate;
            Company = company;
            VoucherNumber = voucherNumber;
            PoNumber = poNumber;
            Tms = tms;
            Transactions = transactions;
        }
    }
}