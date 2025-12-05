import React, { useState } from 'react'
import { FileText, Download, Plus, Trash2 } from 'lucide-react'
import html2pdf from 'html2pdf.js'

function App() {
  const [formData, setFormData] = useState({
    noPenawaran: '',
    tanggal: new Date().toISOString().split('T')[0],
    kepada: '',
    perusahaan: '',
    alamat: '',
    perihal: 'Penawaran Harga'
  })

  const [items, setItems] = useState([
    { id: 1, deskripsi: '', jumlah: 1, harga: 0 }
  ])

  const [catatan, setCatatan] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleItemChange = (id, field, value) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const addItem = () => {
    setItems(prev => [...prev, {
      id: Date.now(),
      deskripsi: '',
      jumlah: 1,
      harga: 0
    }])
  }

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(prev => prev.filter(item => item.id !== id))
    }
  }

  const calculateSubtotal = (item) => {
    return item.jumlah * item.harga
  }

  const calculateTotal = () => {
    return items.reduce((total, item) => total + calculateSubtotal(item), 0)
  }

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka)
  }

  const generatePDF = () => {
    const element = document.getElementById('preview-content')
    const opt = {
      margin: 10,
      filename: `Penawaran_${formData.noPenawaran || 'draft'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }
    html2pdf().set(opt).from(element).save()
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Generator Penawaran</h1>
          <p className="text-gray-600">by Ruswandi</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Input */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Form Input
            </h2>

            {/* Informasi Surat */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3 text-gray-700">Informasi Surat</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    No. Penawaran
                  </label>
                  <input
                    type="text"
                    name="noPenawaran"
                    value={formData.noPenawaran}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="001/PEN/XII/2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    name="tanggal"
                    value={formData.tanggal}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Perihal
                  </label>
                  <input
                    type="text"
                    name="perihal"
                    value={formData.perihal}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Penawaran Harga"
                  />
                </div>
              </div>
            </div>

            {/* Informasi Penerima */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3 text-gray-700">Informasi Penerima</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kepada Yth.
                  </label>
                  <input
                    type="text"
                    name="kepada"
                    value={formData.kepada}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nama Penerima"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Perusahaan
                  </label>
                  <input
                    type="text"
                    name="perusahaan"
                    value={formData.perusahaan}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nama Perusahaan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat
                  </label>
                  <textarea
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Alamat Lengkap"
                  />
                </div>
              </div>
            </div>

            {/* Item Penawaran */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-lg text-gray-700">Item Penawaran</h3>
                <button
                  onClick={addItem}
                  className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Item
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={item.id} className="border border-gray-300 rounded-md p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-sm text-gray-700">Item {index + 1}</span>
                      {items.length > 1 && (
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Deskripsi item"
                        value={item.deskripsi}
                        onChange={(e) => handleItemChange(item.id, 'deskripsi', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="Jumlah"
                          value={item.jumlah}
                          onChange={(e) => handleItemChange(item.id, 'jumlah', Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="1"
                        />
                        <input
                          type="number"
                          placeholder="Harga Satuan"
                          value={item.harga}
                          onChange={(e) => handleItemChange(item.id, 'harga', Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="0"
                        />
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        Subtotal: {formatRupiah(calculateSubtotal(item))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Catatan */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catatan / Syarat & Ketentuan
              </label>
              <textarea
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tambahkan catatan atau syarat & ketentuan..."
              />
            </div>

            {/* Total */}
            <div className="bg-blue-50 rounded-md p-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg text-gray-700">Total:</span>
                <span className="font-bold text-2xl text-blue-600">
                  {formatRupiah(calculateTotal())}
                </span>
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={generatePDF}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-semibold"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Preview</h2>

            <div id="preview-content" className="border border-gray-300 rounded-md p-8 bg-white">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">SURAT PENAWARAN</h1>
                <p className="text-sm text-gray-600">No: {formData.noPenawaran || '___________'}</p>
              </div>

              {/* Info Surat */}
              <div className="mb-6 text-sm">
                <p className="mb-1">Tanggal: {new Date(formData.tanggal).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}</p>
                <p className="mb-1">Perihal: {formData.perihal || '___________'}</p>
              </div>

              {/* Penerima */}
              <div className="mb-6 text-sm">
                <p className="mb-1">Kepada Yth.</p>
                <p className="font-semibold mb-1">{formData.kepada || '___________'}</p>
                {formData.perusahaan && <p className="mb-1">{formData.perusahaan}</p>}
                {formData.alamat && <p className="mb-1">{formData.alamat}</p>}
              </div>

              {/* Pembuka */}
              <div className="mb-6 text-sm">
                <p className="mb-2">Dengan hormat,</p>
                <p className="text-justify">
                  Bersama ini kami mengajukan penawaran harga untuk produk/jasa sebagai berikut:
                </p>
              </div>

              {/* Tabel Item */}
              <div className="mb-6 overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2 text-left">No</th>
                      <th className="border border-gray-300 px-3 py-2 text-left">Deskripsi</th>
                      <th className="border border-gray-300 px-3 py-2 text-center">Qty</th>
                      <th className="border border-gray-300 px-3 py-2 text-right">Harga Satuan</th>
                      <th className="border border-gray-300 px-3 py-2 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={item.id}>
                        <td className="border border-gray-300 px-3 py-2">{index + 1}</td>
                        <td className="border border-gray-300 px-3 py-2">{item.deskripsi || '-'}</td>
                        <td className="border border-gray-300 px-3 py-2 text-center">{item.jumlah}</td>
                        <td className="border border-gray-300 px-3 py-2 text-right">{formatRupiah(item.harga)}</td>
                        <td className="border border-gray-300 px-3 py-2 text-right">{formatRupiah(calculateSubtotal(item))}</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-100 font-bold">
                      <td colSpan="4" className="border border-gray-300 px-3 py-2 text-right">Total:</td>
                      <td className="border border-gray-300 px-3 py-2 text-right">{formatRupiah(calculateTotal())}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Catatan */}
              {catatan && (
                <div className="mb-6 text-sm">
                  <p className="font-semibold mb-2">Catatan:</p>
                  <p className="whitespace-pre-wrap">{catatan}</p>
                </div>
              )}

              {/* Penutup */}
              <div className="mb-8 text-sm">
                <p className="mb-2 text-justify">
                  Demikian penawaran ini kami sampaikan. Atas perhatian dan kerjasamanya, kami ucapkan terima kasih.
                </p>
              </div>

              {/* Tanda Tangan */}
              <div className="flex justify-end">
                <div className="text-center text-sm">
                  <p className="mb-16">Hormat kami,</p>
                  <p className="font-bold border-t border-gray-800 pt-1">Ruswandi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
