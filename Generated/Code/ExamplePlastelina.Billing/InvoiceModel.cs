// This file was generated automatically. Do not modify it by hand.

using System;
using System.Collections.Generic;

namespace ExamplePlastelina.Billing;

public class InvoiceModel
{
    /// <summary>
    /// Invoice number
    /// </summary>
    public string InvoiceNumber { get; set; }
    /// <summary>
    /// Type of the invoice
    /// </summary>
    public InvoiceType InvoiceType { get; set; }
    /// <summary>
    /// Invoicing date
    /// </summary>
    public DateTime InvoiceDate { get; set; }
    /// <summary>
    /// Branch/Division indication ID
    /// </summary>
    public string Company { get; set; }
    /// <summary>
    /// Voucher number - this needs to be fetched from a financial system
    /// </summary>
    public string VoucherNumber { get; set; }
    /// <summary>
    /// Purchase Order Number
    /// </summary>
    public string PoNumber { get; set; }
    /// <summary>
    /// TMS system generating the invoice
    /// </summary>
    public TransportManagementSystem Tms { get; set; }
    public IEnumerable<Transaction> Transactions { get; set; }
}