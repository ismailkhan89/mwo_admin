import React, { useEffect, useRef } from 'react';
import { ArrowLeft, Edit, Mail, Calendar, FileText, Download } from 'lucide-react';
import { Invoice } from '../../types';
import html2pdf from 'html2pdf.js'; // 📦 PDF library
interface InvoiceDetailsProps {
  invoice: Invoice;
  onClose: () => void;
  onEdit: () => void;
}
import logo from '../../../assets/logo.png'; // 🆕 Import logo for watermark

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ invoice, onClose, onEdit }) => {
  const invoiceRef = useRef<HTMLDivElement>(null); // 🆕 Ref for PDF section

//   useEffect(() => {
//   handleDownloadPDF(); // 🚫 Runs before DOM is ready
// }, []);
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500 text-white';        // ...existing code...
       
      case 'sent':
        return 'bg-blue-500 text-white';
      case 'overdue':
        return 'bg-red-500 text-white';
      default:
        return 'bg-slate-500 text-white';
    }
  };


const handleDownloadPDF = () => {
  if (!invoiceRef.current) {
    console.warn('Invoice DOM not ready yet');
    return;
  }

  html2pdf()
    .set({
      margin: 0.5,
      filename: `${invoice.invoiceNumber}_invoice.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    })
    .from(invoiceRef.current)
    .save();
};
  return (
    <div className="p-6 space-y-6">
          {/* Logo and Title */}


      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold text-slate-800">Invoice Details</h1>
        </div>
        <button
          onClick={onEdit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Edit className="w-4 h-4" />
          Edit Invoice
        </button>
      </div>
        <div className="flex gap-3">
          <button
            onClick={handleDownloadPDF}
            className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download as PDF
          </button>
          <button
            onClick={onEdit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit Invoice
          </button>
        </div>

      {/* Invoice Card */}
      <div ref={invoiceRef} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
        {/* Watermark Logo */}
        <img
          src={logo} // Adjust path if needed
          alt="Logo Watermark"
          className="absolute inset-0 w-2/3 h-2/3 object-contain opacity-10 pointer-events-none m-auto"
          style={{ left: '0', right: '0', top: '0', bottom: '0' }}
        />
        {/* Logo and Title Row */}
          <div className="flex items-center mb-4 ml-6 mt-6">
            <img
              src={logo}
              alt="Logo"
              className="w-16 h-16 object-contain mr-3"
            />
            <h2 className="text-lg font-semibold text-slate-800">
              Minzai Welfare Organization <br className="hidden sm:block" />

                 <span className="text-sm font-normal">Registration # DSW (4422)-K</span>
            </h2>
          </div>
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">{invoice.invoiceNumber}</h2>
              <p className="text-blue-100 mt-1">Invoice for {invoice.clientName}</p>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
              </span>
              <div className="mt-2 text-blue-100">
                <div className="text-2xl font-bold">PKR{invoice.total.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-6 space-y-6">
          {/* Invoice Information */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Invoice Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-600">Invoice Number</label>
                  <p className="text-slate-800 font-medium">{invoice.invoiceNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Issue Date</label>
                  <div className="flex items-center gap-2 text-slate-800">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    {invoice.issueDate.toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-600">Due Date</label>
                  <div className="flex items-center gap-2 text-slate-800">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    {invoice.dueDate.toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Status</label>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                    invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                    invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Client Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Client Name</label>
                <p className="text-slate-800 font-medium">{invoice.clientName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Email Address</label>
                <div className="flex items-center gap-2 text-slate-800">
                  <Mail className="w-4 h-4 text-slate-500" />
                  {invoice.clientEmail}
                </div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left p-3 font-semibold text-slate-700">Description</th>
                    <th className="text-center p-3 font-semibold text-slate-700">Quantity</th>
                    <th className="text-right p-3 font-semibold text-slate-700">Rate</th>
                    <th className="text-right p-3 font-semibold text-slate-700">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100">
                      <td className="p-3 text-slate-800">{item.description}</td>
                      <td className="p-3 text-center text-slate-700">{item.quantity}</td>
                      <td className="p-3 text-right text-slate-700">PKR{item.rate.toFixed(2)}</td>
                      <td className="p-3 text-right font-semibold text-slate-800">PKR{item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="border-t pt-6">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span>PKR{invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax (18%):</span>
                  <span>PKR{invoice.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-slate-800 border-t pt-2">
                  <span>Total:</span>
                  <span>PKR{invoice.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-semibold text-slate-800 mb-2">Invoice Metadata</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-600">Created:</span>
                <span className="ml-2 text-slate-800">{invoice.createdAt.toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-slate-600">Address:</span>
                <span className="ml-2 text-slate-800">4th Floor House#1 Metroville #1 S.I.T.E Town Karachi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;