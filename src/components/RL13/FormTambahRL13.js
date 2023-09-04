import React, { useState, useEffect } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { useNavigate, Link } from 'react-router-dom'
import style from './FormTambahRL13.module.css'
import { HiSaveAs } from 'react-icons/hi'
import { IoArrowBack } from 'react-icons/io5'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Table from 'react-bootstrap/Table'

const FormTambahRL31 = () => {
    const [tahun, setTahun] = useState('')
    const [namaRS, setNamaRS] = useState('')
    const [alamatRS, setAlamatRS] = useState('')
    const [namaPropinsi, setNamaPropinsi] = useState('')
    const [namaKabKota, setNamaKabKota] = useState('')
    const [dataRL, setDataRL] = useState([])
    const [token, setToken] = useState('')
    const [expire, setExpire] = useState('')
    const [buttonStatus, setButtonStatus] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        refreshToken()
        getRLSatuTitikTigaTemplate()
        const date = new Date();
        setTahun(date.getFullYear() - 1)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const refreshToken = async() => {
        try {
            const response = await axios.get('/apisirs/token')
            setToken(response.data.accessToken)
            const decoded = jwt_decode(response.data.accessToken)
            setExpire(decoded.exp)
            getDataRS(decoded.rsId)
        } catch (error) {
            if(error.response) {
                navigate('/')
            }
        }
    }

    const axiosJWT = axios.create()
    axiosJWT.interceptors.request.use(async(config) => {
        const currentDate = new Date()
        if (expire * 1000 < currentDate.getTime()) {
            const response = await axios.get('/apisirs/token')
            config.headers.Authorization = `Bearer ${response.data.accessToken}`
            setToken(response.data.accessToken)
            const decoded = jwt_decode(response.data.accessToken)
            setExpire(decoded.exp)
        }
        return config
    }, (error) => {
        return Promise.reject(error)
    })

    const getDataRS = async (id) => {
        try {
            const response = await axiosJWT.get('/apisirs/rumahsakit/' + id, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setNamaRS(response.data.data[0].nama)
            setAlamatRS(response.data.data[0].alamat)
            setNamaPropinsi(response.data.data[0].propinsi.nama)
            setNamaKabKota(response.data.data[0].kabKota.nama)
        } catch (error) {
            
        }
    }

    const getRLSatuTitikTigaTemplate = async() => {
        try {
            const response = await axiosJWT.get('/apisirs/jenispelayanan?rlid=27', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            
            const rlTemplate = response.data.data.map((value, index) => {
                return {
                    id: value.id,
                    no: value.no,
                    jenisPelayanan: value.nama,
                    jumlahTempatTidur: 0,
                    kelasVVIP: 0,
                    kelasVIP: 0,
                    kelas1: 0,
                    kelas2: 0,
                    kelas3: 0,
                    kelasKhusus: 0,
                    disabledInput: true,
                    checked: false
                }
            })
            setDataRL(rlTemplate)
        } catch (error) {
            console.log(error)
        }
    }

    const changeHandlerSingle = (event) => {
        setTahun(event.target.value)
    }

    const handleFocus = ((event) => {
        event.target.select()
    })

    const penjumlahanTempatTidurPerJenisPelayanan = ((index) => {
        let newDataRL = [...dataRL]
        newDataRL[index].jumlahTempatTidur = 
            parseInt(newDataRL[index].kelasVVIP) + 
            parseInt(newDataRL[index].kelasVIP) +
            parseInt(newDataRL[index].kelas1) +
            parseInt(newDataRL[index].kelas2) +
            parseInt(newDataRL[index].kelas3) +
            parseInt(newDataRL[index].kelasKhusus)
    })

    const changeHandler = (event, index) => {
        let newDataRL = [...dataRL]
        const name = event.target.name
        if (name === 'check') {
            if (event.target.checked === true) {
                newDataRL[index].disabledInput = false
            } else if (event.target.checked === false) {
                newDataRL[index].disabledInput = true
            }
            newDataRL[index].checked = event.target.checked
        } else if (name === 'jumlahTempatTidur') {
            if (event.target.value === '') {
                event.target.value = 0
                event.target.select(event.target.value)
            }
            newDataRL[index].jumlahTempatTidur = event.target.value
        } else if (name === 'kelasVVIP') {
            if (event.target.value === '') {
                event.target.value = 0
                event.target.select(event.target.value)
            }
            newDataRL[index].kelasVVIP = event.target.value
            penjumlahanTempatTidurPerJenisPelayanan(index)
        } else if (name === 'kelasVIP') {
            if (event.target.value === '') {
                event.target.value = 0
                event.target.select(event.target.value)
            }
            newDataRL[index].kelasVIP = event.target.value
            penjumlahanTempatTidurPerJenisPelayanan(index)
        } else if (name === 'kelas1') {
            if (event.target.value === '') {
                event.target.value = 0
                event.target.select(event.target.value)
            }
            newDataRL[index].kelas1 = event.target.value
            penjumlahanTempatTidurPerJenisPelayanan(index)
        } else if (name === 'kelas2') {
            if (event.target.value === '') {
                event.target.value = 0
                event.target.select(event.target.value)
            }
            newDataRL[index].kelas2 = event.target.value
            penjumlahanTempatTidurPerJenisPelayanan(index)
        } else if (name === 'kelas3') {
            if (event.target.value === '') {
                event.target.value = 0
                event.target.select(event.target.value)
            }
            newDataRL[index].kelas3 = event.target.value
            penjumlahanTempatTidurPerJenisPelayanan(index)
        } else if (name === 'kelasKhusus') {
            if (event.target.value === '') {
                event.target.value = 0
                event.target.select(event.target.value)
            }
            newDataRL[index].kelasKhusus = event.target.value
            penjumlahanTempatTidurPerJenisPelayanan(index)
        }
        setDataRL(newDataRL)
    }

    const Simpan = async (e) => {
        e.preventDefault()
        setButtonStatus(true)
        try {
            const dataRLArray = dataRL.filter((value) => {
                return value.checked === true
            }).map((value, index) => {
                return {
                    "jenisPelayananId": value.id,
                    "jumlahTempatTidur": value.jumlahTempatTidur,
                    "kelasVVIP": value.kelasVVIP,
                    "kelasVIP": value.kelasVIP,
                    "kelas1": value.kelas1,
                    "kelas2": value.kelas2,
                    "kelas3": value.kelas3,
                    "kelasKhusus": value.kelasKhusus
                }
            })

            const customConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }

            await axiosJWT.post('/apisirs/rlsatutitiktiga',{
                tahun: parseInt(tahun),
                data: dataRLArray
            }, customConfig)
            
            
            toast('Data Berhasil Disimpan', {
                position: toast.POSITION.TOP_RIGHT
            })
            setTimeout(() => {
                navigate('/rl13')
            }, 1000);
        } catch (error) {
            console.log(error)
            toast(`Data tidak bisa disimpan karena ,${error.response.data.message}`, {
                position: toast.POSITION.TOP_RIGHT
            })
            setButtonStatus(false)
        }
    }

    const preventPasteNegative = (e) => {
        const clipboardData = e.clipboardData || window.clipboardData;
        const pastedData = parseFloat(clipboardData.getData('text'));
    
        if (pastedData < 0) {
            e.preventDefault();
        }
    }
    
    const preventMinus = (e) => {
        if (e.code === 'Minus') {
            e.preventDefault();
        }
    }

    return (
        <div className="container" style={{marginTop: "70px"}}>
            <form onSubmit={Simpan}>
                <div className="row">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title h5">Profile Fasyankes</h5>
                                <div className="form-floating" style={{width:"100%", display:"inline-block"}}>
                                    <input type="text" className="form-control" id="floatingInput"
                                        value={ namaRS } disabled={true}/>
                                    <label htmlFor="floatingInput">Nama</label>
                                </div>
                                <div className="form-floating" style={{width:"100%", display:"inline-block"}}>
                                    <input type="text" className="form-control" id="floatingInput"
                                        value={ alamatRS} disabled={true}/>
                                    <label htmlFor="floatingInput">Alamat</label>
                                </div>
                                <div className="form-floating" style={{width:"50%", display:"inline-block"}}>
                                    <input type="text" className="form-control" id="floatingInput"
                                        value={ namaPropinsi } disabled={true}/>
                                    <label htmlFor="floatingInput">Provinsi </label>
                                </div>
                                <div className="form-floating" style={{width:"50%", display:"inline-block"}}>
                                    <input type="text" className="form-control" id="floatingInput"
                                        value= { namaKabKota } disabled={true}/>
                                    <label htmlFor="floatingInput">Kab/Kota</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title h5">Periode Laporan</h5>
                                <div className="form-floating" style={{width:"100%", display:"inline-block"}}>
                                    <input name="tahun" type="text" className="form-control" id="floatingInput" 
                                        placeholder="Tahun" value={tahun} onChange={e => changeHandlerSingle(e)} disabled={true}/>
                                    <label htmlFor="floatingInput">Tahun</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-12">
                        <Link to={`/rl13/`} className='btn btn-info' style={{fontSize:"18px", backgroundColor: "#779D9E", color: "#FFFFFF"}}>
                            {/* <IoArrowBack size={30} style={{color:"gray",cursor: "pointer"}}/> */}
                            {/* <span style={{color: "gray"}}>RL 1.3 Tempat Tidur</span> */}
                            &lt;
                        </Link>
                        <span style={{color: "gray"}}>RL 1.3 Tempat Tidur</span>
                        <Table className={style.rlTable} responsive bordered style={{widows: "100%"}}>
                            <thead>
                                <tr>
                                    <th rowSpan="2" style={{"width": "4%"}}>No.</th>
                                    <th rowSpan="2" style={{"width": "3%"}}></th>
                                    <th rowSpan="2" style={{"width": "15%"}}>Jenis Pelayanan</th>
                                    <th rowSpan="2">Jumlah Tempat Tidur</th>
                                    <th colSpan="6">Kelas</th>
                                </tr>
                                <tr>
                                    <th>VVIP</th>
                                    <th>VIP</th>
                                    <th>1</th>
                                    <th>2</th>
                                    <th>3</th>
                                    <th>Khusus</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataRL.map((value, index) => {
                                    return (
                                        <tr key={value.id}>
                                            <td>
                                                <input type='text' name='id' className="form-control" value={value.no} disabled={true}/>
                                            </td>
                                            <td style={{textAlign: "center", verticalAlign: "middle"}}>
                                                <input type="checkbox" name='check' className="form-check-input" onChange={e => changeHandler(e, index)} checked={value.checked}/>
                                            </td>
                                            <td>
                                                <input type="text" name="jenisPelayanan" className="form-control" value={value.jenisPelayanan} disabled={true} />
                                            </td>
                                            <td><input type="number" name="jumlahTempatTidur" className="form-control" value={value.jumlahTempatTidur} 
                                                onFocus={handleFocus} onChange={e => changeHandler(e, index)} disabled={true} min={0} onPaste={preventPasteNegative}
                                                onKeyPress={preventMinus}/>
                                            </td>
                                            <td><input type="number" name="kelasVVIP" className="form-control" value={value.kelasVVIP} 
                                                onFocus={handleFocus} onChange={e => changeHandler(e, index)} disabled={value.disabledInput} min={0} onPaste={preventPasteNegative}
                                                onKeyPress={preventMinus}/>
                                            </td>
                                            <td><input type="number" name="kelasVIP" className="form-control" value={value.kelasVIP} 
                                                onFocus={handleFocus} onChange={e => changeHandler(e, index)} disabled={value.disabledInput} min={0} onPaste={preventPasteNegative}
                                                onKeyPress={preventMinus}/>
                                            </td>
                                            <td><input type="number" name="kelas1" className="form-control" value={value.kelas1} 
                                                onFocus={handleFocus} onChange={e => changeHandler(e, index)} disabled={value.disabledInput} min={0} onPaste={preventPasteNegative}
                                                onKeyPress={preventMinus}/>
                                            </td>
                                            <td><input type="number" name="kelas2" className="form-control" value={value.kelas2} 
                                                onFocus={handleFocus} onChange={e => changeHandler(e, index)} disabled={value.disabledInput} min={0} onPaste={preventPasteNegative}
                                                onKeyPress={preventMinus}/>
                                            </td>
                                            <td><input type="number" name="kelas3" className="form-control" value={value.kelas3} 
                                                onFocus={handleFocus} onChange={e => changeHandler(e, index)} disabled={value.disabledInput} min={0} onPaste={preventPasteNegative}
                                                onKeyPress={preventMinus}/>
                                            </td>
                                            <td><input type="number" name="kelasKhusus" className="form-control" value={value.kelasKhusus} 
                                                onFocus={handleFocus} onChange={e => changeHandler(e, index)} disabled={value.disabledInput} min={0} onPaste={preventPasteNegative}
                                                onKeyPress={preventMinus}/>
                                            </td>
                                        </tr>
                                    )
                                }) }
                            </tbody>
                        </Table>
                    </div>
                </div>
                <div className="mt-3 mb-3">
                    <ToastContainer />
                    <button type="submit" className="btn btn-outline-success" disabled={buttonStatus}><HiSaveAs/> Simpan</button>
                </div>
            </form>
        </div>
    )
}

export default FormTambahRL31