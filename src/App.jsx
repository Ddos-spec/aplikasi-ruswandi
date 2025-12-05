import React, { useState, useEffect } from 'react'
import { FileText, Download, Plus, Trash2, RefreshCw } from 'lucide-react'
import html2pdf from 'html2pdf.js'

function App() {
  const generateNoPenawaran = () => {
    const now = new Date()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const year = now.getFullYear()
    const random = Math.floor(Math.random() * 9000) + 1000 // 4 digit random
    return `${random}/PEN/${month}/${year}`
  }

  const [formData, setFormData] = useState({
    noPenawaran: generateNoPenawaran(),
    tanggal: new Date().toISOString().split('T')[0],
    kepada: '',
    perusahaan: '',
    alamat: '',
    perihal: 'Penawaran Harga'
  })

  const [items, setItems] = useState([
    { id: 1, deskripsi: '', qty: 1, satuan: 'm1', hargaSatuan: 0 }
  ])

  const [dpPercentage, setDpPercentage] = useState(0)
  const [termasukPemasangan, setTermasukPemasangan] = useState(false)

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
      qty: 1,
      satuan: 'm1',
      hargaSatuan: 0
    }])
  }

  const formatRupiahInput = (value) => {
    // Hapus semua karakter non-digit
    const numbers = value.replace(/\D/g, '')
    // Format dengan titik sebagai pemisah ribuan
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  const parseRupiahInput = (value) => {
    // Hapus titik dan convert ke number
    return parseInt(value.replace(/\./g, '') || '0')
  }

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(prev => prev.filter(item => item.id !== id))
    }
  }

  const calculateSubtotal = (item) => {
    return item.qty * item.hargaSatuan
  }

  const calculateTotal = () => {
    return items.reduce((total, item) => total + calculateSubtotal(item), 0)
  }

  const calculateDpAmount = () => {
    return (calculateTotal() * dpPercentage) / 100
  }

  const calculateGrandTotal = () => {
    return calculateTotal() - calculateDpAmount()
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
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="noPenawaran"
                      value={formData.noPenawaran}
                      onChange={handleInputChange}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="001/PEN/XII/2024"
                    />
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, noPenawaran: generateNoPenawaran() }))}
                      className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                      title="Generate nomor baru"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  </div>
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
                  className="flex items-center gap-1 px-3 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-sm"
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
                      <textarea
                        placeholder="Deskripsi item (contoh: Jati ukuran 1,5cm x 9cm x 200cm)"
                        value={item.deskripsi}
                        onChange={(e) => handleItemChange(item.id, 'deskripsi', e.target.value)}
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Qty / Jumlah</label>
                          <input
                            type="number"
                            placeholder="121"
                            value={item.qty === 0 ? '' : item.qty}
                            onChange={(e) => handleItemChange(item.id, 'qty', Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Satuan</label>
                          <select
                            value={item.satuan}
                            onChange={(e) => handleItemChange(item.id, 'satuan', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="m1">m1 (meter)</option>
                            <option value="m2">m2 (meter²)</option>
                            <option value="m3">m3 (meter³)</option>
                            <option value="pcs">pcs (pieces)</option>
                            <option value="set">set</option>
                            <option value="batang">batang</option>
                            <option value="lembar">lembar</option>
                            <option value="unit">unit</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Harga Satuan</label>
                          <input
                            type="text"
                            placeholder="220.000"
                            value={item.hargaSatuan === 0 ? '' : formatRupiahInput(item.hargaSatuan.toString())}
                            onChange={(e) => handleItemChange(item.id, 'hargaSatuan', parseRupiahInput(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div className="bg-gray-50 px-3 py-2 rounded border border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">Subtotal Item:</span>
                          <span className="font-semibold text-purple-600">{formatRupiah(calculateSubtotal(item))}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Pemasangan */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Pemasangan
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="pemasangan"
                    checked={!termasukPemasangan}
                    onChange={() => setTermasukPemasangan(false)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Harga belum termasuk pemasangan</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="pemasangan"
                    checked={termasukPemasangan}
                    onChange={() => setTermasukPemasangan(true)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Harga sudah termasuk pemasangan</span>
                </label>
              </div>
            </div>

            {/* DP */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                DP / Uang Muka dalam Persen (Opsional)
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="Contoh: 50"
                  value={dpPercentage === 0 ? '' : dpPercentage}
                  onChange={(e) => setDpPercentage(Number(e.target.value))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="100"
                />
                <span className="text-gray-700 font-medium">%</span>
              </div>
              {dpPercentage > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  DP {dpPercentage}% = {formatRupiah(calculateDpAmount())}
                </p>
              )}
            </div>

            {/* Total */}
            <div className="bg-purple-50 rounded-md p-4 mb-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg text-gray-700">TOTAL:</span>
                <span className="font-bold text-2xl text-purple-600">
                  {formatRupiah(calculateTotal())}
                </span>
              </div>
              {dpPercentage > 0 && (
                <>
                  <div className="flex justify-between items-center text-sm border-t pt-2">
                    <span className="font-medium text-gray-700">DP ({dpPercentage}%):</span>
                    <span className="font-semibold text-gray-800">
                      {formatRupiah(calculateDpAmount())}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t pt-2">
                    <span className="font-bold text-lg text-orange-700">SISA TAGIHAN SETELAH TERPASANG:</span>
                    <span className="font-bold text-xl text-orange-600">
                      {formatRupiah(calculateGrandTotal())}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Download Button */}
            <button
              onClick={generatePDF}
              className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 font-semibold"
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
              <div className="mb-8">
                <img
                  src="headerpenawaran.jpeg"
                  alt="Header Serasi Parquet"
                  className="w-full h-auto"
                />
              </div>

              {/* Info Surat */}
              <div className="mb-6 text-sm">
                <p className="mb-1">No: {formData.noPenawaran || '___________'}</p>
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
                <p className="text-justify mb-3">
                  Terima kasih atas kesempatan yang diberikan kepada kami untuk mengajukan penawaran.
                  Sehubungan dengan kebutuhan Bapak/Ibu, dengan ini kami sampaikan penawaran harga
                  untuk produk/jasa yang kami tawarkan dengan rincian sebagai berikut:
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
                      <th className="border border-gray-300 px-3 py-2 text-center">Satuan</th>
                      <th className="border border-gray-300 px-3 py-2 text-right">Harga Satuan</th>
                      <th className="border border-gray-300 px-3 py-2 text-right">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={item.id}>
                        <td className="border border-gray-300 px-3 py-2">{index + 1}</td>
                        <td className="border border-gray-300 px-3 py-2">{item.deskripsi || '-'}</td>
                        <td className="border border-gray-300 px-3 py-2 text-center">{item.qty}</td>
                        <td className="border border-gray-300 px-3 py-2 text-center">{item.satuan}</td>
                        <td className="border border-gray-300 px-3 py-2 text-right">{formatRupiah(item.hargaSatuan)}</td>
                        <td className="border border-gray-300 px-3 py-2 text-right">{formatRupiah(calculateSubtotal(item))}</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-200 font-bold text-base">
                      <td colSpan="5" className="border border-gray-300 px-3 py-2 text-right">TOTAL:</td>
                      <td className="border border-gray-300 px-3 py-2 text-right">{formatRupiah(calculateTotal())}</td>
                    </tr>
                    {dpPercentage > 0 && (
                      <>
                        <tr className="font-semibold">
                          <td colSpan="5" className="border border-gray-300 px-3 py-2 text-right">DP ({dpPercentage}%):</td>
                          <td className="border border-gray-300 px-3 py-2 text-right">{formatRupiah(calculateDpAmount())}</td>
                        </tr>
                        <tr className="bg-orange-50 font-bold text-base">
                          <td colSpan="5" className="border border-gray-300 px-3 py-2 text-right">SISA TAGIHAN SETELAH TERPASANG:</td>
                          <td className="border border-gray-300 px-3 py-2 text-right">{formatRupiah(calculateGrandTotal())}</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Note */}
              <div className="mb-6 text-sm border border-gray-300 bg-yellow-50 p-4 rounded">
                <p className="font-bold mb-2">NOTE:</p>
                <p className="mb-2">PEMBAYARAN MOHON DI TRANSFER KE REK. BCA NO. REK. 7550033997 A/N RUSWANDI</p>
                <p className="italic">
                  "{termasukPemasangan ? 'Harga tersebut sudah termasuk pemasangan' : 'Harga tersebut belum termasuk pemasangan'}"
                </p>
              </div>

              {/* Penutup */}
              <div className="mb-8 text-sm">
                <p className="mb-3 text-justify">
                  Demikian penawaran harga ini kami sampaikan dengan sebenar-benarnya.
                  Apabila ada hal-hal yang perlu didiskusikan lebih lanjut, kami siap untuk
                  melakukan pertemuan atau komunikasi lebih lanjut.
                </p>
                <p className="text-justify">
                  Besar harapan kami penawaran ini dapat diterima dengan baik dan dapat terjalin
                  kerja sama yang saling menguntungkan. Atas perhatian dan kepercayaan yang diberikan,
                  kami ucapkan terima kasih.
                </p>
              </div>

              {/* Tanda Tangan */}
              <div className="flex justify-end">
                <div className="text-center text-sm">
                  <p className="mb-2">Hormat kami,</p>
                  <img
                    src="tanda tangan.png"
                    alt="Tanda Tangan"
                    className="w-32 h-auto mx-auto"
                  />
                  <p className="font-bold border-t border-gray-800 pt-1 mt-2">Ruswandi</p>
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
