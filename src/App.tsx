import React, { useState } from 'react'
import axios from 'axios';
import JSZip from 'jszip';
import bgcover from './assets/cover/doggo.gif'



const Dashboard: React.FC = () => {

    // const [imageUrls, setImageUrls] = useState([]);
    const [zipFile, setZipFile] = useState<Blob>();
    const [fetching, setFetching] = useState<string>('');
    const [ordernum, setOrdernum] = useState<number>(0);
    const [fetchdis, setFetchdis] = useState<boolean>(false);
    const [btndl, setBtndl] = useState<boolean>(false);
    const [totalData, setTotalData] = useState<number>(0);
    const [dlpage, setDlPage] = useState<boolean>(false);

    const bgcoveru = `url("${bgcover}")`;

    const dirOptions =[
        {
            label: 'SILVER Executive',
            value: 'se'
        },
        {
            label: 'GOLD Executive',
            value: 'ge'
        },
        {
            label: 'Millionaires Club',
            value: 'mc'
        },
        {
            label: 'Golden Ambassador',
            value: 'ga'
        },
        {
            label: 'GA Prime',
            value: 'gap'
        },
    ]

    const [formData, setFormData] = useState({
        directory: '',
        datus: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFetchImages = async () => {
        console.log('Fetching...');
        setFetchdis(true)
        setDlPage(true)
        try {
            
            const makeArrUrls = formData.datus;
            // const makeArrUrls = 'HKG14776*https://images.empoweredconsumerism-static-files.com/avatar/k0532eab58bb2b20ba42913edd77ec9t.jpg!HKG65606*https://images.empoweredconsumerism-static-files.com/avatar/kf8d488d8df3a1afa2ba0b8af01bb30t.jpg!HKG111000*https://images.empoweredconsumerism-static-files.com/avatar/kc76da649f856bdaa682a79af38e2fct.jpg!';
            const urls = makeArrUrls.split('!')
            const filteredUrls = urls.filter((item) => item !== '' && item !== null && item !== undefined && item.length > 5);

            setTotalData(filteredUrls.length)
            
            // Fetch image data and create a zip file
            const zip = new JSZip();

            const imagePromises = filteredUrls.map(async (url, index) => {
            
                const split = url.split('*') //split[0]-userid, split[1]-url
                const wordToFind = "default-avatar";

                if (!split[1].includes(wordToFind)) {
                    // console.log('ok to');
                    setFetching(split[0])
                    setOrdernum(index+1)
                    const response = await axios.get(split[1], { responseType: 'arraybuffer' });
                    zip.file(split[0]+'.jpg', response.data);
                }
            });
        
            // Wait for all images to be added to the zip
            await Promise.all(imagePromises);
        
            // Generate the zip file
            const content = await zip.generateAsync({ type: 'blob' });

            setZipFile(content);
            setFetchdis(false);
            setBtndl(true);

        } catch (error) {
            console.error('Error fetching images:', error);
        }
        
    };

    const handleDownloadZip = () => {
        if (zipFile) {
            const url = window.URL.createObjectURL(zipFile);
            const a = document.createElement('a');
            a.href = url;
            a.download = formData.directory+'.zip'; // Specify the desired zip file name
            a.click();
            window.URL.revokeObjectURL(url);
        }
    };

    // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     console.log('Form data:', formData);
    // };

    return (
        <>
            <div className="container mx-auto py-8 bg-cover bg-center h-screen" style={{backgroundImage: bgcoveru}}>
            {/* <div className="container mx-auto py-8 bg-cover bg-center h-screen" style={{backgroundImage: ''}}> */}
                <div className="grid grid-cols-3 gap-5">
                    <div className="col-span-2">
                        {/* <div className="p-8 rounded shadow-md"> */}
                        <div className="bg-gray-100 p-8 rounded shadow-md">
                            <h4 className="text-2xl font-semibold mb-4">EC Awardees Avatar</h4>
                            <br />
                            <form onSubmit={handleFetchImages}>
                                <div className="mb-4">
                                    <label htmlFor="name" className="block font-bold mb-2">
                                        Category:
                                    </label>
                                    <select 
                                        name="directory"
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                        onChange={handleChange}
                                    >
                                        <option value="">-- Select Here, NOOB Van --</option>
                                        {dirOptions.map((val, index) => (
                                            <option key={index} value={val.value}>
                                                {val.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <br />
                                <div className="mb-4">
                                    <label htmlFor="datus" className="block font-bold mb-2">
                                    {/* <label htmlFor="datus" className="block text-gray-700 font-bold mb-2"> */}
                                        Data Upload:
                                    </label>
                                    <span className="text-xs font-bold text-blue-500">Format: USERID*URL!</span>
                                    <textarea
                                        id="datus"
                                        name="datus"
                                        className="mt-5 w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                        rows={5}
                                        placeholder=""
                                        onChange={handleChange}
                                        // required
                                    />
                                </div>
                                {/* <div className="text-center">
                                    <button
                                        type="submit"
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                                        >
                                        Submit
                                    </button>
                                </div> */}
                            </form>

                            
                            <button 
                                className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ${
                                    fetchdis ? 'cursor-not-allowed opacity-50' : ''}`} 
                                onClick={handleFetchImages}
                                disabled={fetchdis}
                            >
                                { fetchdis ? 'Fetching Images...' : 'Fetch Images' }
                            </button>
                        <br />
                        <br />
                        
                        
                        </div>
                    </div>
                    <div className="col-span-1">
                        {/* <div className=" bg-gray-100 p-8 rounded shadow-md">
                            <span>Fetched... {ordernum} / {totalData}</span>
                            <br />
                            Latest USID: {fetching}
                            <br />
                            <br />
                            <button onClick={handleDownloadZip} disabled={!zipFile} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                                Download Zip
                            </button>
                            
                        </div> */}
                        
                        {
                            dlpage &&
                            <div className=" bg-gray-100 p-8 rounded shadow-md">
                                <span>Fetched... {ordernum} / {totalData}</span>
                                <br />
                                Latest USID: {fetching}
                                <br />
                                <br />
                                {
                                    btndl &&
                                    <button onClick={handleDownloadZip} disabled={!zipFile} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                                        Download Zip
                                    </button>
                                }
                            </div>
                        }
                        
                    </div>
                    
                
                <br />
                
                </div>
            </div>
        </>
    )
}

export default Dashboard
