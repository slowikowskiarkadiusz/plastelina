// This file was generated automatically. Do not modify it by hand.

using System;

namespace ExamplePlastelina.Billing;

public class Transaction
{
    /// <summary>
    /// Service provider/Customer ID
    /// </summary>
    public string Account { get; set; }
    /// <summary>
    /// Account type
    /// </summary>
    public AccountType AccountType { get; set; }
    /// <summary>
    /// Transaction debit amount
    /// </summary>
    public FinancialOperation Debit { get; set; }
    /// <summary>
    /// Transaction credit amount
    /// </summary>
    public FinancialOperation Credit { get; set; }
    /// <summary>
    /// Description of the transaction
    /// </summary>
    public string TransactionDescription { get; set; }
    /// <summary>
    /// Busines Unit
    /// </summary>
    public string BusinessUnit { get; set; }
    /// <summary>
    /// Department
    /// </summary>
    public string Department { get; set; }
    /// <summary>
    /// Cost center (Dim3)
    /// </summary>
    public string CostCenter { get; set; }
    /// <summary>
    /// Business Area (Dim4)
    /// </summary>
    public string BusinessArea { get; set; }
    /// <summary>
    /// Type of transport (Dim5)
    /// </summary>
    public string ModeOfTransport { get; set; }
    /// <summary>
    /// Origin country (Dim6)
    /// </summary>
    public string FromCountry { get; set; }
    /// <summary>
    /// Destination country (Dim7)
    /// </summary>
    public string ToCountry { get; set; }
    /// <summary>
    /// Number of the activity (Dim8)
    /// </summary>
    public string ActivityNumber { get; set; }
    /// <summary>
    /// Number of job file (Dim9)
    /// </summary>
    public string JobFileNo { get; set; }
    /// <summary>
    /// (Dim10)
    /// </summary>
    public string InterCompany { get; set; }
    /// <summary>
    /// Customer number (Dim11)
    /// </summary>
    public string CustomerNo { get; set; }
    /// <summary>
    /// Due date of the transaction - date of creation plus x days (normally 14)
    /// </summary>
    public DateTime? DueDate { get; set; }
    /// <summary>
    /// Date when the job is scheduled
    /// </summary>
    public DateTime? JobDate { get; set; }
    /// <summary>
    /// Information about Tax
    /// </summary>
    public TaxCode TaxCode { get; set; }
}