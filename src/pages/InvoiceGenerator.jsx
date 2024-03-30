import { useState, useEffect } from "react";

const InvoiceGenerator = () => {

    const [subTotal, setSubTotal] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    const [gstPercentage, setGstPercentage] = useState(0);
    const [gstType, setGstType] = useState('IGST'); // Default to IGST
    const [items, setItems] = useState([]);
    const [showAddItem, setShowAddItem] = useState(true);
    const [showGenerateBtn, setShowGenerateBtn] = useState(true);

    const generateBill = (e) => {
        e.preventDefault();
        setShowAddItem(false);
        setShowGenerateBtn(false);
        document.getElementById('gst').innerText = gstPercentage;
        document.getElementById('gstPercentage').classList.toggle('hidden');
        document.getElementById('gstType').innerText = gstType;
        document.getElementById('gstTypeInput').classList.toggle('hidden');

        document.getElementById('addItemBtn').classList.toggle('hidden');
        document.getElementById('generateBtn').classList.toggle('hidden');

        confirm("Press ok to generate the bill");
        window.print();
    }

    const addItem = () => {
        const newItem = {
            sno: items.length + 1, // Incrementing serial number
            description: '',
            hsnCode: '',
            quantity: '',
            unitPrice: '',
            total: 0 // Initial total for the new item
        };

        setItems([...items, newItem]);
    }

    // Update total amount whenever items change
    useEffect(() => {
        let total = 0;
        items.forEach(item => {
            total += item.total;
        });
        setSubTotal(total);
    }, [items]);

    // Update item details when input fields change
    const handleItemChange = (index, fieldName, value) => {
        const updatedItems = [...items];
        updatedItems[index][fieldName] = value;

        // Calculate total for the updated item
        const quantity = parseInt(updatedItems[index].quantity) || 0;
        const unitPrice = parseFloat(updatedItems[index].unitPrice) || 0;
        updatedItems[index].total = quantity * unitPrice;

        setItems(updatedItems);
    }

    const handleGstChange = (e) => {
        setGstPercentage(parseFloat(e.target.value));
        var total = subTotal + (subTotal * (gstPercentage / 100));
        setGrandTotal(total);
    }

    const handleGstTypeChange = (e) => {
        setGstType(e.target.value);
    }

    return (
        <div className=" mx-auto bg-white shadow-md rounded-md p-8 mt-10"
            style={{ width: '950px' }} id="print">

            {/* Invoice Header */}
            <div className="flex justify-between ">
                <img src="" id="logo" alt="Logo" className="h-12 mr-4 hidden" />
                <div id="file" >
                    <label htmlFor="file">Upload Logo </label>
                    <input type="file" name="file" accept="image/*" onChange={e => {
                        const reader = new FileReader();
                        reader.onload = () => {
                            document.getElementById('logo').classList.remove('hidden');
                            const image = document.querySelector('img');
                            image.src = reader.result;
                            document.getElementById('file').classList.add('hidden');
                        };
                        reader.readAsDataURL(e.target.files[0]);
                    }} />
                </div>
                <h1 className="text-2xl font-bold mb-14 text-center">Tax Invoice </h1>
            </div>
            <div className="flex justify-between">
                <p className="text-sm">Invoice Number: <span>
                    <input type="text" placeholder="INV-12345" className="bg-transparent cursor-pointer" name="invoiceNumber" disabled />
                </span></p>
                <p className="text-sm">Date: <input type="text" className="bg-transparent cursor-pointer p-1" required name="date" /></p>
            </div>

            {/* Sender and Recipient Details */}
            <div className="flex justify-between my-1">
                <div className="w-1/2">
                    <h2 className="text-lg font-bold mb-2">From:</h2>

                    <p className="mb-1">Company Name: <input type="text" className="bg-transparent cursor-pointer p-1 outline-none" placeholder="Company Name" required name="companyName" /></p>
                    <p className="mb-1">Address: <input type="text" className="bg-transparent cursor-pointer p-1 outline-none" placeholder="Address" required name="address" /></p>
                    <p className="mb-1">State: <input type="text" className="bg-transparent cursor-pointer p-1 outline-none" placeholder="State" required name="state" /></p>
                    <p className="mb-1">City: <input type="text" className="bg-transparent cursor-pointer p-1 outline-none" placeholder="City" required name="city" /></p>
                    <p className="mb-1">GSTIN: <input type="text" className="bg-transparent cursor-pointer p-1 " placeholder="GSTIN" required name="gstin" /></p>
                </div>
                <div className="w-1/2">
                    <h2 className="text-lg font-bold mb-2">To:</h2>
                    <p className="mb-1">Client Name: <input type="text" className="bg-transparent cursor-pointer p-1 outline-none" placeholder="Client Name" required name="clientName" /></p>
                    <p className="mb-1">Client State: <input type="text" className="bg-transparent cursor-pointer p-1 outline-none" placeholder="Client State" required name="clientState" /></p>
                    <p className="mb-1">Client State Code: <input type="text" className="bg-transparent cursor-pointer p-1 outline-none" placeholder="Client State Code" required name="clientStateCode" /></p>
                </div>
            </div>

            {/* Invoice Items */}
            <div className="mb-2 mx-auto" style={{ width: '950px' }}>
                <table>
                    <thead>
                        <tr>
                            <th className="border-b-2 px-4 py-2">S. No.</th>
                            <th className="border-b-2 px-4 py-2">Description</th>
                            <th className="border-b-2 px-4 py-2">HSN Code</th>
                            <th className="border-b-2 px-4 py-2">Quantity</th>
                            <th className="border-b-2 px-4 py-2">Unit Price</th>
                            <th className="border-b-2 px-4 py-2">Total</th>
                        </tr>
                    </thead>
                    <tbody id="items">
                        {items.map((item, index) => (
                            <tr key={index}>
                                <td>{item.sno}</td>
                                <td><input type="text" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} /></td>
                                <td><input type="text" value={item.hsnCode} onChange={(e) => handleItemChange(index, 'hsnCode', e.target.value)} /></td>
                                <td><input type="text" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} /></td>
                                <td><input type="text" value={item.unitPrice} onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)} /></td>
                                <td>{item.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Total Amount */}
            <div className="flex justify-end">
                <p className="text-lg font-semibold">Total Amount: {subTotal}</p>
            </div>

            {/* Gst section */}
            {showAddItem && showGenerateBtn && (
                <div className="justify-end my-3 right-0">
                    <div id="gstDetails" className="mb-2 flex justify-end">
                        {gstType === 'CGST_SGST' && (
                            <p>CGST: {gstPercentage / 2}%<br />SGST: {gstPercentage / 2}%</p>
                        )}
                        {gstType === 'IGST' && (
                            <p>IGST: {gstPercentage}%</p>
                        )}
                    </div>
                    <div className="mb-2 flex justify-end">
                        <label htmlFor="gstPercentage">GST Percentage:</label>
                        <input type="number" id="gstPercentage" value={gstPercentage} onChange={handleGstChange} />
                        <span id="gst">%</span>
                    </div>
                    <div className="mb-2 flex justify-end">
                        <label htmlFor="gstType">GST Type:</label>
                        <span id="gstType"></span>
                        <select id="gstTypeInput" value={gstType} onChange={handleGstTypeChange}>
                            <option value="IGST">IGST</option>
                            <option value="CGST_SGST">CGST + SGST</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Grand Total */}
            <div className="flex justify-end">
                <p className="text-lg font-semibold">Grand Total: {grandTotal}</p>
            </div>

            {showAddItem && showGenerateBtn && (
                <div className="flex justify-end">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-4 rounded" id="addItemBtn" onClick={addItem}>Add Item</button>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-4 rounded" id="generateBtn" onClick={generateBill}>Generate Bill</button>
                </div>
            )}

        </div>
    );
}

export default InvoiceGenerator;
